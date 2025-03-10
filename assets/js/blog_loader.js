document.addEventListener("DOMContentLoaded", async function () {
    const blogList = document.getElementById("blog-list");
    const blogContent = document.getElementById("blog-content");

    // 预定义 Markdown 文件（可以改成通过 JSON 读取）
    const blogFiles = ["test.md"];

    // YAML 头部解析正则
    const yamlRegex = /^---\s*([\s\S]*?)\s*---/;

    let blogs = [];

    // 遍历 Markdown 文件，解析 YAML 头部信息
    for (let file of blogFiles) {
        try {
            const response = await fetch(`/data/blogs/${file}`); // 使用绝对路径
            if (!response.ok) throw new Error(`Failed to load ${file}`);

            const markdownText = await response.text();
            const match = markdownText.match(yamlRegex);
            let metadata = {};

            if (match) {
                metadata = jsyaml.load(match[1]); // 使用 js-yaml 解析 YAML 数据
            }

            blogs.push({
                file: file,
                title: metadata.title || file.replace(".md", ""),
                date: metadata.date ? new Date(metadata.date) : new Date(0),
                description: metadata.description || "No description available."
            });
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
        }
    }

    // 按日期降序排列（最新文章优先）
    blogs.sort((a, b) => b.date - a.date);

    // 渲染博客列表
    renderBlogList(blogs, blogList, blogContent);
});

// 渲染博客列表
function renderBlogList(blogs, blogList, blogContent) {
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
            await loadMarkdown(blog.file, blogContent);
        });
        blogList.appendChild(card);
    });
}

// 加载 Markdown 内容并解析
async function loadMarkdown(file, blogContent) {
    try {
        const response = await fetch(`/data/blogs/${file}`); // 使用绝对路径
        if (!response.ok) throw new Error(`Failed to load ${file}`);

        let markdownText = await response.text();

        // 移除 YAML 头部
        markdownText = markdownText.replace(/^---\s*([\s\S]*?)\s*---/, "");

        // 使用 marked 解析 Markdown
        blogContent.innerHTML = marked.parse(markdownText);
    } catch (error) {
        console.error(`Error loading ${file}:`, error);
        blogContent.innerHTML = "<p>Failed to load blog content.</p>";
    }
}
