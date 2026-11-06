const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const base=process.env.TEST_URL||'http://127.0.0.1:8000/';
 for(const width of [1440,390,320]){
  const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'?periode=2');await page.locator('.hero').waitFor();
  assert.equal(await page.locator('.meeting-button').count(),8);
  for(const design of ['1','2','3']){
   await page.locator(`button[data-design="${design}"]`).click();await page.reload();
   assert.equal(await page.locator('body').getAttribute('data-design'),design);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  await page.locator('button[data-design="1"]').click();
  for(const img of await page.locator('img').all())assert.ok(await img.evaluate(el=>el.complete&&el.naturalWidth>0),'afbeelding geladen');
  await page.screenshot({path:`/tmp/gastheerschap-home-${width}.png`,fullPage:true});
  await page.locator('.meeting-button').nth(7).click();assert.match(await page.locator('.meeting-button.selected').innerText(),/8/);
  await page.goBack();await page.locator('.hero').waitFor();
  const routes=await page.locator('.nav-btn').evaluateAll(xs=>xs.map(x=>x.dataset.nav));
  for(const route of routes){
   await page.evaluate(r=>document.querySelector(`[data-nav="${r}"]`).click(),route);
   assert.equal(await page.evaluate(()=>location.hash),'#'+route);
   assert.ok(await page.locator('main').innerText());
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}: overflow ${route}`);
  }
  await page.goto(base+'?periode=2#programme');await page.locator('.meeting-button').first().click();
  await page.locator('[data-check]').first().check();await page.reload();assert.equal(await page.locator('[data-check]').first().isChecked(),true);
  await page.goto(base+'?periode=2#interactive');
  const data=await page.evaluate(()=>window.GH_DATA.lessonInteractions[0]);
  for(let i=0;i<5;i++) await page.locator(`[data-lesson-answer="${i}"][value="${data.questions[i][2]}"]`).check();
  await page.locator('[data-act="check-interactive"]').click();assert.match(await page.locator('.self-result').innerText(),/5 \/ 5/);
  await page.goto(base+'?periode=2#quiz');await page.locator('[data-act="start-quiz"]').click();
  while(await page.locator('[data-act="quiz-answer"]').count()){
   const q=await page.locator('.question').innerText();
   const answer=await page.evaluate(q=>{const item=GH_DATA.quiz.find(x=>x[1]===q);return item[2][item[3]];},q);
   await page.locator('[data-act="quiz-answer"]').filter({hasText:answer}).first().click();
   await page.locator('[data-act="quiz-next"]').click();
  }
  assert.equal(await page.locator('.score-hero').innerText(),'100%');
  await page.goto(base+'?periode=2#hightea');
  await page.locator('[data-scope="inv"][data-key="title"]').fill('Samen aan tafel');await page.waitForTimeout(500);
  assert.ok((await page.locator('.print-page').first().innerText()).includes('Samen aan tafel'));
  await page.goto(base+'docent.html?periode=2#documents');assert.equal(await page.locator('[data-file-path]').count(),0);assert.ok(await page.locator('.doc-card').count()>0);
  await page.goto(base+'docent.html?periode=2#teacher');
  await page.evaluate(()=>{
   const key='maris-gastheerschap-v1.2',s=JSON.parse(localStorage.getItem(key)),r=s.profiles[s.active].rubric;
   for(const section of GH_DATA.rubric.sections){if(section.id==='cooking'){for(let cook=1;cook<=5;cook++)r.cooking[cook]=Object.fromEntries(section.criteria.map(c=>[c[0],3]));}else r[section.id]=Object.fromEntries(section.criteria.map(c=>[c[0],3]));}
   localStorage.setItem(key,JSON.stringify(s));
  });await page.reload();assert.match(await page.locator('.score-table').first().innerText(),/10,0/);
  assert.deepEqual(errors,[]);console.log(`PASS ${width}px: alle leerlingroutes, opslag, zelftoets, uitnodiging, bibliotheek, rubric 10,0; geen overflow of JS-fouten`);
  await page.screenshot({path:`/tmp/gastheerschap-${width}.png`,fullPage:true});await context.close();
 }
 for(const width of [1440,390,320]){
  const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'?periode=1');
  assert.equal(await page.locator('.meeting-button').count(),3);
  assert.match(await page.locator('main').innerText(),/vier docenten/);
  const popupPromise=context.waitForEvent('page',{timeout:10000});await page.locator('.meeting-button').first().click();
  const popup=await popupPromise;await popup.waitForLoadState();assert.match(popup.url(),/bijeenkomst-1.html/);
  assert.equal(await popup.locator('.instruction-image').count(),5);
  for(const img of await popup.locator('.instruction-image').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());}
  await popup.locator('#indekken').scrollIntoViewIfNeeded();await popup.screenshot({path:`/tmp/gastheerschap-les1-${width}.png`});
  await popup.locator('#portions').fill('16');assert.match(await popup.locator('#shopping-list').innerText(),/16 vierkante plakjes/);
  await popup.locator('#lesson-checklist input').first().check();await popup.reload();assert.equal(await popup.locator('#lesson-checklist input').first().isChecked(),true);
  assert.ok(await popup.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await popup.close();
  await page.goto(base+'?periode=1#programme');
  assert.match(await page.locator('main').innerText(),/4 × 20 min/);
  await page.locator('[data-check]').first().check();await page.reload();
  assert.equal(await page.locator('[data-check]').first().isChecked(),true);
  await page.goto(base+'?periode=2#programme');assert.equal(await page.locator('.meeting-button').count(),8);
  assert.equal(await page.locator('[data-check]').first().isChecked(),false);
  await page.goto(base+'?periode=1#hightea');
  await page.locator('[data-lunch-count]').fill('12');await page.locator('[data-lunch-count]').dispatchEvent('change');
  assert.match(await page.locator('main').innerText(),/16/);
  const routes=await page.locator('.nav-btn').evaluateAll(xs=>xs.map(x=>x.dataset.nav));
  for(const route of routes){
   await page.evaluate(r=>document.querySelector(`[data-nav="${r}"]`).click(),route);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`periode 1 ${width}px overflow ${route}`);
   assert.doesNotMatch(await page.locator('main').innerText(),/Nolenshage|acht bijeenkomsten|minimaal vijf/i);
  }
  await page.goto(base+'docent.html?periode=1#teacher');
  assert.equal(await page.locator('[data-uivalue="cook"] option').count(),3);
  await page.evaluate(()=>{
   const k='maris-gastheerschap-periode1-v1',s=JSON.parse(localStorage.getItem(k)),r=s.profiles[s.active].rubric;
   for(const sec of GH_DATA.rubric.sections){if(sec.id==='cooking'){for(let i=1;i<=3;i++)r.cooking[i]=Object.fromEntries(sec.criteria.map(c=>[c[0],3]));}else r[sec.id]=Object.fromEntries(sec.criteria.map(c=>[c[0],3]));}
   localStorage.setItem(k,JSON.stringify(s));
  });await page.reload();assert.match(await page.locator('.score-table').first().innerText(),/10,0/);
  await page.goto(base+'?periode=1');await page.screenshot({path:`/tmp/gastheerschap-periode1-${width}.png`,fullPage:true});
  assert.deepEqual(errors,[]);console.log(`PASS periode 1 ${width}px: 3 lessen, alle routes, gescheiden opslag, porties en rubric; geen JS-fouten of overflow`);
  await context.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
