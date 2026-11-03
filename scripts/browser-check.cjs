const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const base=process.env.TEST_URL||'http://127.0.0.1:8000/';
 for(const width of [1440,390,320]){
  const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.locator('.hero').waitFor();
  const routes=await page.locator('.nav-btn').evaluateAll(xs=>xs.map(x=>x.dataset.nav));
  for(const route of routes){
   await page.evaluate(r=>document.querySelector(`[data-nav="${r}"]`).click(),route);
   assert.equal(await page.evaluate(()=>location.hash),'#'+route);
   assert.ok(await page.locator('main').innerText());
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}: overflow ${route}`);
  }
  await page.goto(base+'#programme');
  await page.locator('[data-check]').first().check();await page.reload();assert.equal(await page.locator('[data-check]').first().isChecked(),true);
  await page.goto(base+'#interactive');
  const data=await page.evaluate(()=>window.GH_DATA.lessonInteractions[0]);
  for(let i=0;i<5;i++) await page.locator(`[data-lesson-answer="${i}"][value="${data.questions[i][2]}"]`).check();
  await page.locator('[data-act="check-interactive"]').click();assert.match(await page.locator('.self-result').innerText(),/5 \/ 5/);
  await page.goto(base+'#quiz');await page.locator('[data-act="start-quiz"]').click();
  while(await page.locator('[data-act="quiz-answer"]').count()){
   const q=await page.locator('.question').innerText();
   const answer=await page.evaluate(q=>{const item=GH_DATA.quiz.find(x=>x[1]===q);return item[2][item[3]];},q);
   await page.locator('[data-act="quiz-answer"]').filter({hasText:answer}).first().click();
   await page.locator('[data-act="quiz-next"]').click();
  }
  assert.equal(await page.locator('.score-hero').innerText(),'100%');
  await page.goto(base+'#hightea');
  await page.locator('[data-scope="inv"][data-key="title"]').fill('Samen aan tafel');await page.waitForTimeout(500);
  assert.ok((await page.locator('.print-page').first().innerText()).includes('Samen aan tafel'));
  await page.goto(base+'docent.html#documents');assert.equal(await page.locator('[data-file-path]').count(),0);assert.ok(await page.locator('.doc-card').count()>0);
  await page.goto(base+'docent.html#teacher');
  await page.evaluate(()=>{
   const key='maris-gastheerschap-v1.2',s=JSON.parse(localStorage.getItem(key)),r=s.profiles[s.active].rubric;
   for(const section of GH_DATA.rubric.sections){if(section.id==='cooking'){for(let cook=1;cook<=5;cook++)r.cooking[cook]=Object.fromEntries(section.criteria.map(c=>[c[0],3]));}else r[section.id]=Object.fromEntries(section.criteria.map(c=>[c[0],3]));}
   localStorage.setItem(key,JSON.stringify(s));
  });await page.reload();assert.match(await page.locator('.score-table').first().innerText(),/10,0/);
  assert.deepEqual(errors,[]);console.log(`PASS ${width}px: alle leerlingroutes, opslag, zelftoets, uitnodiging, bibliotheek, rubric 10,0; geen overflow of JS-fouten`);
  await page.screenshot({path:`/tmp/gastheerschap-${width}.png`,fullPage:true});await context.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
