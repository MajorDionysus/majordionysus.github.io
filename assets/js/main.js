// 配置常量
const DATA_BASE_PATH = '../data/'; // JSON 数据文件的基础路径
const PAGE_DATA_MAP = {
    publications: { format: formatPublication, file: 'publications.json' },
    experiences: { format: formatExperience, file: 'experiences.json' },
    'life-timeline': { format: formatLifeEvent, file: 'life.json' }
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

// 移动端菜单交互
document.addEventListener('DOMContentLoaded', function() {
    // 汉堡菜单点击事件
    const hamburger = document.querySelector('.hamburger-menu');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            document.querySelector('.mobile-sidebar').classList.add('active');
            document.querySelector('.overlay').classList.add('active');
        });
    }
    
    // 覆盖层点击事件
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            document.querySelector('.mobile-sidebar').classList.remove('active');
            this.classList.remove('active');
        });
    }
    
    // 导航项点击事件
    const navLinks = document.querySelectorAll('.mobile-nav a');
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                document.querySelector('.mobile-sidebar').classList.remove('active');
                document.querySelector('.overlay').classList.remove('active');
            });
        });
    }
});

// main.js
document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('themeToggle');
    // 绑定点击事件（使用更可靠的方式）
    btn.addEventListener('click', function handleThemeToggle() {        
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
         // 同时更新本地存储和DOM属性
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // 添加旋转动画
        this.style.transform = `rotate(${newTheme === 'dark' ? '-30' : '30'}deg)`;
    });
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
    <div class="image-container">
    <img src="${pub.imageUrl}" alt="${pub.title} cover">
</div>

<div class="content-card" style="
    font-family: 'Georgia', 'Times New Roman', serif;
    line-height: 1.5;
    padding: 1rem;
    color: inherit;
">

    <!-- Title -->
    <h4 style="text-align: center; margin-bottom: 0.5em;">
        <a href="${pub.url}" target="_blank" rel="noopener noreferrer" style="
            color: inherit;
            text-decoration: none;
            border-bottom: 1px dotted #999;
            transition: all 0.2s ease;
        ">
            ${pub.title}
        </a>
    </h4>

    <!-- Authors -->
    <h6 style="
        text-align: center;
        font-weight: normal;
        font-size: 0.95em;
        line-height: 1.4;
        margin-bottom: 0.2em;
    ">
        ${pub.authors}
    </h6>

    <hr style="border-top: 1px solid #ccc;">

    <!-- Journal -->
    <div style="
        font-size: 1em;
        font-weight: 600;
        padding: 0.3em 0.8em;
        border-left: 4px solid #6c63ff;
        background-color: rgba(108, 99, 255, 0.08);
        border-radius: 6px;
        margin-bottom: 0.8em;
    ">
        <span style="opacity: 0.85;">Journal:</span> <i>${pub.journal}</i>
    </div>

    <!-- Year -->
    <div style="margin-bottom: 0em;">
        <strong>Year:</strong> ${pub.year}
    </div>

    <!-- DOI -->
    ${pub.doi ? `
        <strong>DOI:</strong>
        <a href="${pub.url}" target="_blank" rel="noopener noreferrer" style="color: #4a4af4;">
            ${pub.doi}
        </a>` : ''}

    <!-- Abstract -->
    ${pub.abstract ? `
    <div class="abstract-box" style="
        background-color: rgba(0,0,0,0.03);
        padding: 0.75em 1em;
        border-left: 3px solid #aaa;
        border-radius: 6px;
        font-size: 0.95em;
        color: #444;
    ">
        <p class="abstract" style="margin: 0;">${pub.abstract}</p>
    </div>` : ''}

</div>

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

  // 文字区
  const contentHTML = `
    <div class="content-card">
      <h4 style="text-align: center; margin-bottom: 0.5em; line-height: 1.6;">
        ${exp.url
          ? `<a href="${exp.url}" target="_blank" rel="noopener noreferrer" style="border-bottom: 3px dotted #999;
            transition: all 0.2s ease; text-decoration: none; color: inherit;">${exp.title}</a>`
          : exp.title}
      </h4>
        <div style="text-align: center; margin-bottom: 1rem;">
            ${exp.role ? `
            <h6 style="
            display: inline-block;
            color: var(--text-color);
            padding: 0.4em 1.2em;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.9em;
            margin-right: 1em;
            user-select: none;
            border: 1.6px dotted #6c63ff;
            background-color: transparent;
            letter-spacing: 0.02em;
            ">
            <strong>Role:</strong> ${exp.role}
            </h6>
            ` : ''}
            ${exp.year ? `
            <h6 style="
            display: inline-block;
            color: var(--text-color);
            padding: 0.4em 1.2em;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.9em;
            user-select: none;
            border: 1.6px dotted #63acffff;
            background-color: transparent;
            letter-spacing: 0.02em;
            ">
            <strong>Year:</strong> ${exp.year}
            </h6>
            ` : ''}
            </div>

      ${exp.abstract ? `<div class="abstract-box"><p class="abstract">${exp.abstract}</p></div>`    : ''}
    </div>
  `;

  // 相册区
  let galleryHTML = `<div class="gallery">`;
  if (Array.isArray(exp.images)) {
    exp.images.forEach(img => {
      const src       = typeof img === 'string' ? img : img.url;
      const alt       = typeof img === 'object' ? (img.alt || '') : '';
      galleryHTML += `
        <div class="gallery-item">
          <img src="${src}" alt="${alt}">
        </div>
      `;
    });
  }
  galleryHTML += `</div>`;

  li.innerHTML = contentHTML + galleryHTML;

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
// 在main.js顶部添加动画配置对象
const ANIME_CONFIG = {
    navItems: {
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(150),
        duration: 800
    },
    content: {
        opacity: [0, 1],
        duration: 3600
    },
    cards: {
        in: {
            opacity: [0, 1],
            translateY: [50, 0],
            scale: [0.5, 1],
            delay: anime.stagger(100, {start: 200}),
            duration: 600,
            easing: 'easeOutQuint'
        },
        hover: {
            scale: 1.15,
            duration: 600,
            easing: 'easeOutElastic(1, .6)'
        },
        out: {
            scale: 1,
            duration: 600,
            easing: 'easeOutElastic(1, .6)'
        }
    }
};

// 修改后的动画初始化代码
document.addEventListener('DOMContentLoaded', function() {
    // 层级式入场动画
    anime({ targets: '.sidebar', ...ANIME_CONFIG.sidebar });
    
    // anime({ targets: '.sidebar nav li', ...ANIME_CONFIG.navItems });

    anime({ targets: '.main-content', ...ANIME_CONFIG.content });
    
    anime({ targets: '.contact-item', ...ANIME_CONFIG.cards.in });

    
    // 卡片悬停系统  
    document.querySelectorAll('.contact-item').forEach(item => {
        let animation;
        
        item.addEventListener('mouseenter', () => {
            animation = anime({
                targets: item,
                ...ANIME_CONFIG.cards.hover,
                begin: () => {
                    anime({
                        targets: item.querySelector('i, img'),
                        rotate: () => anime.random(-30, 30) + 'deg',
                        duration: 400,
                        easing: 'easeOutElastic(1, .6)'
                    });
                }
            });
        });

        item.addEventListener('mouseleave', () => {
            animation?.pause();
            anime({
                targets: item,
                scale: 1,
                duration: 600,
                easing: 'easeOutElastic(1, .6)'
            });
            anime({
                targets: item.querySelector('i, img'),
                scale: 1,
                rotate: '0deg',
                duration: 600
            });
        });
    });

    document.querySelectorAll('.timeline-item').forEach(item => {
        // 只针对图片元素
        const img = item.querySelector('img');
        if (!img) return;

        // 移除之前的动画对象
        let animation = null;

        item.addEventListener('mouseenter', () => {
            // 移除可能存在的正在运行的动画
            anime.remove(img);
            
            // 创建新的缩放动画
            animation = anime({
                targets: img,
                scale: 1.15,
                duration: 400,
                easing: 'easeOutQuad'
            });
        });

        item.addEventListener('mouseleave', () => {
            // 移除可能存在的正在运行的动画
            anime.remove(img);
            
            // 平滑缩回原始大小
            animation = anime({
                targets: img,
                scale: 1,
                duration: 600,
                easing: 'easeOutElastic'
            });
        });
    });
});