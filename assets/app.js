// assets/app.js — v3.0.4 cheki強化版

// ====== SNSリンク作成（現状維持） ======
function linksetFor(m){
  const links=[];
  if(m.x){ links.push({label:'Xでフォロー', open:()=>window.open(`https://twitter.com/intent/follow?screen_name=${m.x}`,'_blank')}); }
  if(m.ig){ links.push({label:'Instagramを開く', open:()=>openWithFallback(`instagram://user?username=${m.ig}`,`https://www.instagram.com/${m.ig}/`)}); }
  if(m.tiktok){ links.push({label:'TikTokを開く', open:()=>openWithFallback(`snssdk1128://user/profile/@${m.tiktok}`,`https://www.tiktok.com/@${m.tiktok}`)}); }
  return links;
}

// ====== 便利関数（カウンタ管理・ツイート） ======
const _hasClipboard = !!(navigator.clipboard && navigator.clipboard.writeText);
const _keyFor = (tag)=>`chekiCopy:${encodeURIComponent(tag)}`;
function getCopyCount(tag){ return parseInt(localStorage.getItem(_keyFor(tag))||'0',10); }
function incCopyCount(tag){
  const n = getCopyCount(tag)+1;
  localStorage.setItem(_keyFor(tag), String(n));
  // カード側のカウンタ更新
  const el = document.querySelector(`[data-counter="${CSS.escape(tag)}"]`);
  if(el) el.textContent = `コピー:${n}`;
  // タグ一覧側のカウンタ更新
  const el2 = document.querySelector(`#tags-section [data-counter="${CSS.escape(tag)}"]`);
  if(el2) el2.textContent = `コピー:${n}`;
}
function tweetTag(tag){
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tag)}`;
  window.open(url,'_blank');
}
function safeCopy(text){
  if(!text) return;
  if(_hasClipboard){
    navigator.clipboard.writeText(text).then(()=>{/*OK*/}).catch(()=>alert('コピーに失敗しました'));
  }else{
    const ta=document.createElement('textarea');
    ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
  }
}

// ====== SNSまとめ（既存＋ボタン横並び） ======
function renderSNS(){
  const $grid=document.querySelector('.grid');
  if(!$grid || !window.MEMBERS) return;
  $grid.innerHTML='';

  MEMBERS.forEach((m,i)=>{
    const card=document.createElement('div');
    card.className='card';
    card.style.borderColor=m.color; // メンバーカラー枠線

    // 上バー
    const bar=document.createElement('div'); bar.className='bar';
    bar.innerHTML=`<div class="tag">#${String(i+1).padStart(2,'0')}</div>`;
    const openall=document.createElement('button'); openall.className='openall'; openall.textContent='このメンバーのリンクを一括で開く';
    openall.onclick=()=>{ linksetFor(m).forEach(l=>l.open()); };
    bar.appendChild(openall);
    card.appendChild(bar);

    // ヘッダ
    const head=document.createElement('div'); head.className='head';
    head.innerHTML=`<img class="avatar" src="${m.avatar}" alt="${m.display}"/><div class="names"><div class="display">${m.display}</div><div class="handle">@${m.aka||''}</div></div>`;
    card.appendChild(head);

    // ★ 3ボタン横並び
    const btns=document.createElement('div'); btns.className='btns';
    linksetFor(m).forEach(l=>{
      const b=document.createElement('button'); b.className='btn'; b.textContent=l.label; b.onclick=l.open; btns.appendChild(b);
    });
    card.appendChild(btns);

    // チェキタグ（コピー・ツイート・カウンタ）
    if(m.tag){
      const tagWrap=document.createElement('div');
      tagWrap.className='cheki';
      tagWrap.innerHTML = `
        <a href="https://x.com/hashtag/${encodeURIComponent(m.tag.replace(/^#/,''))}" target="_blank">${m.tag}</a>
        <button type="button" data-act="copy">コピー</button>
        <button type="button" data-act="tweet">ツイート</button>
        <small class="copy-count" data-counter="${m.tag}">コピー:${getCopyCount(m.tag)}</small>
      `;
      tagWrap.addEventListener('click',(e)=>{
        const act=e.target?.dataset?.act;
        if(act==='copy'){ safeCopy(m.tag); incCopyCount(m.tag); }
        if(act==='tweet'){ tweetTag(m.tag); }
      });
      card.appendChild(tagWrap);
    }

    $grid.appendChild(card);
  });
}

// ====== チェキタグまとめ（複数選択コピー・カウンタ復元・ツイート） ======
function ensureTagTools(){
  const sec=document.getElementById('tags-section'); if(!sec) return;
  // まとめ操作ボタン行が無ければ追加
  if(!sec.querySelector('.tools-row')){
    const tools=document.createElement('div');
    tools.className='tools-row';
    tools.innerHTML=`
      <button type="button" data-act="all">全選択</button>
      <button type="button" data-act="none">選択解除</button>
      <button type="button" data-act="copySel">選択タグをコピー</button>
      <button type="button" data-act="copyAll">全タグをコピー</button>
    `;
    tools.addEventListener('click',(e)=>{
      const act=e.target?.dataset?.act; if(!act) return;
      const cbs=[...sec.querySelectorAll('.tag-check')];
      if(act==='all')  cbs.forEach(cb=>cb.checked=true);
      if(act==='none') cbs.forEach(cb=>cb.checked=false);
      if(act==='copySel'){
        const tags=cbs.filter(cb=>cb.checked).map(cb=>cb.value);
        if(!tags.length) return alert('タグを選択してください');
        safeCopy(tags.join('\n')); tags.forEach(incCopyCount);
      }
      if(act==='copyAll'){
        const tags=(window.MEMBERS||[]).map(m=>m.tag).filter(Boolean);
        if(!tags.length) return;
        safeCopy(tags.join('\n')); tags.forEach(incCopyCount);
      }
    });
    sec.appendChild(tools);
  }
  // タグリスト領域が無ければ追加
  if(!sec.querySelector('#tagList')){
    const list=document.createElement('div'); list.id='tagList'; sec.appendChild(list);
  }
}

function renderChekiList(){
  const sec=document.getElementById('tags-section'); if(!sec || !window.MEMBERS) return;
  ensureTagTools();

  // ドロップダウン（既存UI）を埋める
  const sel=document.getElementById('memberSelect');
  if(sel){
    sel.innerHTML='';
    MEMBERS.forEach(m=>{
      if(!m.tag) return;
      const opt=document.createElement('option'); opt.value=m.tag; opt.textContent=m.display;
      sel.appendChild(opt);
    });
  }

  // 一覧
  const list=sec.querySelector('#tagList');
  list.innerHTML='';
  MEMBERS.forEach(m=>{
    if(!m.tag) return;
    const item=document.createElement('div');
    item.className='tag-item';
    item.style.setProperty('--color', m.color || '#e5e7eb');
    item.innerHTML=`
      <input type="checkbox" class="tag-check" value="${m.tag}">
      <span class="tag-text">${m.tag}</span>
      <button type="button" data-act="copy">コピー</button>
      <button type="button" data-act="tweet">ツイート</button>
      <small class="copy-count" data-counter="${m.tag}">コピー:${getCopyCount(m.tag)}</small>
    `;
    item.addEventListener('click',(e)=>{
      const act=e.target?.dataset?.act;
      if(act==='copy'){ safeCopy(m.tag); incCopyCount(m.tag); }
      if(act==='tweet'){ tweetTag(m.tag); }
    });
    list.appendChild(item);
  });
}

// 既存の単体コピーボタン（セレクト横）の関数を上書き
function copySelectedTag(){
  const sel=document.getElementById('memberSelect');
  if(!sel || !sel.value) return;
  safeCopy(sel.value);
  incCopyCount(sel.value);
}
window.copySelectedTag = copySelectedTag;

// ====== タブ切替（現状維持） ======
function showSection(id){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.getElementById(id+'-section').classList.add('active');
}
window.showSection = showSection;

// ====== 初期化 ======
function render(){
  renderSNS();
  renderChekiList();
}
document.addEventListener('DOMContentLoaded', render);
