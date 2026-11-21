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
  const comments = document.createElement("section");
  comments.className = "avel-comments";
  comments.innerHTML = '<h2>Commentaires</h2><div data-approved></div><details><summary>Laisser un commentaire</summary><form><label>Prénom ou pseudo (facultatif)<input name="name" maxlength="60" autocomplete="nickname"></label><label>Commentaire<textarea name="body" required maxlength="1000" rows="4"></textarea></label><label hidden>Site web<input name="website" tabindex="-1" autocomplete="off"></label><p>Ton commentaire reste privé jusqu’à sa validation. Évite les coordonnées ou informations personnelles.</p><button>Envoyer pour validation</button><p role="status"></p></form></details>';
  const style = document.createElement("style");
  style.textContent = '.avel-comments{margin:1.25rem 0;padding:1rem;border:1px solid currentColor;border-radius:14px;text-align:left}.avel-comments h2{margin-top:0}.avel-comments summary{cursor:pointer;font-weight:700}.avel-comments form label:not([hidden]){display:block;margin:.75rem 0}.avel-comments input,.avel-comments textarea{display:block;width:100%;padding:.5rem;border:1px solid #8a8095;border-radius:8px;background:#fff;color:#222}.avel-comments button{cursor:pointer;padding:.5rem .75rem;border:1px solid #8a8095;border-radius:8px;background:#fff;color:#222}.avel-comments article p{white-space:pre-wrap;overflow-wrap:anywhere}[data-avel-visits]{margin:.55rem 0;font-size:.9rem;font-weight:600}body[data-avel-site="course"] .avel-comments{background:#fffaf2;color:#26304f;border-color:#d4c2a8}body[data-avel-site="course"] .avel-comments h2,body[data-avel-site="course"] .avel-comments p{color:#26304f}body[data-avel-site="course"] .avel-comments summary{padding:.65rem .85rem;border-radius:8px;background:#263868;color:#fff}body[data-avel-site="course"] .avel-comments summary:focus-visible{outline:3px solid #94601c;outline-offset:3px}';
  document.head.append(style);
  function attach() {
    for (const node of document.querySelectorAll("[data-avel-visits]:empty")) {
      node.textContent = info ? "👁 " + info.total.toLocaleString("fr-FR") + (info.total === 1 ? " visite" : " visites") : "";
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