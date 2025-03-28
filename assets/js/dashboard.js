
document.addEventListener('DOMContentLoaded', function () {
    const blogTrendCtx = document.getElementById('blogTrendChart').getContext('2d');
    const publicationsCtx = document.getElementById('publicationsChart').getContext('2d');
    const trendCtx = document.getElementById('trendChart').getContext('2d');

    Promise.all([
        fetch('data/blogs.json').then(response => response.json()),
        fetch('data/publications.json').then(response => response.json()),
        fetch('data/experiences.json').then(response => response.json())
    ]).then(([blogs, publications, experiences]) => {
        // 统计数据
        const blogCount = blogs.length;
        const publicationCount = publications.length;
        const experienceCount = experiences.length;

        // 获取今年的 Blog 数据（按月份分组）
        const currentYear = new Date().getFullYear();
        const thisYearBlogs = blogs.filter(blog => {
            const blogDate = new Date(blog.date);
            return blogDate.getFullYear() === currentYear;
        });

        const monthlyBlogCounts = Array(12).fill(0); // 用于存储12个月份的博客数量
        thisYearBlogs.forEach(blog => {
            const blogDate = new Date(blog.date);
            const month = blogDate.getMonth(); // 获取月份（0-11）
            monthlyBlogCounts[month]++;
        });

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // 图表配置
        // 1. 绘制 Blog 时间序列图（图一）
        new Chart(blogTrendCtx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Blog Posts in ' + currentYear,
                    data: monthlyBlogCounts,
                    borderColor: '#4e73df',
                    backgroundColor: 'rgba(78, 115, 223, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw} posts`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Month'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Blogs'
                        }
                    }
                }
            }
        });

        // 2. 绘制 Publications & Experiences 分类占比图（图二）
       new Chart(publicationsCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Blogs', 'Publications', 'Projects'],
                    datasets: [{
                        label: 'Total Entries',
                        data: [blogCount, publicationCount, experienceCount],
                        backgroundColor: ['#4e73df', '#36b9cc', '#ffcc5c'],
                        borderColor: ['#4e73df', '#36b9cc', '#ffcc5c'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true, // Set to true to display the legend
                            position: 'top' // Choose the position of the legend
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return `${tooltipItem.label}: ${tooltipItem.raw} entries`;
                                }
                            }
                        }
                    }
                }
            });

        // 3. 绘制 Experience / Publication Trend（图三）
        const experienceYears = experiences.map(exp => exp.year);
        const publicationYears = publications.map(pub => pub.year);

        const experienceCounts = experienceYears.reduce((acc, year) => {
            acc[year] = (acc[year] || 0) + 1;
            return acc;
        }, {});
        const publicationCounts = publicationYears.reduce((acc, year) => {
            acc[year] = (acc[year] || 0) + 1;
            return acc;
        }, {});

        const years = [...new Set([...Object.keys(experienceCounts), ...Object.keys(publicationCounts)])];
        const experienceData = years.map(year => experienceCounts[year] || 0);
        const publicationData = years.map(year => publicationCounts[year] || 0);

        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Projects',
                        data: experienceData,
                        borderColor: '#4e73df',
                        backgroundColor: 'rgba(78, 115, 223, 0.2)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Publications',
                        data: publicationData,
                        borderColor: '#36b9cc',
                        backgroundColor: 'rgba(54, 185, 204, 0.2)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.dataset.label}: ${tooltipItem.raw} entries`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Count'
                        }
                    }
                }
            }
        });

    }).catch(error => {
        console.error('Error loading JSON:', error);
    });
});
