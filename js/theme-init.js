(function () {
  const saved = localStorage.getItem('theme');
  const theme = saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);
})();
