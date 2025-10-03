// assets/app.js
(function(){
  const MEMBERS = window.MEMBERS || [];

  function $(s, el=document){ return el.querySelector(s); }
  function $$(s, el=document){ return [...el.querySelectorAll(s)]; }

  function toast(msg){
    const t=document.createElement('div'); t.className='toast'; t.textContent=msg;
    document.body.appendChild(t); setTimeout(()=>t.remove(),1800);
  }
  const isIOS=/iP(hone|od|ad)/.test(navigator.userAgent);
  const isAndroid=/Android/.test(navigator.userAgent);
  function openWithFallback(appUrl, webUrl){
    if(!(isIOS||isAndroid)){ window.open(webUrl,'_blank'); return; }
    const t=Date.now(); window.location.href=appUrl;
    setTimeout(()=>{ if(Date.now()-t<1600){ window.location.href=webUrl; } },1200);
  }

  function svgIcon(key){
    const m={
      x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4l16 16M20 4L4 20"/></svg>',
      ig:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>',
      tt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3v6a5 5 0 1 1-5 5"/><path d="M15 3c1.5 2 3.5 3 6 3"/></svg>'
    };
    return m[key] || '';
  }

  function linksetFor(m){
    const arr=[];
    if(m.x){
      arr.push({
        key:'x', label:'Xでフォロー',
        href:`https://twitter.com/intent/follow?screen_name=${encodeURIComponent(m.x)}`,
        open:()=>window.open(`https://twitter.com/intent/follow?screen_name=${encodeURIComponent(m.x)}`,'_blank')
      });
    }
    if(m.ig){
      const app=`instagram://user?username=${m.ig}`, web=`https://www.instagram.com/${m.ig}/`;
      arr.push({ key:'ig', label:'Instagramを開く', href:'#', open:()=>openWithFallback(app, web) });
    }
    if(m.tiktok){
      const app=`snssdk1128://user/profile/@${m.tiktok}`, web=`https://www.tiktok.com/@${m.tiktok}`;
      arr.push({ key:'tt', label:'TikTokを開く', href:'#', open:()=>openWithFallback(app, web) });
    }
    return arr;
  }

  /* ========== SNSまとめの描画（3ボタン横並び） ========== */
  function renderFollow(){
    const grid = $('#followTab'); if(!grid) return;
    grid.innerHTML = '';

    MEMBERS.forEach((m, idx) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.setProperty('--accent', m.color);

      // 上部バー（番号＋一括）
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.innerHTML = `<div class="tag">#${String(idx+1).padStart(2,'0')}</div>`;
      const openall = document.createElement('button');
      openall.className = 'openall';
      openall.textContent = 'このメンバーのリンクを一括で開く';
      openall.onclick = () => {
        const links = linksetFor(m);
        links.forEach(lnk => {
          if(lnk.key==='ig'){ window.open(`https://www.instagram.com/${m.ig}/`,'_blank'); }
          else if(lnk.key==='tt'){ window.open(`https://www.tiktok.com/@${m.tiktok}`,'_blank'); }
          else { window.open(lnk.href,'_blank'); }
        });
      };
      bar.appendChild(openall);
      card.appendChild(bar);

      // ヘッダ（画像＋名前）
      const head = document.createElement('div');
      head.className = 'head';
      head.innerHTML = `
        <img class="avatar" src="${m.avatar}" alt="${m.display}">
        <div class="names"><div class="display">${m.display}</div></div>`;
      card.appendChild(head);

      // ★ 3ボタン横並び
      const btns = document.createElement('div');
      btns.className = 'btns';
      linksetFor(m).forEach(lnk => {
        const a = document.createElement('a');
        a.className = 'btn';
        a.href = lnk.href;
        a.innerHTML = svgIcon(lnk.key) + `<span>${lnk.label}</span>`;
        a.onclick = (e) => { e.preventDefault(); lnk.open(e); };
        btns.appendChild(a);
      });
      card.appendChild(btns);

      // チェキタグ
      if(m.cheki){
        const cheki = document.createElement('div');
        cheki.className = 'cheki';
        cheki.innerHTML = `
          <a href="https://x.com/hashtag/${encodeURIComponent(m.cheki.replace(/^#/,''))}" target="_blank">${m.cheki}</a>
          <button>コピー</button>`;
        cheki.querySelector('button').onclick =
          () => navigator.clipboard.writeText(m.cheki).then(()=>toast(`${m.cheki} をコピーしました`));
        card.appendChild(cheki);
      }

      grid.appendChild(card);
    });
  }

  /* ========== チェキタグまとめ ========== */
  function renderTagList(){
    const list=$('#tagList'); if(!list) return;
    list.innerHTML='';
    MEMBERS.forEach((m,i)=>{
      if(!m.cheki) return;
      const item=document.createElement('div'); item.className='tag-item';
      item.innerHTML=`<label><input type="checkbox" value="${i}"> ${m.display} ${m.cheki}</label><button>コピー</button>`;
      item.querySelector('button').onclick=()=>navigator.clipboard.writeText(m.cheki).then(()=>toast(`${m.cheki} をコピーしました`));
      list.appendChild(item);
    });
  }

  function renderChekiPicker(){
    const picker=$('#chekiPicker'); if(!picker) return;
    picker.innerHTML='';
    MEMBERS.forEach(m=>{
      if(!m.cheki) return;
      const o=document.createElement('option'); o.value=m.id; o.textContent=`${m.display}（${m.cheki}）`;
      picker.appendChild(o);
    });
    $('#chekiCopy')?.addEventListener('click',()=>{
      const id=picker.value;
      const m=MEMBERS.find(v=>v.id===id);
      if(!m?.cheki) return;
      navigator.clipboard.writeText(m.cheki).then(()=>toast(`${m.cheki} をコピーしました`));
    });
  }

  function switchTab(tab){
    $('#followTab').style.display=(tab==='follow')?'grid':'none';
    $('#tagsTab').style.display  =(tab==='tags')  ?'block':'none';
    $('#tab-follow').classList.toggle('active',tab==='follow');
    $('#tab-tags').classList.toggle('active',  tab==='tags');
  }

  function init(){
    renderFollow();
    renderTagList();
    renderChekiPicker();
    $('#tab-follow')?.addEventListener('click',()=>switchTab('follow'));
    $('#tab-tags')?.addEventListener('click',()=>switchTab('tags'));
    $('#selectAll')?.addEventListener('click',()=>$$('#tagList input').forEach(cb=>cb.checked=true));
    $('#selectNone')?.addEventListener('click',()=>$$('#tagList input').forEach(cb=>cb.checked=false));
    $('#copySelected')?.addEventListener('click',()=>{
      const tags=[...$$('#tagList input:checked')].map(cb=>MEMBERS[cb.value].cheki).join('\\n');
      if(!tags) return toast('タグが選択されていません');
      navigator.clipboard.writeText(tags).then(()=>toast('選択タグをコピーしました'));
    });
    $('#copyAll')?.addEventListener('click',()=>{
      const tags=MEMBERS.map(m=>m.cheki).filter(Boolean).join('\\n');
      navigator.clipboard.writeText(tags).then(()=>toast('全タグをコピーしました'));
    });
    switchTab('follow'); // 初期表示
  }

  document.addEventListener('DOMContentLoaded', init);
})();
