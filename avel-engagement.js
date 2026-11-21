(() => {
  const site = document.body.dataset.avelSite;
  if (!["matin", "course"].includes(site)) return;
  const endpoint = "https://avel-lumiere-visites.sprightlygerbil1.chatgpt.site/api/" + site;
  const taggedSource = new URLSearchParams(location.search).get("source");
  const source = ["whatsapp", "telegram"].includes(taggedSource) ? taggedSource : "direct";
  function send(action, data) {
    return fetch(endpoint + "/" + action, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data),credentials:"omit"});
  }
  let info;
  const count = document.createElement("p");
  count.className = "avel-view-count";
  const comments = document.createElement("section");
  comments.className = "avel-comments";
  comments.innerHTML = '<h2>Commentaires</h2><div data-approved></div><details><summary>Laisser un commentaire</summary><form><label>Prénom ou pseudo (facultatif)<input name="name" maxlength="60" autocomplete="nickname"></label><label>Commentaire<textarea name="body" required maxlength="1000" rows="4"></textarea></label><label hidden>Site web<input name="website" tabindex="-1" autocomplete="off"></label><p>Ton commentaire reste privé jusqu’à sa validation. Évite les coordonnées ou informations personnelles.</p><button>Envoyer pour validation</button><p role="status"></p></form></details>';
  const style = document.createElement("style");
  style.textContent = '.avel-comments{margin:1.25rem 0;padding:1rem;border:1px solid currentColor;border-radius:14px;text-align:left}.avel-comments h2{margin-top:0}.avel-comments summary{cursor:pointer;font-weight:700}.avel-comments form label:not([hidden]){display:block;margin:.75rem 0}.avel-comments input,.avel-comments textarea{display:block;width:100%;padding:.5rem;border:1px solid #8a8095;border-radius:8px;background:#fff;color:#222}.avel-comments button{cursor:pointer;padding:.5rem .75rem;border:1px solid #8a8095;border-radius:8px;background:#fff;color:#222}.avel-comments article p{white-space:pre-wrap;overflow-wrap:anywhere}.avel-reactions{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin-top:1rem}.avel-reactions button{font:inherit;cursor:pointer;padding:.4rem .7rem;border:1px solid #8a8095;border-radius:10px;background:#fffaf2;color:#26304f}.avel-reactions button[aria-pressed="true"]{background:#263868;color:#fff}.avel-view-count{margin:1rem 0 0;font-size:.8125rem;text-align:center;opacity:.8}body[data-avel-site="course"] .avel-comments{background:#fffaf2;color:#26304f;border-color:#d4c2a8}body[data-avel-site="course"] .avel-comments h2,body[data-avel-site="course"] .avel-comments p{color:#26304f}body[data-avel-site="course"] .avel-comments summary{padding:.65rem .85rem;border-radius:8px;background:#263868;color:#fff}body[data-avel-site="course"] .avel-comments summary:focus-visible{outline:3px solid #94601c;outline-offset:3px}';
  document.head.append(style);
  const reactionLabels = {like:"👍 J’aime", heart:"❤️ Cœur", amen:"🙏 Amen"};
  function mountReactions(slot) {
    if (slot.firstChild) return;
    const day = slot.dataset.avelReactions;
    const url = endpoint + "/reactions?day=" + encodeURIComponent(day);
    const key = "avel-reaction:" + site + ":" + day;
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || "{}") || {}; } catch {}
    const voter = saved.voter || crypto.randomUUID();
    const group = document.createElement("div");
    group.className = "avel-reactions";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", "Réagir à la méditation");
    const status = document.createElement("p");
    status.setAttribute("role", "status");
    let counts = {};
    const buttons = new Map();
    function draw() {
      for (const [kind, button] of buttons) {
        button.textContent = reactionLabels[kind] + (counts[kind] ? " · " + counts[kind] : "");
        button.setAttribute("aria-pressed", String(saved.kind === kind));
      }
    }
    async function refresh() {
      const response = await fetch(url, {credentials:"omit"});
      if (response.ok) counts = await response.json();
      draw();
    }
    for (const [kind, label] of Object.entries(reactionLabels)) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      buttons.set(kind, button);
      group.append(button);
      button.addEventListener("click", async () => {
        for (const control of buttons.values()) control.disabled = true;
        try {
          const response = await fetch(url, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({kind,voter}),credentials:"omit"});
          if (!response.ok) throw new Error("Envoi refusé");
          saved = {voter,kind};
          try { localStorage.setItem(key, JSON.stringify(saved)); } catch {}
          draw();
          status.textContent = "Réaction enregistrée.";
          refresh().catch(() => {});
        } catch {
          status.textContent = "Réaction indisponible. Réessaie dans un instant.";
        } finally {
          for (const control of buttons.values()) control.disabled = false;
        }
      });
    }
    slot.append(group,status);
    draw();
    refresh().catch(() => {});
  }
  function attach() {
    for (const slot of mount.querySelectorAll("[data-avel-reactions]")) mountReactions(slot);
    for (const placeholder of mount.querySelectorAll("[data-avel-visits]")) placeholder.remove();
    if (info) {
      const label = info.total.toLocaleString("fr-FR") + (info.total === 1 ? " vue" : " vues");
      if (count.textContent !== label) count.textContent = label;
      if (mount.lastElementChild !== count) mount.append(count);
    }
    const slot = document.querySelector("[data-avel-comments]");
    if (slot && !slot.contains(comments)) slot.append(comments);
  }
  function update(data) {
    info = data;
    const list = comments.querySelector("[data-approved]");
    list.replaceChildren();
    for (const entry of data.comments) {
      const item = document.createElement("article");
      const name = document.createElement("strong");
      const body = document.createElement("p");
      name.textContent = entry.name || "Anonyme";
      body.textContent = entry.body;
      item.append(name, body);
      list.append(item);
    }
    attach();
  }
  const form = comments.querySelector("form");
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const status = form.querySelector('[role="status"]');
    const button = form.querySelector("button");
    button.disabled = true;
    try {
      const response = await send("comment", Object.fromEntries(new FormData(form)));
      if (!response.ok) {
        const data = await response.json();
        status.textContent = data.error || "L’envoi a échoué. Réessaie dans un instant.";
        return;
      }
      form.reset();
      status.textContent = "Merci. Ton commentaire attend la validation.";
    } catch {
      status.textContent = "L’envoi a échoué. Réessaie dans un instant.";
    } finally {
      button.disabled = false;
    }
  });
  const mount = document.querySelector("#app") || document.body;
  new MutationObserver(attach).observe(mount,{childList:true,subtree:true});
  attach();
  send("view", {source}).catch(() => null).then(() => fetch(endpoint,{credentials:"omit"})).then(response => {
    if (response.ok) return response.json().then(update);
  }).catch(() => {});
})();