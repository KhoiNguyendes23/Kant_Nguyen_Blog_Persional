const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add('visible');
  });
});
document.querySelectorAll('.fade-up').forEach(el=>observer.observe(el));
