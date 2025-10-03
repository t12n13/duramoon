function linksetFor(m){
  const links=[];
  if(m.x){ links.push({label:'Xでフォロー', open:()=>window.open(`https://twitter.com/intent/follow?screen_name=${m.x}`,'_blank')}); }
  if(m.ig){ links.push({label:'Instagramを開く', open:()=>openWithFallback(`instagram://user?username=${m.ig}`,`https://www.instagram.com/${m.ig}/`)}); }
  if(m.tiktok){ links.push({label:'TikTokを開く', open:()=>openWithFallback(`snssdk1128://user/profile/@${m.tiktok}`,`https://www.tiktok.com/@${m.tiktok}`)}); }
  return links;
}
function render(){
  const $grid=document.querySelector('.grid');
  $grid.innerHTML='';
  MEMBERS.forEach((m,i)=>{
    const card=document.createElement('div');
    card.className='card';
    card.style.borderColor=m.color;
    const bar=document.createElement('div'); bar.className='bar';
    bar.innerHTML=`<div class="tag">#${String(i+1).padStart(2,'0')}</div>`;
    const openall=document.createElement('button'); openall.className='openall'; openall.textContent='このメンバーのリンクを一括で開く';
    openall.onclick=()=>{linksetFor(m).forEach(l=>l.open());};
    bar.appendChild(openall); card.appendChild(bar);
    const head=document.createElement('div'); head.className='head';
    head.innerHTML=`<img class="avatar" src="${m.avatar}"/><div class="names"><div class="display">${m.display}</div><div class="handle">@${m.aka}</div></div>`;
    card.appendChild(head);
    const btns=document.createElement('div'); btns.className='btns';
    linksetFor(m).forEach(l=>{ const b=document.createElement('button'); b.className='btn'; b.textContent=l.label; b.onclick=l.open; btns.appendChild(b); });
    card.appendChild(btns);
    const tag=document.createElement('div');
    tag.innerHTML=`<a href="#">${m.tag}</a> <button onclick="copyText('${m.tag}')">コピー</button>`;
    card.appendChild(tag);
    $grid.appendChild(card);
  });
  const sel=document.getElementById('memberSelect'); sel.innerHTML='';
  MEMBERS.forEach((m,i)=>{ const opt=document.createElement('option'); opt.value=m.tag; opt.textContent=m.display; sel.appendChild(opt); });
}
function copySelectedTag(){ const sel=document.getElementById('memberSelect'); copyText(sel.value); }
function showSection(id){ document.querySelectorAll('.section').forEach(s=>s.classList.remove('active')); document.getElementById(id+'-section').classList.add('active'); }
document.addEventListener('DOMContentLoaded',render);
