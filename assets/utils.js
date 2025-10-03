(function(){
  const $  = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => [...el.querySelectorAll(s)];

  function toast(msg){
    const t=document.createElement('div');
    t.className='toast'; t.textContent=msg;
    document.body.appendChild(t);
    setTimeout(()=>t.remove(),1800);
  }

  function initTheme(){}

  const isIOS=/iP(hone|od|ad)/.test(navigator.userAgent);
  const isAndroid=/Android/.test(navigator.userAgent);
  function openWithFallback(appUrl, webUrl){
    if(!(isIOS||isAndroid)){ window.open(webUrl,'_blank'); return; }
    const t=Date.now(); window.location.href=appUrl;
    setTimeout(()=>{ if(Date.now()-t<1600){ window.location.href=webUrl; } },1200);
  }

  window.$=$; window.$$=$$;
  window.toast=toast; window.initTheme=initTheme;
  window.openWithFallback=openWithFallback;
})();