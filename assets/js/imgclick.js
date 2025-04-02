document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ imgclick.js loaded!");

    // 监听 #experiences 区域的变化（因为 .experience-card 是动态添加的）
    const observer = new MutationObserver(() => {
        console.log("🔄 DOM updated, re-binding click events");
        bindClickEvents(); // 每次有新内容时，重新绑定点击事件
    });

    observer.observe(document.getElementById("experiences"), { childList: true, subtree: true });

    // 绑定图片点击事件
    function bindClickEvents() {
        const images = document.querySelectorAll(".experience-card .image-container img");
        console.log(`🔍 Found ${images.length} images`);

        images.forEach(img => {
            img.removeEventListener("click", handleImageClick); // 避免重复绑定
            img.addEventListener("click", handleImageClick);
        });
    }

    // 图片点击事件处理函数
    function handleImageClick() {
        console.log("🔥 Image clicked!", this.src);
        document.getElementById("lightbox-img").src = this.src;
        document.getElementById("lightbox").classList.add("show");
    }

    // 初次绑定（如果页面已经有 .experience-card，则立即绑定）
    bindClickEvents();
});
