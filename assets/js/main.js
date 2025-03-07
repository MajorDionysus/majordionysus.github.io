// main.js

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", function () {
    // 加载各页面内容
    loadData("publications", "../data/publications.json", formatPublication);
    loadData("experiences", "../data/experiences.json", formatExperience);
    loadData("life-timeline", "../data/life.json", formatLifeEvent);
    loadData("contact", "../data/contact.json", formatContact);

    // 处理导航栏的显示/隐藏逻辑
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    if (navToggle) {
        navToggle.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });
    }
});

// 通用数据加载函数
function loadData(elementId, url, formatFunction) {
    const container = document.getElementById(elementId);
    if (!container) return;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            container.innerHTML = "";
            data.forEach(item => {
                container.appendChild(formatFunction(item));
            });
        })
        .catch(error => console.error(`Error loading ${elementId}:`, error));
}

// 格式化 Publications
function formatPublication(pub) {
    let li = document.createElement("li");
    li.classList.add("publication-card");
    li.innerHTML = `
        <h3><a href="${pub.url}" target="_blank">${pub.title}</a></h3>
        <p><strong>Authors:</strong> ${pub.authors}</p>
        <p><strong>Year:</strong> ${pub.year}</p>
        <p><strong>Journal:</strong> ${pub.journal}</p>
        <p><strong>DOI:</strong> <a href="${pub.url}" target="_blank">${pub.doi}</a></p>
        <p>${pub.abstract}</p>
    `;
    return li;
}

// 格式化 Experiences
function formatExperience(exp) {
    let li = document.createElement("li");
    li.classList.add("experience-card");
    li.innerHTML = `
        <h3>${exp.title}</h3>
        <p><strong>Role:</strong> ${exp.role}</p>
        <p>${exp.description}</p>
        <p><strong>Year:</strong> ${exp.year}</p>
    `;
    return li;
}

// 格式化 Life Timeline 事件
function formatLifeEvent(event) {
    let li = document.createElement("li");
    li.classList.add("timeline-item");
    li.innerHTML = `
        <h3>${event.date}: ${event.title}</h3>
        <p>${event.description}</p>
    `;
    return li;
}

// 格式化 Contact 信息
function formatContact(contact) {
    let container = document.createElement("div");
    container.classList.add("contact-info");
    container.innerHTML = `
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
        <p><strong>Phone:</strong> ${contact.phone}</p>
        <p><strong>LinkedIn:</strong> <a href="${contact.linkedin}" target="_blank">LinkedIn</a></p>
        <p><strong>GitHub:</strong> <a href="${contact.github}" target="_blank">GitHub</a></p>
    `;
    return container;
}
