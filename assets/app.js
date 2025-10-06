function openWithFallback(primary, fallback) {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = primary;
  document.body.appendChild(iframe);
  setTimeout(() => {
    document.body.removeChild(iframe);
    window.open(fallback, "_blank");
  }, 1200);
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("コピーしました: " + text);
  });
}

function linksetFor(m) {
  const links = [];
  if (m.x)
    links.push({
      label: "Xでフォロー",
      open: () =>
        window.open(
          `https://twitter.com/intent/follow?screen_name=${m.x}`,
          "_blank"
        ),
    });
  if (m.ig)
    links.push({
      label: "Instagramを開く",
      open: () =>
        openWithFallback(
          `instagram://user?username=${m.ig}`,
          `https://www.instagram.com/${m.ig}/`
        ),
    });
  if (m.tiktok)
    links.push({
      label: "TikTokを開く",
      open: () =>
        openWithFallback(
          `snssdk1128://user/profile/@${m.tiktok}`,
          `https://www.tiktok.com/@${m.tiktok}`
        ),
    });
  return links;
}

function render() {
  const $grid = document.querySelector(".grid");
  $grid.innerHTML = "";

  MEMBERS.forEach((m, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.borderColor = m.color;

    const head = document.createElement("div");
    head.className = "head";
    head.innerHTML = `<img class="avatar" src="${m.avatar}" /><div><div>${m.display}</div></div>`;
    card.appendChild(head);

    const btns = document.createElement("div");
    btns.className = "btns";
    linksetFor(m).forEach((l) => {
      const b = document.createElement("button");
      b.textContent = l.label;
      b.onclick = l.open;
      btns.appendChild(b);
    });
    card.appendChild(btns);

    const tag = document.createElement("div");
    tag.innerHTML = `<a href="#">${m.tag}</a> <button onclick="copyText('${m.tag}')">コピー</button>`;
    card.appendChild(tag);

    $grid.appendChild(card);
  });

  const sel = document.getElementById("memberSelect");
  sel.innerHTML = "";
  MEMBERS.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m.tag;
    opt.textContent = m.display;
    sel.appendChild(opt);
  });
}

function copySelectedTag() {
  const sel = document.getElementById("memberSelect");
  copyText(sel.value);
}

function showSection(id) {
  document.querySelectorAll(".section").forEach((s) =>
    s.classList.remove("active")
  );
  document.getElementById(id + "-section").classList.add("active");
}

document.addEventListener("DOMContentLoaded", render);
