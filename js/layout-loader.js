console.log("Start")
window.onload = async function() {
    console.log("Loader booted!");
    const response = await fetch("../layout.html");
    const layoutHtml = await response.text();

    const template = document.querySelector("template");
    if (!template) {
        console.error("No <template> found on page!");
        return;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(layoutHtml, "text/html");

    const caption = template.content.querySelector("[data-caption]")?.innerHTML || "";
    const content = template.content.querySelector("[data-content]")?.innerHTML || "";
    let finalHtml = doc.documentElement.innerHTML
        .replace("{{title}}", template.dataset.title || "Crypto Wallet")
        .replace("{{head}}", template.dataset.head || "")
        .replace("{{caption}}", caption)
        .replace("{{content}}", content)
        .replace("{{scripts}}", template.dataset.scripts || "");

    // document.documentElement.innerHTML = finalHtml;

    document.open();
    document.write(finalHtml);
    document.close();

    const section = template.dataset.section;
    if (section) {
    document
        .querySelector(`[data-section="${section}"]`)
        ?.classList.add("active-cw");
    }        
};

async function loadLayout() {
    console.log('layout-loader booted');

    const response = await fetch("../layout.html");
    const layoutHtml = await response.text();

    const template = document.querySelector("template");
    if (!template) {
        console.error("No <template> found on page!");
        return;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(layoutHtml, "text/html");

    const caption = template.content.querySelector("[data-caption]")?.innerHTML || "";
    const content = template.content.querySelector("[data-content]")?.innerHTML || "";
    let finalHtml = doc.documentElement.innerHTML
        .replace("{{title}}", template.dataset.title || "Crypto Wallet")
        .replace("{{head}}", template.dataset.head || "")
        .replace("{{caption}}", caption)
        .replace("{{content}}", content)
        .replace("{{scripts}}", template.dataset.scripts || "");

    // document.documentElement.innerHTML = finalHtml;

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

// loadLayout();