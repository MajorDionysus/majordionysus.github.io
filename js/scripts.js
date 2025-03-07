document.addEventListener("DOMContentLoaded", function () {
    // 获取所有导航链接和内容区域
    const navLinks = document.querySelectorAll(".sidebar a");
    const sections = document.querySelectorAll(".content-section");

    // 监听导航点击事件
    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            
            // 隐藏所有内容区，显示目标区
            sections.forEach(section => {
                section.style.display = section.id === targetId ? "block" : "none";
            });

            // 更新导航选中状态
            navLinks.forEach(nav => nav.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // 时间轴滚动高亮
    const timelineItems = document.querySelectorAll(".timeline-item");
    window.addEventListener("scroll", function () {
        let fromTop = window.scrollY;
        
        timelineItems.forEach(item => {
            const section = document.getElementById(item.dataset.target);
            if (section.offsetTop <= fromTop + 100 && section.offsetTop + section.offsetHeight > fromTop) {
                item.classList.add("highlight");
            } else {
                item.classList.remove("highlight");
            }
        });
    });
});
