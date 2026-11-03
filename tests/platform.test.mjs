import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const dir=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(dir,p),'utf8');
const ctx={window:{}};
vm.runInNewContext(read('assets/content.js'),ctx,{timeout:1500});
const data=ctx.window.GH_DATA;
const app=read('assets/app.js');
const html=read('index.html'), teacher=read('docent.html');

test('leerling en docent delen één app-codebasis',()=>{
 assert.match(html,/assets\/content\.js/);assert.match(teacher,/assets\/app\.js/);
 assert.match(html,/data-mode="student"/); assert.match(teacher,/data-mode="teacher"/);
 assert.match(app,/isTeacher\?'index\.html':'docent\.html'/);
});
test('acht bijeenkomsten en zes kookrecepten behouden',()=>{
 assert.equal(data.sessions.length,8);assert.ok(data.recipes.length>=5);
 assert.ok(data.sessions.every(s=>s.id && s.tasks.length>0));
});
test('SE-theorie blijft beperkt tot hoofdstuk 1,2,4,6',()=>{
 const se=Array.from(data.chapters.filter(x=>x.se),x=>x.n).join(',');
 assert.equal(se,'1,2,4,6');
 assert.ok(data.chapters.every(c=>c.topics?.length));
});
test('high tea Nolenshage en open datum blijven bewaard',()=>{
 assert.match(JSON.stringify(data.meta),/Nolenshage/);
 assert.match(app,/hightea/);assert.match(app,/eventDate/);
});
test('transparante rubric met gewichten 30 20 20 20 10',()=>{
 assert.deepEqual(Array.from(data.rubric.sections,x=>x.weight),[30,20,20,20,10]);
 assert.equal(data.rubric.sections[0].criteria.length*3,48);
 assert.match(app,/completeCooks\.length>=5/);
 assert.match(app,/result\.grade/);
});
test('zelfnakijken, voortgang en lokaal bewaren behouden',()=>{
 assert.match(app,/interactiveChecked/);assert.match(app,/quizHistory/);
 assert.match(app,/localStorage\.setItem/);assert.match(app,/localStorage\.getItem/);
 assert.match(app,/data-check/);
});
test('mobiele navigatie en toegankelijkheid',()=>{
 assert.match(app,/mobile-view-select/);assert.match(app,/main-content/);
 assert.match(read('assets/site.css'),/max-width:390px/);
 assert.match(read('assets/site.css'),/prefers-reduced-motion/);
 assert.match(html,/skip-link/);
});
test('lokale documentenbibliotheek: bestanden echt aanwezig',{skip:!fs.existsSync(path.join(dir,'docenten-documenten'))},()=>{
 assert.match(read('assets/content.js'),/GH_DOCUMENTS/);
 for(const file of ['docenten-documenten/les-1-broodje-hete-kip.pptx','docenten-documenten/les-2-minipizza-appelflappen.pptx','docenten-documenten/les-3-instructievideo.pptx','docenten-documenten/theorie-hbr-p1-3e-druk.docx','docenten-documenten/aftekenlijst-koken.docx','docenten-documenten/beoordelingsformulieren-gastheerschap.docx']) {
 assert.ok(fs.statSync(path.join(dir,file)).size>5000,file);
 }
});
test('geen ingebedde 20 MB documenten in docent.html',()=>{
 assert.ok(fs.statSync(path.join(dir,'docent.html')).size<5000);
 assert.doesNotMatch(app,/atob\(/);
});

test('openbare versie deelt geen bronafbeeldingen of documentdownloads',()=>{
 assert.doesNotMatch(read('assets/content.js'),/data:image/);
 assert.match(app,/window.GH_DOCUMENT_ACCESS/);
 assert.match(read('.gitignore'),/docenten-documenten\//);
});
test('beide ingangen gebruiken bestaande relatieve assets',()=>{
 for(const page of [html,teacher])for(const [,href] of page.matchAll(/(?:src|href)="(assets\/[^"#]+)"/g))assert.ok(fs.existsSync(path.join(dir,href)),href);
});
