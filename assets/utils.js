function openWithFallback(appUrl, webUrl){
  const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  if(!(isIOS||isAndroid)){ window.open(webUrl,'_blank'); return; }
  const t=Date.now();
  window.location.href=appUrl;
  setTimeout(()=>{ if(Date.now()-t<1600) window.location.href=webUrl; },1200);
}
function copyText(text){ navigator.clipboard.writeText(text).then(()=>alert('コピーしました: '+text)); }
