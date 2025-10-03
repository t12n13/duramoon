(function(){
  const MEMBERS = window.MEMBERS || [];

  function renderFollow(){
    const grid=$('#followTab'); if(!grid) return;
    grid.innerHTML='';
    MEMBERS.forEach((m,idx)=>{
      const card=document.createElement('div');
      card.className='card';
      card.style.setProperty('--accent',m.color);
      card.innerHTML=`<div class="display">${m.display}</div>`;
      grid.appendChild(card);
    });
  }

  function init(){
    initTheme();
    renderFollow();
    $('#tab-follow')?.addEventListener('click',()=>{ $('#followTab').style.display='grid'; $('#tagsTab').style.display='none'; });
    $('#tab-tags')?.addEventListener('click',()=>{ $('#followTab').style.display='none'; $('#tagsTab').style.display='block'; });
  }

  document.addEventListener('DOMContentLoaded', init);
})();