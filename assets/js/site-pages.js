/* ═════════════════════════════════════
   site-pages.js — Renjie Mei Portfolio
   ═════════════════════════════════════ */

/* ── Markdown parser (lightweight, no dependencies) ── */
var _mdCache = {};
function parseMarkdown(text) {
    if (!text || typeof text !== 'string') return '';
    if (_mdCache[text]) return _mdCache[text];
    var html = text
        .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.+?)__/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/_(.+?)_/g, '<em>$1</em>')
        .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
        .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
        .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
        .replace(/^---+$/gm, '<hr>')
        .replace(/^\*\*\*+$/gm, '<hr>')
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        .replace(/((?:^[*-] .+\n?)+)/gm, function(m) {
            return '<ul>' + m.trim().split('\n').filter(function(l){return l.trim();}).map(function(l){return '<li>' + l.replace(/^[*-] /,'') + '</li>';}).join('') + '</ul>';
        })
        .replace(/((?:^\d+\. .+\n?)+)/gm, function(m) {
            return '<ol>' + m.trim().split('\n').filter(function(l){return l.trim();}).map(function(l){return '<li>' + l.replace(/^\d+\. /,'') + '</li>';}).join('') + '</ol>';
        })
        .replace(/^(?!<[a-z][\s\S]*<\/|<hr|<ul|<ol|<h[1-6])(.+)$/gm, '<p>$1</p>')
        .replace(/<\/blockquote>\n<blockquote>/g, '\n');
    _mdCache[text] = html;
    return html;
}

function isHTML(str) {
    if (!str) return false;
    var s = Array.isArray(str) ? String(str[0]) : String(str);
    return /<[a-z][\s\S]*>/i.test(s);
}

function renderBody(body) {
    if (!body) return '';
    if (Array.isArray(body)) {
        if (isHTML(body[0])) return body.join('');
        return body.map(parseMarkdown).join('');
    }
    if (isHTML(body)) return body;
    return parseMarkdown(body);
}

/* ── Gallery: normalize image from string or object ── */
function parseGalleryImage(img) {
    if (typeof img === 'string') return { src: img, caption: '' };
    return { src: img.src || img.url || img.path || '', caption: img.caption || img.alt || '' };
}

/* ── Gallery: normalize chapter from any JSON shape ── */
function parseGalleryChapter(ch) {
    return {
        id: ch.id || ch.slug || ch.name || '',
        title: ch.title || ch.name || '',
        summary: ch.summary || ch.description || '',
        images: (ch.images || ch.photos || []).map(parseGalleryImage)
    };
}

/* ── Img error fallback ── */
function onImgError(img) {
    if (img) { img.style.opacity = '0.18'; img.onerror = null; }
}

/* ── Publication formatter ── */
function formatPublication(pub) {
    var li = document.createElement('li');
    li.className = 'pub-card';
    li.innerHTML =
        '<div class="pub-thumb"><img src="' + pub.imageUrl + '" alt="" loading="lazy" onerror="onImgError(this)"></div>' +
        '<div class="pub-info">' +
        '<div class="pub-title"><a href="' + pub.url + '" target="_blank" rel="noopener noreferrer">' + Site.escapeHTML(pub.title) + '</a></div>' +
        '<div class="pub-authors">' + (pub.authors || '') + '</div>' +
        '<div class="pub-journal">' + (pub.journal || '') + ' <span style="font-size:0.8em;color:var(--text-3)">' + Site.escapeHTML(pub.year || '') + '</span></div>' +
        (pub.abstract ? '<div class="pub-abstract" style="margin-top:0.6rem">' + Site.escapeHTML(pub.abstract) + '</div>' : '') +
        '</div>';
    return li;
}

/* ── Research formatter ── */
function formatExperience(exp, type) {
    var li = document.createElement('li');
    li.className = 'exp-card exp-card--' + type;

    var tags = '';
    if (Array.isArray(exp.tag)) {
        tags = '<div class="exp-meta">' + exp.tag.map(function(t) {
            return '<span class="exp-tag">' + Site.escapeHTML(t) + '</span>';
        }).join('') + '</div>';
    }

    var gallery = '';
    if (Array.isArray(exp.images) && exp.images.length) {
        gallery = '<div class="exp-gallery">' + exp.images.map(function(img) {
            var src = typeof img === 'string' ? img : (img.url || img.src || '');
            return '<img src="' + src + '" alt="" loading="lazy" onerror="onImgError(this)">';
        }).join('') + '</div>';
    }

    var badge = '';
    if (exp.role) {
        var roleSlug = exp.role.toLowerCase().replace(/\s+/g, '-');
        badge = '<span class="exp-role-pill exp-role-pill--' + roleSlug + '">' + Site.escapeHTML(exp.role) + '</span>';
    }

    li.innerHTML =
        '<div class="exp-card-top">' +
        (exp.url ? '<h4><a href="' + exp.url + '" target="_blank" rel="noopener noreferrer">' + Site.escapeHTML(exp.title) + '</a></h4>' : '<h4>' + Site.escapeHTML(exp.title) + '</h4>') +
        '</div>' +
        '<div class="exp-pills">' + badge + tags + (exp.year ? '<span class="exp-year-pill">' + Site.escapeHTML(exp.year) + '</span>' : '') + '</div>' +
        (exp.abstract ? '<div class="exp-abstract">' + Site.escapeHTML(exp.abstract) + '</div>' : '') +
        gallery;
    return li;
}

function renderExperiencesList(id, data, formatter) {
    var el = document.getElementById(id);
    if (!el) return;
    if (!Array.isArray(data)) { el.innerHTML = '<li class="error-msg">No content available.</li>'; return; }
    var frag = document.createDocumentFragment();
    data.forEach(function(item) {
        var node = formatter(item);
        if (node) frag.appendChild(node);
    });
    el.replaceChildren(frag);
}

function renderList(id, data, formatter) {
    var el = document.getElementById(id);
    if (!el) return;
    if (!Array.isArray(data)) { el.innerHTML = '<li class="error-msg">No content available.</li>'; return; }
    var frag = document.createDocumentFragment();
    data.forEach(function(item) {
        var node = formatter(item);
        if (node) frag.appendChild(node);
    });
    el.replaceChildren(frag);
}

function showError(id) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = '<li class="error-msg">Failed to load content.</li>';
}

function dataURL(file) {
    return (document.body.getAttribute('data-root') || '') + 'data/' + file;
}

function fetchJSON(url) {
    console.log('[fetchJSON] GET', url);
    return fetch(url).then(function(r) {
        console.log('[fetchJSON] status:', r.status, url);
        if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + url);
        return r.json();
    }).catch(function(err) {
        console.error('[fetchJSON] ERROR:', err.message);
        throw err;
    });
}

/* ── Home ── */
function initHome() {
    setupNewsSlider([]);
    fetchJSON(dataURL('minimal-news.json'))
        .then(function(data) { if (data.news) setupNewsSlider(data.news); })
        .catch(function() {});
    initHomeBlogPreview();
}

function initHomeBlogPreview() {
    var mount = document.getElementById('blogPreview');
    if (!mount) return;
    fetchJSON(dataURL('blogs.json')).then(function(data) {
        var posts = (data.posts || []).slice(0, 2);
        if (!posts.length) { mount.innerHTML = '<p class="error-msg">No posts yet.</p>'; return; }
        mount.innerHTML = posts.map(function(post) {
            return '<a class="blog-card blog-card--compact" href="' + Site.pagePath('content/blog-post.html') + '?slug=' + encodeURIComponent(post.slug) + '">' +
                '<div class="blog-card-media"><img src="' + post.cover + '" alt="" loading="lazy" onerror="onImgError(this)"></div>' +
                '<div class="blog-card-body">' +
                '<div class="blog-card-meta"><time datetime="' + post.date + '">' + Site.formatDate(post.date) + '</time></div>' +
                '<h3>' + Site.escapeHTML(post.title) + '</h3>' +
                '<p>' + Site.escapeHTML(post.excerpt) + '</p>' +
                '</div></a>';
        }).join('');
    }).catch(function() { mount.innerHTML = ''; });
}

function setupNewsSlider(newsData) {
    if (!newsData.length) {
        var track = document.getElementById('newsSliderTrack');
        if (track) track.innerHTML = '<div class="news-slide"><p class="error-msg" style="padding:2rem;text-align:center;width:100%">No news yet.</p></div>';
        return;
    }
    var idx = 0;
    var timer;
    var track = document.getElementById('newsSliderTrack');
    var wrap = document.querySelector('.news-slider-wrap');
    if (!track || !wrap) return;

    track.replaceChildren();
    newsData.forEach(function(n) {
        var s = document.createElement('div');
        s.className = 'news-slide';
        s.innerHTML = '<img src="' + n.image + '" alt="' + Site.escapeHTML(n.title) + '" loading="lazy" data-lightbox onerror="onImgError(this)">';
        track.appendChild(s);
    });

    function update() {
        var n = newsData[idx];
        var d = document.getElementById('newsDateMinimal');
        var t = document.getElementById('newsTitleMinimal');
        var e = document.getElementById('newsExcerptMinimal');
        var f = document.getElementById('minimalProgressFill');
        if (d) d.textContent = Site.formatDate(n.date);
        if (t) t.textContent = n.title;
        if (e) e.textContent = n.excerpt;
        if (f) f.style.width = ((idx + 1) / newsData.length * 100) + '%';
    }

    function go(i) {
        idx = ((i % newsData.length) + newsData.length) % newsData.length;
        track.style.transition = 'transform 0.45s cubic-bezier(.4,0,.2,1)';
        track.style.transform = 'translateX(-' + (idx * track.offsetWidth) + 'px)';
        update();
    }

    var prevBtn = document.getElementById('minimalPrevBtn');
    var nextBtn = document.getElementById('minimalNextBtn');
    if (prevBtn) prevBtn.addEventListener('click', function() { go(idx - 1); reset(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { go(idx + 1); reset(); });
    wrap.addEventListener('mouseenter', function() { clearInterval(timer); });
    wrap.addEventListener('mouseleave', reset);
    window.addEventListener('resize', function() { go(idx); });

    function reset() {
        clearInterval(timer);
        timer = setInterval(function() { go(idx + 1); }, 9000);
    }

    go(0);
    reset();
}

/* ── Publications ── */
function initPublications() {
    var el = document.getElementById('publications');
    if (!el) return;
    fetchJSON(dataURL('publications.json'))
        .then(function(data) { renderList('publications', data, formatPublication); })
        .catch(function(err) { console.error('[Publications]', err); showError('publications'); });
}

/* ── Research ── */
function initResearch() {
    fetchJSON(dataURL('experiences.json'))
        .then(function(data) {
            if (!Array.isArray(data)) { showError('experiences-lab'); showError('experiences-course'); return; }
            var LAB_TAGS = ['Lab Proj'];
            var labData = data.filter(function(item) {
                return Array.isArray(item.tag) && item.tag.some(function(t) {
                    return LAB_TAGS.some(function(lt) { return t.indexOf(lt) === 0; });
                });
            });
            var courseData = data.filter(function(item) {
                return Array.isArray(item.tag) && !item.tag.some(function(t) {
                    return LAB_TAGS.some(function(lt) { return t.indexOf(lt) === 0; });
                });
            });
            renderExperiencesList('experiences-lab', labData, function(exp) { return formatExperience(exp, 'lab'); });
            renderExperiencesList('experiences-course', courseData, function(exp) { return formatExperience(exp, 'course'); });
        })
        .catch(function(err) { console.error('[Research]', err); showError('experiences-lab'); showError('experiences-course'); });
}

/* ── Gallery ── */
function initGallery() {
    console.log('[Gallery] initGallery start');
    var mainImg = document.getElementById('galleryMainImg');
    var prevBtn = document.getElementById('galleryPrev');
    var nextBtn = document.getElementById('galleryNext');
    var counter = document.getElementById('galleryCounter');
    var caption = document.getElementById('galleryCaption');
    var fsBtn = document.getElementById('galleryFsBtn');
    var strip = document.getElementById('galleryStrip');
    var chapterTabs = document.getElementById('galleryChapterTabs');
    var fsOverlay = document.getElementById('galleryFsOverlay');
    var fsImg = document.getElementById('galleryFsImg');
    var fsCaption = document.getElementById('galleryFsCaption');
    var fsClose = document.getElementById('galleryFsClose');
    var fsPrev = document.getElementById('galleryFsPrev');
    var fsNext = document.getElementById('galleryFsNext');
    if (!mainImg) return;

    var chapters = [];
    var activeChapter = 0;
    var activeIndex = 0;

    fetchJSON(dataURL('galleries.json'))
        .then(function(data) {
            // Support both {chapters:[]} and {albums:[]} formats
            var raw = data.chapters || data.albums || [];
            chapters = raw.map(parseGalleryChapter);
            if (!chapters.length) throw new Error('Gallery data has no chapters');
            var hash = location.hash.replace('#', '');
            var ih = chapters.findIndex(function(c) { return c.id === hash; });
            if (ih >= 0) activeChapter = ih;
            buildTabs();
            buildStrip();
            updateImage();
        })
        .catch(function(err) {
            console.error('[Gallery]', err);
            var viewer = document.getElementById('galleryViewer');
            if (viewer) viewer.innerHTML = '<p class="error-msg" style="padding:3rem;text-align:center">Gallery error: ' + err.message + '</p>';
        });

    function buildTabs() {
        if (!chapterTabs) return;
        chapterTabs.innerHTML = chapters.map(function(ch, i) {
            return '<button class="gallery-tab' + (i === activeChapter ? ' active' : '') + '" data-i="' + i + '">' + Site.escapeHTML(ch.title) + '</button>';
        }).join('');
        chapterTabs.querySelectorAll('.gallery-tab').forEach(function(btn) {
            btn.addEventListener('click', function() {
                activeChapter = parseInt(btn.getAttribute('data-i'), 10);
                activeIndex = 0;
                buildTabs();
                buildStrip();
                updateImage();
                history.replaceState(null, '', '#' + chapters[activeChapter].id);
            });
        });
    }

    function buildStrip() {
        if (!strip) return;
        var ch = chapters[activeChapter];
        strip.innerHTML = ch.images.map(function(img, i) {
            return '<button class="gallery-strip-thumb' + (i === activeIndex ? ' active' : '') + '" data-i="' + i + '">' +
                '<img src="' + img.src + '" alt="' + Site.escapeHTML(img.caption || '') + '" loading="lazy" onerror="onImgError(this)">' +
                '</button>';
        }).join('');
        strip.querySelectorAll('.gallery-strip-thumb').forEach(function(thumb) {
            thumb.addEventListener('click', function() {
                activeIndex = parseInt(thumb.getAttribute('data-i'), 10);
                updateImage();
            });
        });
        scrollActiveIntoView();
    }

    function updateImage() {
        var ch = chapters[activeChapter];
        var img = ch.images[activeIndex];
        if (!img) return;
        mainImg.style.opacity = '0';
        setTimeout(function() {
            mainImg.src = img.src;
            mainImg.alt = img.caption || ch.title;
            mainImg.onerror = function() { onImgError(mainImg); };
            mainImg.style.opacity = '1';
        }, 120);
        if (counter) counter.textContent = (activeIndex + 1) + ' / ' + ch.images.length;
        if (caption) caption.textContent = img.caption || '';
        if (strip) {
            strip.querySelectorAll('.gallery-strip-thumb').forEach(function(t, j) {
                t.classList.toggle('active', j === activeIndex);
            });
            scrollActiveIntoView();
        }
    }

    function scrollActiveIntoView() {
        var active = strip && strip.querySelector('.gallery-strip-thumb.active');
        if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    }

    function navigate(dir) {
        var ch = chapters[activeChapter];
        activeIndex = ((activeIndex + dir + ch.images.length) % ch.images.length);
        updateImage();
    }

    if (prevBtn) prevBtn.addEventListener('click', function() { navigate(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { navigate(1); });

    function openFs() {
        var ch = chapters[activeChapter];
        var img = ch && ch.images[activeIndex];
        if (!img || !fsOverlay) return;
        fsImg.src = img.src;
        fsImg.alt = img.caption || '';
        if (fsCaption) fsCaption.textContent = img.caption || '';
        fsOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeFs() {
        if (fsOverlay) fsOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (fsBtn) fsBtn.addEventListener('click', openFs);
    if (fsClose) fsClose.addEventListener('click', closeFs);
    if (fsPrev) fsPrev.addEventListener('click', function() { navigate(-1); openFs(); });
    if (fsNext) fsNext.addEventListener('click', function() { navigate(1); openFs(); });
    if (fsOverlay) fsOverlay.addEventListener('click', function(e) { if (e.target === fsOverlay) closeFs(); });
    if (mainImg) mainImg.addEventListener('click', openFs);

    document.addEventListener('keydown', function(e) {
        if (!document.getElementById('galleryViewer')) return;
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
        if (e.key === 'Escape' && fsOverlay && fsOverlay.classList.contains('open')) closeFs();
        if ((e.key === 'f' || e.key === 'F') && (!fsOverlay || !fsOverlay.classList.contains('open'))) openFs();
    });
}

/* ── Blog list ── */
function initBlogList() {
    var grid = document.getElementById('blogGrid');
    if (!grid) return;
    fetchJSON(dataURL('blogs.json'))
        .then(function(data) {
            var posts = data.posts || [];
            if (!posts.length) { grid.innerHTML = '<p class="error-msg">No posts yet.</p>'; return; }
            grid.innerHTML = posts.map(function(post) {
                var tags = (post.tags || []).map(function(t) {
                    return '<span class="tag-pill">' + Site.escapeHTML(t) + '</span>';
                }).join('');
                return '<a class="blog-card" href="' + Site.pagePath('content/blog-post.html') + '?slug=' + encodeURIComponent(post.slug) + '">' +
                    '<div class="blog-card-media"><img src="' + post.cover + '" alt="" loading="lazy" onerror="onImgError(this)"></div>' +
                    '<div class="blog-card-body">' +
                    '<div class="blog-card-meta"><time datetime="' + post.date + '">' + Site.formatDate(post.date) + '</time>' + tags + '</div>' +
                    '<h2>' + Site.escapeHTML(post.title) + '</h2>' +
                    '<p>' + Site.escapeHTML(post.excerpt) + '</p>' +
                    '<span class="blog-card-more">Read essay →</span>' +
                    '</div></a>';
            }).join('');
        })
        .catch(function(err) {
            console.error('[BlogList]', err);
            grid.innerHTML = '<p class="error-msg">Could not load posts: ' + err.message + '</p>';
        });
}

/* ── Blog post ── */
function initBlogPost() {
    var mount = document.getElementById('blogPost');
    if (!mount) return;
    var slug = new URLSearchParams(location.search).get('slug');
    if (!slug) {
        mount.innerHTML = '<p class="error-msg">No article selected. <a href="' + Site.pagePath('content/blog.html') + '">← All posts</a></p>';
        return;
    }
    fetchJSON(dataURL('posts/' + slug + '.json'))
        .then(function(post) {
            document.title = Site.escapeHTML(post.title) + ' | Renjie Mei';
            var tags = (post.tags || []).map(function(t) {
                return '<span class="tag-pill">' + Site.escapeHTML(t) + '</span>';
            }).join('');
            var bodyHtml = renderBody(post.body);
            mount.innerHTML =
                '<header class="article-header anim">' +
                '<a class="back-link" href="' + Site.pagePath('content/blog.html') + '">← All posts</a>' +
                '<div class="article-meta"><time datetime="' + post.date + '">' + Site.formatDate(post.date) + '</time>' + tags + '</div>' +
                '<h1 style="font-size:clamp(1.8rem,4vw,2.8rem);margin-bottom:0.75rem">' + Site.escapeHTML(post.title) + '</h1>' +
                '<p class="article-deck">' + Site.escapeHTML(post.excerpt) + '</p>' +
                '</header>' +
                '<figure class="article-cover anim anim-d1"><img src="' + post.cover + '" alt="" data-lightbox onerror="onImgError(this)"></figure>' +
                '<div class="article-body anim anim-d2">' + bodyHtml + '</div>';
        })
        .catch(function(err) {
            console.error('[BlogPost]', err);
            mount.innerHTML = '<p class="error-msg">Article not found. <a href="' + Site.pagePath('content/blog.html') + '">← All posts</a></p>';
        });
}

/* ── Page dispatcher ── */
document.addEventListener('DOMContentLoaded', function() {
    var page = document.body.getAttribute('data-page') || 'home';
    if (page === 'blog-post') { initBlogPost(); return; }
    if (page === 'home') { initHome(); return; }
    if (page === 'publications') { initPublications(); return; }
    if (page === 'research') { initResearch(); return; }
    if (page === 'gallery') { initGallery(); return; }
    if (page === 'blog') { initBlogList(); return; }
});
