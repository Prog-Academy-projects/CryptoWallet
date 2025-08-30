window.onload = async function() {
    // console.info("layout-loader booted!");
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

    const section = template.dataset.section;
    
    document.open();
    document.write(finalHtml);
    document.close();  
    
    window.addEventListener("DOMContentLoaded", () => {
        const activeEls = document.querySelectorAll(`[data-section="${section}"]`);
        activeEls.forEach
        if (activeEls.length > 0) {
            activeEls.forEach(el => el.classList.add("active-cw"));
        } else {
            console.warn("Not found element for page:", section);
        }
    });
};