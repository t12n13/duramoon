export const $=s=>document.querySelector(s);
export const $$=(s,el=document)=>[...el.querySelectorAll(s)];
export function toast(msg){
  const t=document.createElement('div'); t.className='toast'; t.textContent=msg;
  document.body.appendChild(t); setTimeout(()=>t.remove(),3000);
}
export function initTheme(){ }