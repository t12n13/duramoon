// assets/api.js
document.addEventListener("DOMContentLoaded", () => {
  // config.js が正しく読めているかチェック
  if (!window.CONFIG || !CONFIG.API_KEY || !CONFIG.CAL_ID) {
    const div = document.createElement("div");
    div.textContent = "設定ファイル（assets/config.js）の API_KEY と CAL_ID を設定してください。";
    div.style.color = "#fff";
    div.style.background = "#a11";
    div.style.padding = "12px 16px";
    div.style.borderRadius = "10px";
    div.style.textAlign = "center";
    div.style.margin = "16px";
    document.querySelector(".wrap")?.prepend(div);
    return;
  }

  gapi.load("client", async () => {
    try {
      await gapi.client.init({
        apiKey: CONFIG.API_KEY,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      });

      const res = await gapi.client.calendar.events.list({
        calendarId: CONFIG.CAL_ID,
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 20,
      });

      const events = res.result.items || [];
      const root = document.getElementById("calendar") || (() => {
        const d = document.createElement("div");
        d.id = "calendar";
        document.querySelector(".wrap")?.appendChild(d);
        return d;
      })();

      root.innerHTML = "";

      if (events.length === 0) {
        const p = document.createElement("p");
        p.textContent = "今後の予定はありません。";
        root.appendChild(p);
        return;
      }

      const ul = document.createElement("ul");
      ul.style.listStyle = "none";
      ul.style.padding = "0";
      ul.style.margin = "12px 0";

      events.forEach(ev => {
        const when = ev.start?.dateTime || ev.start?.date;
        const li = document.createElement("div");
        li.classList.add("event-card");
        li.innerHTML = `
          <div class="event-time">${new Date(when).toLocaleString("ja-JP", { dateStyle: "medium", timeStyle: "short" })}</div>
          <div class="event-title">${ev.summary || "(無題の予定)"}</div>
  `      ;
        root.appendChild(li);
      });


      root.appendChild(ul);
    } catch (e) {
      console.error(e);
      const p = document.createElement("p");
      p.textContent = "予定の取得でエラーが発生しました。コンソールを確認してください。";
      p.style.color = "#f88";
      document.getElementById("calendar")?.appendChild(p);
    }
  });
});

