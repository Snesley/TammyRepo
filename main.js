(function () {
  // Portfolio filters
  var filters = document.querySelectorAll('.portfolio-filter');
  var cards = document.querySelectorAll('.project-grid article');
  var count = document.querySelector('.section-title sup');

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var label = btn.textContent.trim();
      var shown = 0;
      filters.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      cards.forEach(function (card) {
        var type = card.querySelector('.project-type').textContent.trim();
        var match = label === 'All work' || type === label;
        card.hidden = !match;
        if (match) shown++;
      });
      if (count) count.textContent = shown;
    });
  });

  // Simple lightbox for project images
  var box = document.getElementById('lightbox');
  var img = document.getElementById('lightbox-img');
  var cap = document.getElementById('lightbox-cap');
  var closeBtn = document.getElementById('lightbox-close');
  var lastFocus = null;

  function open(card) {
    var src = card.querySelector('img');
    if (!src) return;
    lastFocus = document.activeElement;
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    cap.textContent = card.querySelector('.project-title').textContent;
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    box.hidden = true;
    img.removeAttribute('src');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  cards.forEach(function (card) {
    card.querySelector('.project-button').addEventListener('click', function () { open(card); });
  });
  closeBtn.addEventListener('click', close);
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) close(); });
})();
