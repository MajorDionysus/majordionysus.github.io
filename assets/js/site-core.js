var Site = {};

document.addEventListener('DOMContentLoaded', function () {

    Site.getRoot = function () { return document.body.getAttribute('data-root') || ''; };
    Site.dataPath = function (f) { return Site.getRoot() + 'data/' + f; };
    Site.pagePath = function (f) { return Site.getRoot() + f; };
    Site.fetchJSON = function (file) {
        return fetch(Site.dataPath(file)).then(function (r) {
            if (!r.ok) throw new Error('Failed to load ' + file);
            return r.json();
        });
    };
    Site.formatDate = function (str) {
        return new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };
    Site.escapeHTML = function (s) {
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    };

    /* ── Side Components ── */
    (function () {
        var sidebar = document.createElement('div');
        sidebar.className = 'social-sidebar';
        sidebar.innerHTML =
            '<a href="mailto:mrj100110@outlook.com" aria-label="Email" title="Email">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></a>' +
            '<a href="https://github.com/MajorDionysus" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">' +
            '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></a>' +
            '<a href="https://www.linkedin.com/in/renjiemei" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn">' +
            '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>' +
            '<span class="sidebar-label">Renjie Mei</span>';
        document.body.appendChild(sidebar);

        // Reading progress bar
        var progress = document.createElement('div');
        progress.className = 'reading-progress';
        progress.innerHTML = '<div class="progress-fill"></div><div class="progress-ball"></div>';
        document.body.appendChild(progress);

        // Back to top button
        var btt = document.createElement('button');
        btt.className = 'back-to-top';
        btt.setAttribute('aria-label', 'Back to top');
        btt.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
        document.body.appendChild(btt);
        btt.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    })();

    var NAV_ITEMS = [
        { id: 'home',          label: 'Home',          file: 'index.html' },
        { id: 'research',      label: 'Research',       file: 'content/experiences.html' },
        { id: 'publications',  label: 'Publications',   file: 'content/publications.html' },
        { id: 'gallery',      label: 'Gallery',        file: 'content/gallery.html' },
        { id: 'blog',          label: 'Blog',          file: 'content/blog.html' },
        { id: 'about',         label: 'About',          file: 'content/about.html' },
        { id: 'contact',       label: 'Contact',        file: 'content/contact.html' }
    ];

    /* ── Header ── */
    (function () {
        var mount = document.getElementById('site-header');
        if (!mount) return;
        var root = Site.getRoot();
        var page = document.body.getAttribute('data-page') || 'home';
        var active = (page === 'blog-post') ? 'blog' : page;

        var navLinks = NAV_ITEMS.map(function (item) {
            var href = root + item.file;
            var cls = item.id === active ? ' class="active"' : '';
            return '<a href="' + href + '"' + cls + '>' + item.label + '</a>';
        }).join('');

        mount.innerHTML =
            '<header class="nav">' +
            '<div class="nav-inner">' +
            '<a href="' + Site.pagePath('index.html') + '" class="nav-brand-wrap" style="text-decoration:none">' +
            '<img src="' + root + 'assets/images/mrj_logo.png' + '" alt="" width="36" height="36">' +
            '<div style="display:flex;flex-direction:column;line-height:1.1;margin-left:0.5rem">' +
            '<span class="nav-brand-ghost-red" aria-hidden="true">Renjie Mei</span>' +
            '<span class="nav-brand-ghost-cyan" aria-hidden="true">Renjie Mei</span>' +
            '<span class="nav-brand-name">Renjie Mei</span>' +
            '<span class="nav-brand-sub">Bioelectronics · BCI</span></div></a>' +
            '<button type="button" class="nav-toggle" aria-label="Open menu" aria-expanded="false">' +
            '<span></span><span></span><span></span></button>' +
            '<div class="nav-links" aria-label="Primary">' + navLinks + '</div>' +
            '<button class="nav-theme" id="themeToggle" type="button" aria-label="Toggle theme">' +
            '<svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z"/></svg>' +
            '<svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>' +
            '</button></div>' +
            '<div class="nav-overlay"></div>' +
            '</header>';
    })();

    /* ── Nav scroll hide/show ── */
    (function () {
        var nav = document.querySelector('.nav');
        if (!nav) return;
        var lastY = 0;
        var hidden = false;

        Site._navOnScroll = function (y) {
            if (y < 60) {
                nav.classList.remove('hidden');
                hidden = false;
                return;
            }
            if (y > lastY + 4 && !hidden) {
                nav.classList.add('hidden');
                hidden = true;
            } else if (y < lastY - 4 && hidden) {
                nav.classList.remove('hidden');
                hidden = false;
            }
            lastY = y;
        };
    })();

    /* ── Mobile menu ── */
    document.addEventListener('click', function (e) {
        var toggle = e.target.closest('.nav-toggle');
        if (toggle) {
            var open = !document.body.classList.contains('menu-open');
            document.body.classList.toggle('menu-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            return;
        }
        if (e.target.closest('.nav-links a')) {
            document.body.classList.remove('menu-open');
            var t = document.querySelector('.nav-toggle');
            if (t) t.setAttribute('aria-expanded', 'false');
        }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.body.classList.remove('menu-open');
            var t = document.querySelector('.nav-toggle');
            if (t) t.setAttribute('aria-expanded', 'false');
        }
    });

    /* ── Theme toggle ── */
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('#themeToggle');
        if (!btn) return;
        var cur = document.documentElement.getAttribute('data-theme') || 'light';
        var next = cur === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        document.documentElement.setAttribute('data-theme', next);
    });

    /* ── Lightbox ── */
    (function () {
        var lightbox = document.getElementById('lightbox');
        var lightboxImg = document.getElementById('lightbox-img');
        if (!lightbox || !lightboxImg) return;
        document.addEventListener('click', function (e) {
            var img = e.target.closest('[data-lightbox], .gallery-thumb img, .gallery-strip-thumb img, .blog-card-media img, .article-cover img, .exp-gallery img, .pub-thumb img');
            if (!img || img.tagName !== 'IMG') return;
            lightboxImg.src = img.currentSrc || img.src;
            lightboxImg.alt = img.alt || '';
            lightbox.classList.add('show');
        });
        lightbox.addEventListener('click', function (e) {
            if (e.target !== lightboxImg) lightbox.classList.remove('show');
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') lightbox.classList.remove('show');
        });
    })();

    /* ── Unified scroll (rAF throttled) ── */
    (function () {
        var ticking = false;
        var progress = document.querySelector('.reading-progress');
        var fill = progress && progress.querySelector('.progress-fill');
        var ball = progress && progress.querySelector('.progress-ball');
        var btt = document.querySelector('.back-to-top');

        document.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    var y = window.scrollY;
                    var docH = document.documentElement.scrollHeight - window.innerHeight;
                    var pct = docH > 0 ? (y / docH) : 0;

                    if (fill) fill.style.transform = 'scaleX(' + pct + ')';
                    if (ball) ball.style.left = (pct * 100) + '%';
                    if (btt) btt.classList.toggle('visible', y > 400);
                    if (Site._navOnScroll) Site._navOnScroll(y);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    })();

    /* ── Intersection Observer for entrance animations ── */
    (function () {
        if (!('IntersectionObserver' in window)) {
            var all = document.querySelectorAll('.anim');
            for (var i = 0; i < all.length; i++) all[i].classList.add('visible');
            return;
        }
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.anim').forEach(function (el) { observer.observe(el); });

        Site.observeAnim = function (root) {
            (root || document).querySelectorAll('.anim:not(.visible)').forEach(function (el) {
                observer.observe(el);
            });
        };
    })();

}); // end DOMContentLoaded
