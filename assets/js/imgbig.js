document.addEventListener("DOMContentLoaded", function () {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    document.querySelectorAll(".experience-card .image-container img").forEach(img => {
        img.addEventListener("click", function () {
            lightboxImg.src = this.src;
            lightbox.classList.add("show");
        });
    });

    lightbox.addEventListener("click", function (e) {
        if (e.target !== lightboxImg) {
            lightbox.classList.remove("show");
        }
    });
});
