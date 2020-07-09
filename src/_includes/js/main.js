function toggleNav() {
  var mainNav = document.getElementById('nav-menu');
  var navBtn = document.getElementById('nav-btn');
  mainNav.classList.toggle('active');
  navBtn.classList.toggle('open');
}
if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', (user) => {
    if (!user) {
      window.netlifyIdentity.on('login', () => {
        document.location.href = '/admin/';
      });
    }
  });
}
