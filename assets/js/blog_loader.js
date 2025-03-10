document.addEventListener("DOMContentLoaded", async function () {
    const blogList = document.getElementById("blog-list");
    const blogContent = document.getElementById("blog-content");

    // 预定义 Markdown 文件（手动维护 blog-list.txt 也可）
    const blogFiles = ["post1.md", "post2.md", "post3.md"];

    // 解析 YAML 头部的正则表达式
    const yamlRegex = /^---\s*([\s\S]*?)\s*---/;

    let blogs = [];

    // 遍历文件列表，解析 YAML 头部信息
    for (let file of blogFiles) {
        const response = await fetch(`data/blogs/${file}`);
        const markdownText = await response.text();

        // 提取 YAML 头部
        const match = markdownText.match(yamlRegex);
        let metadata = {};

        if (match) {
            const yamlText = match[1];
            metadata = parseYAML(yamlText);
        }

        blogs.push({
            file: file,
            title: metadata.title || file.replace(".md", ""),
            date: metadata.date ? new Date(metadata.date) : new Date(),
            description: metadata.description || "No description available."
        });
    }

    // 按日期降序排列（最新的在前）
    blogs.sort((a, b) => b.date - a.date);

    // 渲染博客列表
    blogs.forEach(blog => {
        const card = document.createElement("div");
        card.className = "blog-card";
        card.innerHTML = `
            <h3>${blog.title}</h3>
            <p>${blog.description}</p>
            <small>${blog.date.toISOString().split("T")[0]}</small>
            <button data-file="${blog.file}">Read More</button>
        `;
        card.querySelector("button").addEventListener("click", async (event) => {
            event.preventDefault();
            loadMarkdown(blog.file);
        });
        blogList.appendChild(card);
    });
});

// 加载 Markdown 内容并解析
async function loadMarkdown(file) {
    const response = await fetch(`data/blogs/${file}`);
    let markdownText = await response.text();

    // 移除 YAML 头部
    markdownText = markdownText.replace(/^---\s*([\s\S]*?)\s*---/, "");

    document.getElementById("blog-content").innerHTML = marked.parse(markdownText);
}

// 解析 YAML 头部
function parseYAML(yamlText) {
    const lines = yamlText.split("\n");
    const data = {};
    lines.forEach(line => {
        const [key, value] = line.split(":").map(str => str.trim());
        if (key && value) {
            data[key] = value.replace(/^"|"$/g, ""); // 去掉可能的引号
        }
    });
    return data;
}

