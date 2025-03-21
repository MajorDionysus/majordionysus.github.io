// 配置常量
const DATA_BASE_PATH = '../data/'; // JSON 数据文件的基础路径
const PAGE_DATA_MAP = {
    publications: { format: formatPublication, file: 'publications.json' },
    experiences: { format: formatExperience, file: 'experiences.json' },
    'life-timeline': { format: formatLifeEvent, file: 'life.json' },
    blog: { format: formatBlogCard, file: 'blogs.json' } // 添加博客数据源
};

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    initializePage();
    setupNavigation();
});

document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split("/").pop(); // 获取当前页面文件名
    const navLinks = document.querySelectorAll(".sidebar nav a");

    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href").split("/").pop(); // 获取链接的文件名
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var chartContainer = document.getElementById('dashboard-chart');
    var myChart = echarts.init(chartContainer);

    var option = {
        series: [
            {
                type: 'pie',
                radius: ['60%', '80%'], // 中间镂空，形成环形
                avoidLabelOverlap: false,
                label: { show: false },
                emphasis: { label: { show: true, fontSize: '16', fontWeight: 'bold' } },
                data: [
                    { value: 5, name: 'Blogs' },
                    { value: 10, name: 'Publications' },
                    { value: 7, name: 'Projects' }
                ],
                color: ['#00aaff', '#ffaa00', '#ff5577'], // 颜色搭配高端
                itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 }
            }
        ]
    };

    myChart.setOption(option);
});

/**
 * 初始化页面内容
 */
function initializePage() {
    // 获取当前页面的 ID（根据容器元素的 ID）
    const pageId = Object.keys(PAGE_DATA_MAP).find(id => document.getElementById(id));
    if (pageId) {
        const { file, format } = PAGE_DATA_MAP[pageId];
        loadData(pageId, file, format);
    }
}

/**
 * 设置导航栏交互逻辑
 */
function setupNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// main.js
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM加载完成，开始初始化");
    
    // 调试：立即检查按钮是否存在
    const btn = document.getElementById('themeToggle');
    console.log("按钮元素:", btn); // 应该显示按钮对象
    
    if (!btn) {
        console.error("错误：找不到主题切换按钮");
        return;
    }

    // 绑定点击事件（使用更可靠的方式）
    btn.addEventListener('click', function handleThemeToggle() {
        console.log("点击事件触发！当前主题:", document.documentElement.getAttribute('data-theme'));
        
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
         // 同时更新本地存储和DOM属性
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // 添加旋转动画
        this.style.transform = `rotate(${newTheme === 'dark' ? '-30' : '30'}deg)`;
    });
    
    console.log("主题切换功能已初始化");
});

// 监听存储变化（确保多标签页同步）
window.addEventListener('storage', (event) => {
    if (event.key === 'theme') {
        document.documentElement.setAttribute('data-theme', event.newValue);
    }
});

/**
 * 通用数据加载函数
 * @param {string} elementId - 容器元素的 ID
 * @param {string} fileName - JSON 文件名
 * @param {Function} formatFunction - 数据格式化函数
 */
function loadData(elementId, fileName, formatFunction) {
    const container = document.getElementById(elementId);
    if (!container) {
        console.warn(`Container with ID "${elementId}" not found.`);
        return;
    }

    fetch(`${DATA_BASE_PATH}${fileName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load data: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Loaded data for ${elementId}:`, data); // 调试信息
            if (!Array.isArray(data)) {
                throw new Error('Loaded data is not an array.');
            }
            renderData(container, data, formatFunction);
        })
        .catch(error => {
            console.error(`Error loading data for "${elementId}":`, error);
            container.innerHTML = `<p class="error-message">Failed to load data. Please try again later.</p>`;
        });
}

/**
 * 渲染数据到容器
 * @param {HTMLElement} container - 容器元素
 * @param {Array} data - 数据数组
 * @param {Function} formatFunction - 数据格式化函数
 */
function renderData(container, data, formatFunction) {
    const fragment = document.createDocumentFragment();
    data.forEach(item => {
        const element = formatFunction(item);
        if (element) {
            fragment.appendChild(element);
        }
    });
    container.innerHTML = ''; // 清空容器
    container.appendChild(fragment);
}

// ==================== 数据格式化函数 ====================

/**
 * 格式化 Publications 数据
 * @param {Object} pub - 单条出版物数据
 * @returns {HTMLElement}
 */
function formatPublication(pub) {
    const li = document.createElement('li');
    li.classList.add('publication-card');
    li.innerHTML = `
        <h3><a href="${pub.url}" target="_blank" rel="noopener noreferrer">${pub.title}</a></h3>
        <p><strong>Authors:</strong> ${pub.authors}</p>
        <p><strong>Year:</strong> ${pub.year}</p>
        <p><strong>Journal:</strong> ${pub.journal}</p>
        ${pub.doi ? `<p><strong>DOI:</strong> <a href="${pub.url}" target="_blank" rel="noopener noreferrer">${pub.doi}</a></p>` : ''}
        ${pub.abstract ? `<p class="abstract">${pub.abstract}</p>` : ''}
    `;
    return li;
}

/**
 * 格式化 Experiences 数据
 * @param {Object} exp - 单条经历数据
 * @returns {HTMLElement}
 */
function formatExperience(exp) {
    const li = document.createElement('li');
    li.classList.add('experience-card');
    li.innerHTML = `
        <h3><a href="${exp.url}" target="_blank" rel="noopener noreferrer">${exp.title}</a></h3>
        ${exp.role ? `<p><strong>Role:</strong> ${exp.role}</p>` : ''}
        ${exp.year ? `<p><strong>Year:</strong> ${exp.year}</p>` : ''}
        ${exp.description ? `<p>${exp.description}</p>` : ''}
    `;
    return li;
}


/**
 * 格式化 Life Timeline 数据
 * @param {Object} event - 单条时间线事件数据
 * @returns {HTMLElement}
 */
function formatLifeEvent(event) {
    const li = document.createElement('li');
    li.classList.add('timeline-item');
    li.innerHTML = `
        <h3>${event.date}: ${event.title}</h3>
        ${event.description ? `<p>${event.description}</p>` : ''}
        ${event.image ? `<img src="../assets/images/${event.image}" alt="${event.title}" class="timeline-image">` : ''}
    `;
    return li;
}

/**
 * 格式化博客卡片数据
 * @param {Object} post - 单篇博客数据
 * @returns {HTMLElement}
 */
function formatBlogCard(post) {
    const card = document.createElement('div');
    card.classList.add('blog-card');

    card.innerHTML = `
        <div class="blog-image-container">
            <img src="${post.image}" alt="${post.title}" class="blog-image">
        </div>
        <div class="blog-content">
            <h3 class="blog-title">${post.title}</h3>
            ${post.description ? `<p class="blog-description">${post.description}</p>` : ''}
            <div class="blog-tags">
                ${post.tags.map(tag => `<span>${tag}</span>`).join('')}
            </div>
            <p class="blog-date">${post.date}</p>
            <a href="${post.link}" class="read-more-button" target="_blank" rel="noopener noreferrer">Read More →</a>
        </div>
    `;

    return card;
}
