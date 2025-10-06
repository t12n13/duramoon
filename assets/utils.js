
function openWithFallback(appUrl, webUrl){
  const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  if(!(isIOS||isAndroid)){ window.open(webUrl,'_blank'); return; }
  const t=Date.now(); window.location.href=appUrl;
  setTimeout(()=>{ if(Date.now()-t<1600) window.location.href=webUrl; },1200);
}
function copyText(text){
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(()=>alert('コピーしました: '+text));
  }else{
    const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy'); ta.remove(); alert('コピーしました: '+text);
  }
}
function showSection(id){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.getElementById(id+'-section').classList.add('active');
}
