// main.js

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", function() {
    // 加载并显示 Publications 页面的内容
    if (document.getElementById('publications')) {
        loadPublications();
    }

    // 加载并显示 Experiences 页面的内容
    if (document.getElementById('experiences')) {
        loadExperiences();
    }

    // 加载并显示 Life Timeline 页面的内容
    if (document.getElementById('life-timeline')) {
        loadLifeTimeline();
    }

    // 处理导航栏的显示/隐藏逻辑
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
});

// 加载 Publications 数据
function loadPublications() {
    fetch("../data/publications.json")
        .then(response => response.json())
        .then(data => {
            const publicationsList = document.getElementById("publications");
            publicationsList.innerHTML = "";

            data.forEach(pub => {
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
                publicationsList.appendChild(li);
            });
        })
        .catch(error => console.error("Error loading publications:", error));
}

// 加载 Experiences 数据
function loadExperiences() {
    fetch('data/experiences.json')
        .then(response => response.json())
        .then(data => {
            const experiencesList = document.getElementById('experiences');
            data.forEach(exp => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <h3>${exp.title}</h3>
                    <p><strong>Role:</strong> ${exp.role}</p>
                    <p><strong>Description:</strong> ${exp.description}</p>
                    <p><strong>Year:</strong> ${exp.year}</p>
                `;
                experiencesList.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading experiences:', error));
}

// 加载 Life Timeline 数据
function loadLifeTimeline() {
    fetch('data/life.json')
        .then(response => response.json())
        .then(data => {
            const timelineList = document.getElementById('timeline');
            data.forEach(event => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <h3>${event.title}</h3>
                    <p><strong>Date:</strong> ${event.date}</p>
                    <p>${event.description}</p>
                `;
                timelineList.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading life events:', error));
}
