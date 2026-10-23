/* Anand Paswan UI/UX Portfolio — vanilla JavaScript interactions */
(function () {
  'use strict';
  document.documentElement.classList.add('js-ready');

  const projects = {
    staff: {
      title: 'StaffFlow — Staff Report Management', tag: '01 / DASHBOARD & WORKFLOW UI', image: 'assets/staffflow.webp',
      alt: 'StaffFlow dashboard interface concept',
      description: 'A concept direction for an employee workspace, making routine reports and leave requests easy to find and understand.',
      original: 'My résumé describes an ASP.NET-based internal Staff Report Management System for work report submission, project-wise tracking, profile and password workflows, leave management and group chat.',
      concept: 'This independent visual exploration proposes a simple overview dashboard, clear status labels, a prominent report-submission action, and focused navigation for the most-used staff tools.'
    },
    task: {
      title: 'Taskline — Task Management System', tag: '02 / PRODUCTIVITY & WORKFLOW UI', image: 'assets/taskline.webp',
      alt: 'Taskline task board design concept',
      description: 'A task-management interface exploration built around visual progress, understandable labels, and quick actions.',
      original: 'My résumé includes a task-management web application using ASP.NET/.NET and MySQL, created to organize, monitor and track tasks in one system.',
      concept: 'I reimagined the task workflow as a three-stage visual board with task ownership, clear priorities, progress information and readable cards. The shown board is a portfolio concept, not a claim of shipped UI.'
    },
    care: {
      title: 'CarePath — Hospital Navigation', tag: '03 / MOBILE & WAYFINDING UI', image: 'assets/carepath.webp',
      alt: 'CarePath phone-based hospital route concept',
      description: 'A mobile-friendly wayfinding concept to help visitors understand where they are and how to get to a room.',
      original: 'My résumé describes a hospital-layout navigation solution using visual rooms, paths and coordinate-based directions, with PHP, JavaScript and MySQL-backed feedback.',
      concept: 'The concept prioritizes a clear destination, an easy-to-follow highlighted route, visible location context and one primary “Start Navigation” action for lower cognitive effort.'
    },
    store: {
      title: 'Everyday Shop — E-commerce Experience', tag: '04 / E-COMMERCE & WEB UI', image: 'assets/everyday-shop.webp',
      alt: 'Everyday Shop website concept with product cards and hero section',
      description: 'An approachable online-store design focused on warm imagery, simple navigation and straightforward product discovery.',
      original: 'My résumé includes a responsive WordPress e-commerce website with product and category displays, shopping pages and content/product management workflows.',
      concept: 'This storefront concept gives the hero one clear message, groups items by category and gives products generous visual space. Sample products and merchandising are illustrative, not real store inventory.'
    },
    log: {
      title: 'E-Log Book — Digital Record Management', tag: '05 / DATA & DASHBOARD UI', image: 'assets/elogbook.webp',
      alt: 'E-Log Book management dashboard concept',
      description: 'A system interface concept that makes record keeping feel more organized and less repetitive.',
      original: 'My résumé lists an ASP.NET / SQL Server E-Log Book project focused on structured log entries, central storage and accessible digital record management.',
      concept: 'The redesign direction brings recent records, categories, status chips and search together in a calm dashboard. Displayed entries and numbers are sample data for visual illustration.'
    }
  };

  const q = (selector, scope=document) => scope.querySelector(selector);
  const qa = (selector, scope=document) => Array.from(scope.querySelectorAll(selector));
  const header = q('#siteHeader');
  const progress = q('#scrollProgress');
  const year = q('#year');
  const menuToggle = q('#menuToggle');
  const menu = q('#mobileMenu');
  const modal = q('#projectModal');
  const modalPanel = q('.modal-panel', modal);
  const closeButton = q('#modalClose');
  let lastFocus = null;
  if (year) year.textContent = String(new Date().getFullYear());

  function updateScroll() {
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    if(progress) progress.style.width = (scrollRange > 0 ? Math.min(100,Math.max(0,window.scrollY / scrollRange * 100)) : 0) + '%';
    if(header) header.classList.toggle('scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll',updateScroll,{passive:true});
  updateScroll();

  function setMenu(open) {
    menuToggle.classList.toggle('open',open);
    menuToggle.setAttribute('aria-expanded',String(open));
    menuToggle.setAttribute('aria-label',open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
  }
  menuToggle.addEventListener('click',()=>setMenu(menu.hidden));
  qa('a',menu).forEach(link=>link.addEventListener('click',()=>setMenu(false)));
  window.addEventListener('resize',()=>{if(window.innerWidth > 600 && !menu.hidden) setMenu(false);});

  // Scroll reveals; elements remain visible in browsers without IntersectionObserver.
  const revealItems = qa('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
      });
    },{threshold:.08,rootMargin:'0px 0px -35px 0px'});
    revealItems.forEach(item=>revealObserver.observe(item));
  } else {
    revealItems.forEach(item=>item.classList.add('is-visible'));
  }

  const sections = qa('section[id]');
  if('IntersectionObserver' in window) {
    const currentObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry=>{
        if(!entry.isIntersecting) return;
        qa('.desktop-nav .nav-link').forEach(link => link.classList.toggle('is-current',link.getAttribute('href')==='#'+entry.target.id));
      });
    },{rootMargin:'-15% 0px -72% 0px',threshold:0});
    sections.forEach(section=>currentObserver.observe(section));
  }

  qa('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      qa('.filter-btn').forEach(item => {
        const isActive = item === button;
        item.classList.toggle('active',isActive);
        item.setAttribute('aria-pressed',String(isActive));
      });
      qa('.project-card').forEach(card => {
        const show = filter === 'all' || card.dataset.category.split(' ').includes(filter);
        card.hidden = !show;
      });
    });
  });

  function openProject(key) {
    const data=projects[key];
    if(!data)return;
    lastFocus = document.activeElement;
    q('#modalTag').textContent=data.tag;
    q('#modalTitle').textContent=data.title;
    q('#modalDescription').textContent=data.description;
    q('#modalOriginal').textContent=data.original;
    q('#modalConcept').textContent=data.concept;
    q('#modalImage').src=data.image;
    q('#modalImage').alt=data.alt;
    modal.hidden=false;
    document.body.classList.add('modal-open');
    modalPanel.scrollTop=0;
    closeButton.focus();
  }
  function closeProject() {
    modal.hidden=true;
    document.body.classList.remove('modal-open');
    if(lastFocus && typeof lastFocus.focus==='function') lastFocus.focus();
  }
  qa('[data-project]').forEach(button=>button.addEventListener('click',()=>openProject(button.dataset.project)));
  closeButton.addEventListener('click',closeProject);
  q('#modalBack').addEventListener('click',closeProject);
  modal.addEventListener('click',event=>{if(event.target===modal)closeProject();});
  document.addEventListener('keydown',event=>{
    if(!modal.hidden){
      if(event.key==='Escape'){event.preventDefault();closeProject();return;}
      if(event.key==='Tab'){
        const focusable=qa('button,a[href],input,select,[tabindex]:not([tabindex="-1"])',modal).filter(el=>!el.disabled);
        if(focusable.length){const first=focusable[0],last=focusable[focusable.length-1];
          if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
          else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}}
      }
    }else if(event.key==='Escape' && !menu.hidden){setMenu(false);}
  });
})();
