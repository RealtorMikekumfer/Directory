import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const rows=JSON.parse(fs.readFileSync('dist/providers_clean.json','utf8'));
assert(Array.isArray(rows),'Directory must be a JSON array');
const ids=new Set();
for(const row of rows){assert.equal(typeof row.Company,'string');assert(row.Company.trim(),'Company is required');assert.equal(typeof row.Category,'string');assert(row.Category.trim(),'Category is required');const id=`${row.Company}-${row.Contact}`;assert(!ids.has(id),'Duplicate company/contact');ids.add(id);for(const value of Object.values(row))assert(['string','number'].includes(typeof value),'Fields must be text or a rating number');}
const config=JSON.parse(fs.readFileSync('dist/config.json','utf8'));assert(/^\d{10}$/.test(config.phone),'Michael phone must be 10 digits');
for(const file of ['app.js','editor.js','data.js'])new vm.Script(fs.readFileSync(`dist/${file}`,'utf8'),{filename:file});
// Exercise the actual contact validation helpers without starting the DOM app.
const source=fs.readFileSync('dist/app.js','utf8');
const helperSource=source.slice(source.indexOf('const idFor='),source.indexOf('let providers='));
const context=vm.createContext({});vm.runInContext(helperSource+';this.helpers={idFor,group,phoneFor,emailFor};',context);
assert.equal(config.githubRepository,'RealtorMikekumfer/Directory');
const h=context.helpers;
assert.equal(h.phoneFor({number:'(260) 739-9590'}),'+12607399590');
assert.equal(h.phoneFor({number:'(260) 555-0128'}),'','Reserved placeholder number must not become a call link');
assert.equal(h.phoneFor({number:''}),'');assert.equal(h.phoneFor({number:'1 (260) 739-9590'}),'+12607399590');
assert.equal(h.emailFor({email:'hello@example.com'}),'hello@example.com');assert.equal(h.emailFor({email:'not-an-email'}),'');
assert.equal(h.group({Company:'Hamiltons Handyman',Category:'Home Services'}),'Handyman');
assert.equal(h.group({Company:'Farmers Insurance',Category:'Home Services'}),'Insurance');
assert.equal(new Set(rows.map(h.idFor)).size,rows.length,'Contact deep-link IDs must be unique');
for(const file of ['index.html','editor.html']){const html=fs.readFileSync(`dist/${file}`,'utf8');for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const path=match[1];if(/^(https?:|tel:|mailto:|\.\/)/.test(path))continue;assert(fs.existsSync(`dist/${path}`),`Missing asset: ${path}`);}}
console.log(`PASS: ${rows.length} providers; unique contact links; valid assets and scripts; contact safety and category checks.`);

// Confirm that updates come from this repository, and stale data cannot be edited.
const loaderCode=fs.readFileSync('dist/data.js','utf8');
const liveURL='https://raw.githubusercontent.com/RealtorMikekumfer/Directory/main/dist/providers_clean.json';
async function exerciseLoader(remoteValue,requireLive=false){
  const requests=[];
  const loaderContext=vm.createContext({window:{},AbortController,setTimeout,clearTimeout,fetch:async url=>{
    requests.push(url);
    if(url==='config.json')return {ok:true,json:async()=>config};
    if(url===liveURL){if(remoteValue instanceof Error)throw remoteValue;return {ok:true,json:async()=>remoteValue};}
    if(url==='providers_clean.json')return {ok:true,json:async()=>rows};
    throw Error('Unexpected data source: '+url);
  }});
  vm.runInContext(loaderCode,loaderContext);
  return {result:await loaderContext.window.DirectoryData.load({requireLive}),requests};
}
const updated=[{Company:'Updated test contact',Category:'HVAC'}];
const live=await exerciseLoader(updated);assert.equal(live.result.data[0].Company,'Updated test contact');assert.equal(live.result.isLive,true);assert(!live.requests.includes('providers_clean.json'),'Live data must take precedence');
const fallback=await exerciseLoader(new Error('Unavailable'));assert.equal(fallback.result.isLive,false);assert.equal(fallback.result.data.length,rows.length);
await assert.rejects(()=>exerciseLoader(new Error('Unavailable'),true),'Manager must not edit the stale fallback');
const invalid=await exerciseLoader({invalid:true});assert.equal(invalid.result.isLive,false);
console.log('PASS: GitHub live list takes precedence; outage and invalid-data fallbacks are flagged; manager refuses stale data.');
