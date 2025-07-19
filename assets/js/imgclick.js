document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ imgclick.js loaded!");

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    // 监听 #experiences 区域的变化，确保动态加载的内容也能触发
    const observer = new MutationObserver(() => {
        console.log("🔄 DOM updated, re-binding click events");
        bindClickEvents();
    });

    observer.observe(document.getElementById("experiences"), { childList: true, subtree: true });

    function bindClickEvents() {
        const images = document.querySelectorAll(".gallery-item img");
        console.log(`🔍 Found ${images.length} images`);

        images.forEach(img => {
            img.removeEventListener("click", handleImageClick);
            img.addEventListener("click", handleImageClick);
        });
    }

    function handleImageClick() {
        console.log("🔥 Image clicked!", this.src);
        lightboxImg.src = this.src;
        lightbox.classList.add("show");
    }

    // 🚀 点击 lightbox 周边区域即可关闭
    lightbox.addEventListener("click", function (event) {
        if (event.target !== lightboxImg) {
            console.log("❌ Lightbox closed");
            lightbox.classList.remove("show");
        }
    });

    // 初次绑定（如果页面已经有 .experience-card，则立即绑定）
    bindClickEvents();
});
