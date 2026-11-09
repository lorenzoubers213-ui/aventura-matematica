(function(){
'use strict';
var KEY='aventuraMatematica',BACKUP='aventuraMatematica_progress_backup',nativeSet=Storage.prototype.setItem,nativeRemove=Storage.prototype.removeItem,lastSave=0,badge=null;
function parse(raw){try{var v=JSON.parse(raw);return v&&typeof v==='object'&&!Array.isArray(v)?v:null}catch(e){return null}}
function compact(v){
 var out={},keys=['xp','coins','streak','name','correct','total','materials','completed','bosses','world','questionHistory'];
 keys.forEach(function(k){if(v[k]!==undefined)out[k]=v[k]});
 if(out.completed&&typeof out.completed==='object')out.completed=out.completed;
 if(out.bosses&&typeof out.bosses==='object')out.bosses=out.bosses;
 if(Array.isArray(out.world))out.world=out.world.slice(-100);
 if(Array.isArray(out.questionHistory))out.questionHistory=out.questionHistory.slice(-150);
 out._progressSavedAt=Date.now();
 return out;
}
function status(ok){
 if(!badge)return;
 badge.textContent=ok?'💾 Progreso guardado':'⚠️ No se pudo guardar';
 badge.title=ok?'Tus avances se guardan automáticamente en este navegador.':'El navegador no permitió crear el respaldo.';
 badge.style.opacity=ok?'1':'.85';
}
function backup(v){
 try{
  var data=compact(v);
  nativeSet.call(localStorage,BACKUP,JSON.stringify({version:1,savedAt:Date.now(),data:data}));
  lastSave=Date.now();status(true);
 }catch(e){status(false)}
}
function current(){return parse(nativeGet(KEY))}
var nativeGet=Storage.prototype.getItem;
try{
 var main=parse(nativeGet.call(localStorage,KEY));
 var saved=parse(nativeGet.call(localStorage,BACKUP));
 if(!main&&saved&&saved.data&&typeof saved.data==='object'){
  nativeSet.call(localStorage,KEY,JSON.stringify(saved.data));
  main=saved.data;
 }
 if(main)backup(main);
}catch(e){}
Storage.prototype.setItem=function(key,value){
 nativeSet.call(this,key,value);
 if(this===localStorage&&key===KEY){
  var parsed=parse(value);
  if(parsed)backup(parsed);else status(false);
 }
};
window.addEventListener('pagehide',function(){var v=current();if(v)backup(v)});
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden'){var v=current();if(v)backup(v)}});
window.addEventListener('beforeunload',function(){var v=current();if(v)backup(v)});
setInterval(function(){var v=current();if(v&&Date.now()-lastSave>12000)backup(v)},15000);
function addBadge(){
 var stats=document.querySelector('header .stats');
 if(!stats||badge)return;
 badge=document.createElement('span');badge.id='progressSaveStatus';badge.setAttribute('role','status');badge.setAttribute('aria-live','polite');badge.textContent='💾 Guardado automático';badge.style.cssText='display:inline-block;background:#ffffff2b;padding:9px 12px;border-radius:12px;font-weight:bold;font-size:13px';
 stats.appendChild(badge);
 var v=current();status(!!v);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addBadge);else addBadge();
})();