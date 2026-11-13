/* Nexon Veloza portfolio. Vanilla JS, no dependencies. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  /* ---------- theme ---------- */
  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#f5f7fa' : '#0b0f14');
  }
  document.getElementById('theme').addEventListener('click', function () {
    setTheme(currentTheme() === 'light' ? 'dark' : 'light');
  });

  /* ---------- reveal on scroll ---------- */
  var targets = document.querySelectorAll('.block, .card, .log li');
  Array.prototype.forEach.call(targets, function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('in'); });
  }

  /* ---------- terminal ---------- */
  var term = document.getElementById('term');
  var out = document.getElementById('term-out');
  var form = document.getElementById('term-form');
  var input = document.getElementById('term-in');
  var opener = document.getElementById('open-term');
  var lastFocus = null;
  var history = [];
  var hIdx = 0;

  var PROJECTS = {
    'sidic-web': { text: 'ERP rebuild (VB.NET + Access -> Django + PostgreSQL). Private repo, walkthrough on request.', url: null },
    'go-next-market': { text: 'React 18 + Vite + Tailwind corporate site, live on Vercel.', url: 'https://go-next-market.vercel.app' },
    'reporte-technical-superstore': { text: 'Browser-only KoboToolbox -> Excel QA report tool. Private repo, demo on request.', url: null },
    'php-image-gallery': { text: 'PHP + MySQL app: registration, sessions, validated uploads.', url: 'https://github.com/Nedavefo/PHP_Project' },
    'discord-membership-bot': { text: 'Python bot logging joins and leaves to CSV.', url: 'https://github.com/Nedavefo/Discord_Bot' },
    'sales-data-generator': { text: 'Java generator of reproducible test data for a reporting system.', url: 'https://github.com/Nedavefo/CFP_Proyecto_Java_Poli' }
  };

  function line(text, cls) {
    var d = document.createElement('div');
    if (cls) d.className = cls;
    d.textContent = text;
    out.appendChild(d);
  }
  function lines(arr, cls) { arr.forEach(function (t) { line(t, cls); }); }

  var COMMANDS = {
    help: function () {
      lines([
        'commands:',
        '  whoami            who I am',
        '  projects          list my projects',
        '  open <project>    open a project (try: open go-next-market)',
        '  stack             what I work with',
        '  log               experience and education',
        '  contact           how to reach me',
        '  theme [dark|light]',
        '  clear             clear the screen',
        '  exit              close the terminal'
      ], 'a');
    },
    whoami: function () {
      lines([
        'Nexon Veloza, junior software developer.',
        'Toronto, ON. B.S. Software Engineering (Dec 2026), Georgian College diploma.',
        'Django, React, Python, SQL. Open to junior developer and automation roles.'
      ]);
    },
    projects: function () {
      Object.keys(PROJECTS).forEach(function (k) { line('  ' + k + '  ' + (PROJECTS[k].url ? '[open]' : '[private]'), 'm'); });
      line('use: open <project>', 'u');
    },
    stack: function () {
      lines([
        'languages : Python, JavaScript, Java, PHP, SQL, VB.NET',
        'web       : Django, React, Node.js, Vite, Tailwind CSS, HTML, CSS',
        'data      : PostgreSQL, MySQL, SQLite',
        'tools     : Git, GitHub, Jira, Claude Code',
        'learning  : TypeScript, automated testing, CI'
      ]);
    },
    log: function () {
      lines([
        'Nov 2026 -> now   Sidic Web, ERP rebuild (Django, PostgreSQL)',
        'Dec 2026          B.S. Software Engineering, Politecnico Grancolombiano (expected)',
        'Jun 2025 -> now   IT and web support, Go Next Market (remote)',
        'Sep -> Nov 2025   Fullstack developer intern, VibesMeet (remote)',
        'Sep 2023 -> Apr 2025  Diploma, Computer Programming, Georgian College'
      ]);
    },
    contact: function () {
      lines(['mail     nedavefo@gmail.com', 'github   github.com/Nedavefo', 'linkedin linkedin.com/in/nexonveloza'], 'a');
    },
    theme: function (args) {
      var t = (args[0] || '').toLowerCase();
      if (t !== 'dark' && t !== 'light') { t = currentTheme() === 'light' ? 'dark' : 'light'; }
      setTheme(t);
      line('theme: ' + t, 'u');
    },
    open: function (args) {
      var name = (args[0] || '').toLowerCase();
      if (!name) { line('usage: open <project>', 'e'); return; }
      var p = PROJECTS[name];
      if (!p) { line('open: no such project: ' + name + ' (try: projects)', 'e'); return; }
      line(p.text);
      if (p.url) { line('opening ' + p.url, 'u'); window.open(p.url, '_blank', 'noopener'); }
      else { line('this one is private. Ask me for a walkthrough.', 'u'); }
    },
    clear: function () { out.textContent = ''; },
    exit: function () { closeTerm(); },
    sudo: function (args) {
      if ((args[0] || '') === 'hire-me') {
        lines(['[sudo] permission granted.', 'send the offer to nedavefo@gmail.com'], 'a');
      } else { line('nexon is not in the sudoers file. This incident will be reported.', 'e'); }
    },
    ls: function () { lines(['about.md  projects/  stack.json  log  contact.sh']); },
    cat: function (args) {
      if ((args[0] || '') === 'about.md') { COMMANDS.whoami(); } else { line('cat: ' + (args[0] || '') + ': try about.md', 'e'); }
    },
    git: function (args) { if ((args[0] || '') === 'log') { COMMANDS.log(); } else { line('git: only "git log" is supported here', 'e'); } }
  };

  function run(raw) {
    var cmd = raw.trim();
    var echo = document.createElement('div');
    var ps = document.createElement('span');
    ps.className = 'a';
    ps.textContent = '$ ';
    echo.appendChild(ps);
    echo.appendChild(document.createTextNode(cmd));
    out.appendChild(echo);
    if (!cmd) return;
    history.push(cmd); hIdx = history.length;
    var parts = cmd.split(/\s+/);
    var name = parts.shift().toLowerCase();
    if (Object.prototype.hasOwnProperty.call(COMMANDS, name)) { COMMANDS[name](parts); }
    else { line(name + ': command not found. Type help.', 'e'); }
    out.scrollTop = out.scrollHeight;
  }

  function openTerm() {
    lastFocus = document.activeElement;
    term.hidden = false;
    if (!out.childNodes.length) {
      line('Nexon Veloza portfolio shell. Type help.', 'a');
    }
    input.focus();
    setTimeout(function () { input.focus(); }, 60);
  }
  function closeTerm() {
    term.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  opener.addEventListener('click', openTerm);
  document.getElementById('close-term').addEventListener('click', closeTerm);
  term.addEventListener('click', function (e) { if (e.target === term) closeTerm(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); run(input.value); input.value = ''; });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp') { if (hIdx > 0) { hIdx--; input.value = history[hIdx]; } e.preventDefault(); }
    if (e.key === 'ArrowDown') { if (hIdx < history.length - 1) { hIdx++; input.value = history[hIdx]; } else { hIdx = history.length; input.value = ''; } e.preventDefault(); }
  });
  document.addEventListener('keydown', function (e) {
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (e.key === 'Escape' && !term.hidden) { closeTerm(); return; }
    if (e.key === '`' && tag !== 'INPUT' && tag !== 'TEXTAREA') { e.preventDefault(); term.hidden ? openTerm() : closeTerm(); }
  });
})();
