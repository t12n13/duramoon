function linksetFor(m){
  const links=[];
  if(m.x){ links.push({label:'Xでフォロー', open:()=>window.open(`https://twitter.com/intent/follow?screen_name=${m.x}`,'_blank')}); }
  if(m.ig){ links.push({label:'Instagramを開く', open:()=>openWithFallback(`instagram://user?username=${m.ig}`,`https://www.instagram.com/${m.ig}/`)}); }
  if(m.tiktok){ links.push({label:'TikTokを開く', open:()=>openWithFallback(`snssdk1128://user/profile/@${m.tiktok}`,`https://www.tiktok.com/@${m.tiktok}`)}); }
  return links;
}

function getMembers(){
  if (Array.isArray(window.MEMBERS) && window.MEMBERS.length) return window.MEMBERS;
  console.warn('[SNS] MEMBERS が見つからない/空です。assets/data.js のパスと読み込み順を確認してください。');
  return null;
}

function render(){
  const grid = document.querySelector('.grid');
  if(!grid){ console.warn('[SNS] .grid が見つかりません'); return; }

  const members = getMembers();
  if(!members){
    grid.innerHTML = `
      <div class="card" style="border-color:#ef4444">
        <div class="title">SNSデータを読み込めませんでした</div>
        <div class="meta">assets/data.js の配置とパス／読み込み順を確認してください。</div>
      </div>`;
    return;
  }

  grid.innerHTML='';
  members.forEach((m,i)=>{
    const card=document.createElement('div');
    card.className='card';
    card.style.borderColor=m.color||'#2a2f3a';

    const bar=document.createElement('div'); bar.className='bar';
    bar.innerHTML=`<div class="tag">#${String(i+1).padStart(2,'0')}</div>`;
    const openall=document.createElement('button'); openall.className='openall'; openall.textContent='このメンバーのリンクを一括で開く';
    openall.onclick=()=>{linksetFor(m).forEach(l=>l.open());};
    bar.appendChild(openall); card.appendChild(bar);

    const head=document.createElement('div');
    head.className='head';
    head.innerHTML=`<img class="avatar" src="${m.avatar}" alt="${m.display}"/><div class="names"><div class="display">${m.display}</div><div class="handle">@${m.aka||''}</div></div>`;
    card.appendChild(head);

    const btns=document.createElement('div'); btns.className='btns';
    linksetFor(m).forEach(l=>{ const b=document.createElement('button'); b.className='btn'; b.textContent=l.label; b.onclick=l.open; btns.appendChild(b); });
    card.appendChild(btns);

    const tag=document.createElement('div');
    tag.innerHTML=`<a href="https://x.com/hashtag/${encodeURIComponent((m.tag||'').replace(/^#/,''))}" target="_blank">${m.tag||''}</a>
                   ${m.tag? `<button class="btn" style="flex:0 0 auto" onclick="copyText('${m.tag}')">コピー</button>`:''}`;
    card.appendChild(tag);

    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  render();
  // もし data.js のロードが遅れていた場合の保険
  setTimeout(()=>{ if (Array.isArray(window.MEMBERS) && document.querySelector('.grid')?.children?.length===0) render(); }, 300);
});
