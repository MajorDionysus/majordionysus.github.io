/* Stable, non-positional image reveals for the editorial academic theme. */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    document.documentElement.classList.add('motion-ready');

    function prepareImage(img) {
      if (!img || img.dataset.elegantMedia) return;
      img.dataset.elegantMedia = 'true';

      function reveal() { img.classList.add('media-loaded'); }
      function showFallback() { img.classList.add('media-loaded', 'media-failed'); }

      if (img.complete && img.naturalWidth > 0) {
        reveal();
      } else {
        img.addEventListener('load', reveal, { once: true });
        img.addEventListener('error', showFallback, { once: true });
      }
    }

    function scanImages(root) {
      if (root.nodeType === 1 && root.matches && root.matches('main img')) prepareImage(root);
      if (root.querySelectorAll) root.querySelectorAll('main img').forEach(prepareImage);
    }

    scanImages(document);
    new MutationObserver(function (records) {
      records.forEach(function (record) {
        record.addedNodes.forEach(scanImages);
      });
    }).observe(document.body, { childList: true, subtree: true });
  });
})();
