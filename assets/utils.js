function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// SNSカード生成
const snsContainer = document.getElementById('sns-cards');
members.forEach(m => {
  const div = document.createElement('div');
  div.className = 'card';
  div.style.border = `3px solid ${m.border}`;
  div.innerHTML = `<h3>${m.name}</h3>`;
  snsContainer.appendChild(div);
});

// チェキタグカード生成
const chekiContainer = document.getElementById('cheki-cards');
const bulkSelect = document.getElementById('bulkSelect');
members.forEach(m => {
  const div = document.createElement('div');
  div.className = 'card';
  div.style.border = `3px solid ${m.border}`;
  div.innerHTML = `<p>${m.tag}</p><button onclick="copyTag('${m.tag}')">コピー</button>`;
  chekiContainer.appendChild(div);

  const option = document.createElement('option');
  option.value = m.tag;
  option.textContent = m.name;
  bulkSelect.appendChild(option);
});

function copyTag(tag) {
  navigator.clipboard.writeText(tag).then(() => alert(tag + " をコピーしました"));
}

function copySelectedTags() {
  const selected = Array.from(bulkSelect.selectedOptions).map(o => o.value);
  const text = selected.join('\n');
  navigator.clipboard.writeText(text).then(() => alert("選択タグをコピーしました"));
}