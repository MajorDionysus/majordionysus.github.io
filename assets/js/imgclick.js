document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded ✅"); // 确保 JS 被正确加载

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    if (!lightbox || !lightboxImg) {
        console.error("❌ Lightbox elements not found!");
        return;
    }

    document.querySelectorAll(".experience-card .image-container img").forEach(img => {
        console.log("Found image:", img.src); // 确保找到了图片
        img.addEventListener("click", function () {
            console.log("Image clicked:", this.src); // 监测点击事件
            lightboxImg.src = this.src;
            lightbox.classList.add("show");
        });
    });

    lightbox.addEventListener("click", function (e) {
        if (e.target !== lightboxImg) {
            console.log("Lightbox closed");
            lightbox.classList.remove("show");
        }
    });
});
