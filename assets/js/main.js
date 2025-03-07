// 确保 DOM 加载完成后再执行
document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript loaded successfully!");

    // 1️⃣ 处理移动端导航菜单
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });
    }

    // 2️⃣ 暗色模式切换
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
            // 记住用户的偏好
            localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
        });

        // 加载用户的主题偏好
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
        }
    }

    // 3️⃣ 平滑滚动效果
    const links = document.querySelectorAll("a[href^='#']");
    links.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50,
                    behavior: "smooth"
                });
            }
        });
    });
});

