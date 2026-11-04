'use strict';
const $ = (s) => document.querySelector(s);
const icons = {
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
 bookmark:'<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17l-6-4z"/>',
 share:'<path d="M12 16V3m-4 4 4-4 4 4M5 13v7h14v-7"/>',
 phone:'<path d="M8 3 5 4c-2 1-1 7 3 11s10 5 11 3l1-3-5-2-2 2c-2-1-3-2-4-4l2-2z"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
 pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
 home:'<path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-8h6v8"/>',
 bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
 hvac:'<path d="M3 8h12c6 0 5-7 1-5M3 12h16M3 16h10c6 0 5 7 1 5"/>',
 tools:'<path d="m14 6 4 4M3 21l7-7M4 3l5 5-2 2-5-5zM10 11l10 10M14 10a6 6 0 0 0 7-7l-4 4-3-3 4-3a6 6 0 0 0-7 7"/>',
 lender:'<path d="m2 9 10-6 10 6H2ZM3 21h18M5 12v6m7-6v6m7-6v6"/>',
 inspect:'<path d="m3 10 8-7 8 7M5 9v11h5"/><circle cx="16" cy="15" r="4"/><path d="m19 18 3 3"/>',
 plumbing:'<path d="M5 3v7a7 7 0 0 0 7 7h6m-13-7H2m7 0h3v2h6M18 10v9M3 3h4M22 7s-3 4-3 6a3 3 0 0 0 6 0c0-2-3-6-3-6Z" transform="scale(.9)"/>',
 leaf:'<path d="M20 3C5 2 2 8 5 15s16 5 15-12ZM4 21 16 9"/>',
 title:'<path d="M5 3h10l4 4v14H5zM14 3v5h5M8 12h8M8 16h5"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>'
};
const icon=(name)=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name]||icons.home}</svg>`;
const esc=(str='')=>String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const idFor=(p)=>`${p.Company}-${p.Contact}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const group=(p)=>/handyman/i.test(p.Company)?'Handyman':/insurance/i.test(p.Company)?'Insurance':p.Category;
const glyph=(cat)=>({'Mortgage Lender':'lender','Electrician':'bolt','HVAC':'hvac','Handyman':'tools','Home Inspector':'inspect','Plumbing':'plumbing','Landscaping':'leaf','Title Company':'title','Roofing':'home','Insurance':'title'}[cat]||'home');
const label=(cat)=>({'Mortgage Lender':'Lenders','Electrician':'Electricians','Home Inspector':'Inspections','Home Services':'Home services','Title Company':'Title companies'}[cat]||cat);
const phoneFor=(p)=>{const n=String(p.number||'').replace(/\D/g,'').replace(/^1(?=\d{10}$)/,'');return /^\d{10}$/.test(n)&&!/^\d{3}55501\d{2}$/.test(n)?`+1${n}`:'';};
const emailFor=(p)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email||'')?p.email:'';
let providers=[],config={},saved=new Set(),savedOnly=false,activeId=null;
try{const raw=JSON.parse(localStorage.getItem('kumfer-saved-v1')||'[]');if(Array.isArray(raw))saved=new Set(raw.filter(x=>typeof x==='string'));}catch{}
let toastTimer;
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3500);}
function saveToggle(id){saved.has(id)?saved.delete(id):saved.add(id);try{localStorage.setItem('kumfer-saved-v1',JSON.stringify([...saved]));}catch{toast('Your browser could not save this list.');}render();if(activeId)showDetails(activeId,false);}
function hydrateIcons(){document.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=icon(el.dataset.icon);});}
function render(){
 const term=$('#search').value.trim().toLowerCase(),category=$('#category').value;
 let list=providers.filter(p=>(!savedOnly||saved.has(idFor(p)))&&(!category||group(p)===category)&&term.split(/\s+/).every(word=>[p.Company,p.Contact,p.Category,group(p),p.Specialty,p.Service_Area,p['Main Location'],p.email,p.number,label(group(p)),group(p)==='HVAC'?'heating cooling furnace air conditioning':''].join(' ').toLowerCase().includes(word)));
 list.sort((a,b)=>($('#sort').value==='category'?group(a).localeCompare(group(b)):0)||a.Company.localeCompare(b.Company));
 $('#resultCount').textContent=`${list.length} ${list.length===1?'connection':'connections'}${savedOnly?' saved':category?` · ${label(category)}`:''}`;
 $('#savedCount').textContent=providers.filter(p=>saved.has(idFor(p))).length;$('#savedNav').setAttribute('aria-pressed',savedOnly);
 $('#clear').classList.toggle('hidden',!term&&!category&&!savedOnly);
 $('#empty').classList.toggle('hidden',!!list.length);$('#emptyText').textContent=savedOnly?'Tap the bookmark on a contact to keep it here.':'Try a different search or explore all services.';
 document.querySelectorAll('.service-tile').forEach(b=>b.setAttribute('aria-pressed',b.dataset.category===category));
 $('#providers').innerHTML=list.map(p=>{
 const id=idFor(p),cat=group(p),phone=phoneFor(p),email=emailFor(p);
 return `<article class="provider-card"><div class="card-top"><span class="category-label">${icon(glyph(cat))}${esc(cat)}</span><button class="icon-button bookmark" data-save="${id}" aria-label="${saved.has(id)?'Unsave':'Save'} ${esc(p.Company)}" aria-pressed="${saved.has(id)}">${icon('bookmark')}</button></div><h3>${esc(p.Company)}</h3><p class="contact-name">${esc(p.Contact||'Contact the team')}</p><p class="card-specialty">${esc(p.Specialty||`${cat} · Contact for service details.`)}</p><p class="card-location">${icon('pin')}<span>${esc(p.Service_Area||p['Main Location']||'Contact for service area')}</span></p><div class="card-actions">${phone?`<a class="button primary" href="tel:${phone}" aria-label="Call ${esc(p.Company)}">${icon('phone')} Call ${esc(p.Contact&&p.Contact!=='Service Team'?p.Contact.split(' ')[0]:'the team')}</a>`:email?`<a class="button primary" href="mailto:${esc(email)}">${icon('mail')} Email contact</a>`:`<a class="button primary" href="tel:+1${config.phone}">${icon('phone')} Ask Michael</a>`}<button class="button detail-button" data-details="${id}" aria-label="View details for ${esc(p.Company)}">Details ${icon('info')}</button></div></article>`;
 }).join('');
}
function reset(){savedOnly=false;$('#search').value='';$('#category').value='';render();}
function showDetails(id,open=true){
 const p=providers.find(x=>idFor(x)===id);if(!p)return;activeId=id;
 const cat=group(p),phone=phoneFor(p),email=emailFor(p);
 $('#detailBody').innerHTML=`<span class="category-label">${icon(glyph(cat))}${esc(cat)}</span><h2 class="detail-title" id="detailTitle">${esc(p.Company)}</h2><p class="contact-name">${esc(p.Contact)}</p>${p.Specialty?`<section class="detail-section"><h3>Services</h3><p>${esc(p.Specialty)}</p></section>`:''}<section class="detail-section"><h3>Service area</h3><p>${esc(p.Service_Area||'Contact to confirm')}${p['Main Location']?` · ${esc(p['Main Location'])}`:''}</p></section>${p.Testimonial?`<section class="detail-section"><h3>From the directory</h3><blockquote>${esc(p.Testimonial)}</blockquote></section>`:''}<div class="detail-links">${phone?`<a class="button primary" href="tel:${phone}">${icon('phone')} ${esc(p.number)}</a>`:''}${email?`<a class="button outline" href="mailto:${esc(email)}">${icon('mail')} ${esc(email)}</a>`:''}${!phone?`<a class="button ${email?'outline':'primary'}" href="tel:+1${config.phone}">${icon('phone')} Ask Michael for help</a>`:''}<button class="button outline" data-save="${id}">${icon('bookmark')} ${saved.has(id)?'Remove from saved':'Save to my list'}</button><button class="button outline" data-share="${id}">${icon('share')} Share contact</button>${phone||email?`<button class="text-button" data-vcard="${id}">Add to phone contacts <span aria-hidden="true">↓</span></button>`:''}</div><p class="detail-note">${p.number&&!phone?'A phone number in the original list needs confirmation. ':''}Confirm details directly with the provider. Directory notes are imported recommendations, not independently verified reviews.</p>`;
 if(open&&!$('#details').open){$('#details').showModal();$('#closeDetails').focus();}
}
async function share(url,title){
 try{if(navigator.share){await navigator.share({title,url});return;}if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(url);toast('Link copied. Ready to share.');return;}}catch(e){if(e.name==='AbortError')return;}
 window.prompt('Copy this link to share:',url);
}
function downloadContact(id){const p=providers.find(x=>idFor(x)===id);if(!p)return;const safe=s=>String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');const text=['BEGIN:VCARD','VERSION:3.0',`FN:${safe(p.Contact||p.Company)}`,`ORG:${safe(p.Company)}`,phoneFor(p)?`TEL;TYPE=WORK:${phoneFor(p)}`:'',emailFor(p)?`EMAIL:${safe(p.email)}`:'','END:VCARD'].filter(Boolean).join('\r\n')+'\r\n';const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/vcard'}));a.download=`${id}.vcf`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
async function load(){
 $('#error').classList.add('hidden');$('#empty').classList.add('hidden');
 try{
 const {data,settings,isLive}=await DirectoryData.load();
 $('#dataNotice').classList.toggle('hidden',isLive);
 providers=data;config=settings;
 document.querySelectorAll('.mike-call').forEach(a=>a.href=`tel:+1${config.phone}`);document.querySelectorAll('.mike-email').forEach(a=>a.href=`mailto:${config.email}`);
 const selected=$('#category').value;$('#category').innerHTML='<option value="">All services</option>'+[...new Set(data.map(group))].sort((a,b)=>label(a).localeCompare(label(b))).map(cat=>`<option value="${esc(cat)}">${esc(label(cat))}</option>`).join('');$('#category').value=selected;
 const quick=['Mortgage Lender','HVAC','Electrician','Handyman','Plumbing','Home Inspector'];$('#quickServices').innerHTML=quick.map(cat=>`<button class="service-tile" data-category="${cat}" aria-pressed="false">${icon(glyph(cat))}${label(cat)}</button>`).join('');
 render();const deep=new URLSearchParams(location.hash.slice(1)).get('provider');if(deep)showDetails(deep);
 }catch(e){$('#providers').replaceChildren();$('#error').classList.remove('hidden');$('#resultCount').textContent='Directory unavailable';}
}
document.addEventListener('click',e=>{const button=e.target.closest('[data-save],[data-details],[data-category],[data-share],[data-vcard]');if(!button)return;if(button.dataset.save)saveToggle(button.dataset.save);if(button.dataset.details)showDetails(button.dataset.details);if(button.dataset.category){$('#category').value=$('#category').value===button.dataset.category?'':button.dataset.category;savedOnly=false;render();}if(button.dataset.share)share(`${location.origin}${location.pathname}#provider=${encodeURIComponent(button.dataset.share)}`,'Kumfer Home Directory · Contact');if(button.dataset.vcard)downloadContact(button.dataset.vcard);});
$('#search').addEventListener('input',render);$('#category').addEventListener('change',render);$('#sort').addEventListener('change',render);$('#clear').addEventListener('click',reset);$('#resetEmpty').addEventListener('click',reset);$('#retry').addEventListener('click',load);
$('#savedNav').addEventListener('click',()=>{savedOnly=!savedOnly;$('#search').value='';$('#category').value='';render();$('#directory').scrollIntoView({behavior:'smooth'});});
$('.nav-browse').addEventListener('click',reset);
$('#closeDetails').addEventListener('click',()=>$('#details').close());$('#details').addEventListener('close',()=>{activeId=null;});$('#details').addEventListener('click',e=>{if(e.target===$('#details')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
['#shareDirectory','#shareBottom'].forEach(s=>$(s).addEventListener('click',()=>share(`${location.origin}${location.pathname}`,'Kumfer | Your Home Directory')));
document.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!$('#details').open){e.preventDefault();$('#search').focus();}});
window.addEventListener('hashchange',()=>{const id=new URLSearchParams(location.hash.slice(1)).get('provider');if(id)showDetails(id);});
hydrateIcons();load();

