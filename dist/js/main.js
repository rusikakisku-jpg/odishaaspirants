document.addEventListener('DOMContentLoaded', function() {
  // Mobile Nav Toggle & Drawer Management
  const toggleBtn = document.getElementById('mobileMenuToggle') || document.querySelector('.nav-toggle-btn');
  const navMenu = document.getElementById('primaryNavMenu') || document.querySelector('.nav-menu');
  const mainNav = document.getElementById('mainNavigation') || document.querySelector('.main-nav');
  const mobileSearchBtn = document.getElementById('mobileSearchBtn');

  let openMenu = () => {};
  let closeMenu = () => {};

  if (toggleBtn && navMenu) {
    const toggleIcon = toggleBtn.querySelector('.toggle-icon');
    const toggleText = toggleBtn.querySelector('.toggle-text');

    openMenu = function() {
      navMenu.classList.remove('search-only');
      navMenu.classList.add('active');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      if (toggleIcon) toggleIcon.textContent = '✕';
      if (toggleText) toggleText.textContent = 'CLOSE';
      if (mobileSearchBtn) {
        mobileSearchBtn.classList.remove('active');
        mobileSearchBtn.setAttribute('aria-expanded', 'false');
      }
      if (typeof window.__syncHeaderSpacer === 'function') window.__syncHeaderSpacer();
    };

    closeMenu = function() {
      navMenu.classList.remove('active', 'search-only');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      if (toggleIcon) toggleIcon.textContent = '☰';
      if (toggleText) toggleText.textContent = 'MENU';
      if (mobileSearchBtn) {
        mobileSearchBtn.classList.remove('active');
        mobileSearchBtn.setAttribute('aria-expanded', 'false');
      }
      const searchDropdown = document.getElementById('search-results-dropdown');
      if (searchDropdown) {
        searchDropdown.style.display = 'none';
      }
      if (typeof window.__syncHeaderSpacer === 'function') window.__syncHeaderSpacer();
    };

    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (navMenu.classList.contains('active') && !navMenu.classList.contains('search-only')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when tapping outside navigation
    document.addEventListener('click', function(e) {
      if (navMenu.classList.contains('active')) {
        if (mainNav && !mainNav.contains(e.target)) {
          closeMenu();
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    // Close drawer immediately when a content link is clicked without blocking navigation
    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        if (link.classList.contains('nav-dropdown-toggle')) return;
        closeMenu();
      });
    });

    // Auto-close if resized to desktop (> 900px)
    window.addEventListener('resize', function() {
      if (window.innerWidth > 900 && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // Instant Menu Navigation Hover/Touch Prefetching for Lightning-Fast Page Transitions
  const prefetchedNavUrls = new Set();
  function prefetchNavUrl(url) {
    if (!url || url.startsWith('javascript') || prefetchedNavUrls.has(url)) return;
    prefetchedNavUrls.add(url);
    const prefetchLink = document.createElement('link');
    prefetchLink.rel = 'prefetch';
    prefetchLink.href = url;
    prefetchLink.as = 'document';
    document.head.appendChild(prefetchLink);
  }

  document.querySelectorAll('.nav-menu a, .site-header a').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href && href.startsWith('/')) {
      link.addEventListener('mouseenter', function() { prefetchNavUrl(href); }, { passive: true });
      link.addEventListener('touchstart', function() { prefetchNavUrl(href); }, { passive: true });
    }
  });

  // More Navigation Dropdown Handler (Click to Toggle on Desktop & Mobile)
  const moreToggle = document.getElementById('moreDropdownToggle');
  const moreItem = document.getElementById('moreDropdownItem');

  if (moreToggle && moreItem) {
    moreToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = moreItem.classList.toggle('open');
      moreToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close dropdown on tapping anywhere outside
    document.addEventListener('click', function(e) {
      if (!moreItem.contains(e.target)) {
        moreItem.classList.remove('open');
        moreToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && moreItem.classList.contains('open')) {
        moreItem.classList.remove('open');
        moreToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Mobile Quick Search Button Handler (Opens compact Search-only bar without opening side menu)
  if (mobileSearchBtn && navMenu) {
    mobileSearchBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isSearchOpen = navMenu.classList.contains('active') && navMenu.classList.contains('search-only');
      if (isSearchOpen) {
        closeMenu();
        return;
      }
      // Reset menu toggle button state so side menu bar stays closed
      if (toggleBtn) {
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        const toggleIcon = toggleBtn.querySelector('.toggle-icon');
        const toggleText = toggleBtn.querySelector('.toggle-text');
        if (toggleIcon) toggleIcon.textContent = '☰';
        if (toggleText) toggleText.textContent = 'MENU';
      }
      navMenu.classList.add('active', 'search-only');
      mobileSearchBtn.classList.add('active');
      mobileSearchBtn.setAttribute('aria-expanded', 'true');
      if (typeof window.__syncHeaderSpacer === 'function') window.__syncHeaderSpacer();
      const searchBox = document.getElementById('live-search-input');
      if (searchBox) {
        setTimeout(() => {
          searchBox.focus();
          searchBox.select();
        }, 120);
      }
    });
  }

  // Live Instant Search Dropdown
  const searchInput = document.querySelector('#live-search-input');
  const searchResultsDropdown = document.querySelector('#search-results-dropdown');

  let debounceTimer = null;

  if (searchInput && searchResultsDropdown) {
    searchInput.addEventListener('input', function() {
      const q = this.value.trim();
      clearTimeout(debounceTimer);

      if (q.length < 2) {
        searchResultsDropdown.style.display = 'none';
        searchResultsDropdown.innerHTML = '';
        return;
      }

      debounceTimer = setTimeout(async function() {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
          const data = await res.json();

          if (data.success && data.results && data.results.length > 0) {
            let html = '<div class="live-search-card" style="background:#fff; border:2px solid #0b4f6c; box-shadow:0 4px 12px rgba(0,0,0,0.15); border-radius:4px; max-height:350px; overflow-y:auto; text-align:left;">';
            html += '<div style="background:#0b4f6c; color:#fff; padding:6px 12px; font-weight:bold; font-size:13px;">Quick Search Results (' + data.results.length + ')</div>';
            
            data.results.forEach(item => {
              html += `
                <a href="/post/${item.slug}" style="display:block; padding:8px 12px; border-bottom:1px solid #eee; text-decoration:none;">
                  <div style="font-weight:bold; color:#0c1cae; font-size:13.5px;">${item.title}</div>
                  <div style="font-size:11.5px; color:#666; margin-top:2px;">
                    <span style="background:#eee; padding:1px 5px; border-radius:2px;">${item.category}</span>
                    ${item.department ? ` • ${item.department}` : ''}
                    ${item.last_date ? ` • <span style="color:#c62828;">Last Date: ${item.last_date}</span>` : ''}
                  </div>
                </a>
              `;
            });
            html += `<a href="/search?q=${encodeURIComponent(q)}" style="display:block; text-align:center; padding:8px; background:#f4f4f4; color:#0b4f6c; font-weight:bold; font-size:12.5px;">View All Results →</a>`;
            html += '</div>';

            searchResultsDropdown.innerHTML = html;
            searchResultsDropdown.style.display = 'block';
          } else {
            searchResultsDropdown.innerHTML = `
              <div style="background:#fff; border:1px solid #ccc; padding:10px; text-align:center; color:#666; font-size:13px;">
                No notifications found matching "${q}"
              </div>
            `;
            searchResultsDropdown.style.display = 'block';
          }
        } catch (e) {
          console.error('Search error:', e);
        }
      }, 250);
    });

    // Close dropdown on outside click
    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !searchResultsDropdown.contains(e.target)) {
        searchResultsDropdown.style.display = 'none';
      }
    });
  }

  // Pause marquee on mouseover
  const marquees = document.querySelectorAll('marquee');
  marquees.forEach(m => {
    m.addEventListener('mouseover', () => m.stop());
    m.addEventListener('mouseout', () => m.start());
  });

  // Back to Top Button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 280) {
        backToTopBtn.style.display = 'flex';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });

    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Seamless Navigation (Instant Content Swap, Keeps Header 100% Fixed & Fluctuation-Free)
  function initSeamlessNav() {
    document.addEventListener('click', function(e) {
      const a = e.target.closest('a');
      if (!a || !a.href) return;
      if (a.target === '_blank' || a.hasAttribute('download') || e.ctrlKey || e.metaKey || e.shiftKey) return;
      
      let url;
      try {
        url = new URL(a.href, window.location.origin);
      } catch (err) {
        return;
      }
      
      // Only handle internal links within the site
      if (url.origin !== window.location.origin) return;

      // Ignore admin, author portal, files/downloads, and interactive tool pages
      if (
        url.pathname.startsWith('/admin') ||
        url.pathname.startsWith('/author-portal') ||
        url.pathname.startsWith('/tools/') ||
        url.pathname.startsWith('/api') ||
        url.pathname.startsWith('/uploads') ||
        url.pathname.startsWith('/manifest.json') ||
        url.pathname.startsWith('/feed') ||
        url.pathname.startsWith('/sitemap')
      ) {
        return;
      }

      // If clicking same page hash anchor
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        if (url.hash) {
          const target = document.querySelector(url.hash);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      e.preventDefault();
      loadPageContent(url.href, true);
    });

    window.addEventListener('popstate', function() {
      loadPageContent(window.location.href, false);
    });
  }

  async function loadPageContent(href, pushHistory) {
    try {
      const res = await fetch(href, { credentials: 'same-origin' });
      if (!res.ok) {
        window.location.href = href;
        return;
      }
      const htmlText = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');

      // Update page title
      if (doc.title) {
        document.title = doc.title;
      }

      // Update canonical link if present
      const newCanonical = doc.querySelector('link[rel="canonical"]');
      const curCanonical = document.querySelector('link[rel="canonical"]');
      if (newCanonical && curCanonical) {
        curCanonical.href = newCanonical.href;
      }

      // Swap pageContentWrapper
      const newWrapper = doc.getElementById('pageContentWrapper');
      const curWrapper = document.getElementById('pageContentWrapper');
      if (newWrapper && curWrapper) {
        curWrapper.innerHTML = newWrapper.innerHTML;
      } else {
        window.location.href = href;
        return;
      }

      // Update active nav menu links
      const curPath = new URL(href, window.location.origin).pathname;
      document.querySelectorAll('#primaryNavMenu a').forEach(function(link) {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        if (linkPath === '/' && curPath === '/') {
          link.classList.add('active');
        } else if (linkPath !== '/' && curPath.startsWith(linkPath)) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Close mobile menu if open
      if (typeof closeMenu === 'function') {
        closeMenu();
      }

      // Hide search results dropdown if open
      if (searchResultsDropdown) {
        searchResultsDropdown.style.display = 'none';
      }

      // Re-attach marquee listeners on newly loaded page
      document.querySelectorAll('marquee').forEach(m => {
        m.addEventListener('mouseover', () => m.stop());
        m.addEventListener('mouseout', () => m.start());
      });

      if (pushHistory) {
        history.pushState({}, '', href);
      }

      // Notify Google Analytics (GA4) on seamless SPA navigation page views
      if (typeof window.gtag === 'function' && window.__GA_MEASUREMENT_ID) {
        try {
          const parsedNav = new URL(href, window.location.origin);
          window.gtag('config', window.__GA_MEASUREMENT_ID, {
            page_path: parsedNav.pathname + parsedNav.search,
            page_title: document.title
          });
        } catch (gaErr) {}
      }

      window.scrollTo({ top: 0 });
    } catch (err) {
      window.location.href = href;
    }
  }

  initSeamlessNav();

  // FAQ Single-Open Accordion: Keep all FAQs collapsed initially; expanding one collapses any other open FAQ
  document.addEventListener('toggle', function(e) {
    const target = e.target;
    if (!target || target.tagName !== 'DETAILS' || !target.open) return;
    const scope = target.closest('.homepage-faq-section, .static-page-content, .gez-article-content') || target.parentElement;
    if (!scope) return;
    scope.querySelectorAll('details[open]').forEach(function(other) {
      if (other !== target) {
        other.removeAttribute('open');
      }
    });
  }, true);
});

// Global Toast Notification Helper
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message || 'Link copied to clipboard!';
  toast.style.display = 'block';
  toast.style.opacity = '1';
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 300);
  }, 2500);
}

// Global Copy / Share Page URL
window.copyPageUrl = function() {
  const url = window.location.href;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('✅ Link copied to clipboard!');
    }).catch(() => {
      fallbackCopy(url);
    });
  } else {
    fallbackCopy(url);
  }
};

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand('copy');
    showToast('✅ Link copied to clipboard!');
  } catch (err) {
    showToast('ℹ️ URL: ' + text);
  }
  document.body.removeChild(textarea);
}
