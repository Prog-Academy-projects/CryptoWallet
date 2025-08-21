async function loadLayout() {
    const response = await fetch("../layout.html");
    const layoutHtml = await response.text();

    const template = document.querySelector("template");
    const parser = new DOMParser();
    const doc = parser.parseFromString(layoutHtml, "text/html");

    const caption = template.content.querySelector("[data-caption]")?.innerHTML || "";
    const content = template.content.querySelector("[data-content]")?.innerHTML || "";

    let finalHtml = doc.documentElement.innerHTML
        .replace("{{caption}}", caption)
        .replace("{{content}}", content)
        .replace("{{scripts}}", template.dataset.scripts || "")
        .replace("{{head}}", template.dataset.head || "")
        .replace("{{title}}", template.dataset.title || "Crypto Wallet");

    document.documentElement.innerHTML = finalHtml;

    document.open();
    document.write(finalHtml);
    document.close();

    const section = template.dataset.section;
    if (section) {
    document
        .querySelector(`[data-section="${section}"]`)
        ?.classList.add("active-cw");
    }
}
loadLayout();


async function applyLayout() {
  const template = document.querySelector("template");

  const resp = await fetch("../layout.html");
  let html = await resp.text();

  html = html.replace("{{title}}", template.dataset.title || "App");
  html = html.replace("{{head}}", template.dataset.head || "");
  html = html.replace("{{content}}", template.innerHTML);
  html = html.replace("{{scripts}}", template.dataset.scripts || "");

  document.open();
  document.write(html);
  document.close();

  const section = template.dataset.section;
  if (section) {
    document
      .querySelector(`[data-section="${section}"]`)
      ?.classList.add("active-cw");
  }
}
// applyLayout();
