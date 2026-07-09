(function(){
  const script = document.currentScript;
  const base = script?.dataset?.base || './';
  const current = script?.dataset?.current || 'inicio';
  const version = script?.dataset?.version || 'v1.5.2';
  const apps = [
    {id:'inicio', icon:'⌂', name:'Inicio', desc:'Dashboard general', href: base + 'index.html', accent:'cyan'},
    {id:'pendientes', icon:'✓', name:'Pendientes diarios', desc:'Prioridad, esfuerzo y tareas recurrentes', href: base + 'apps/pendientes/', accent:'green'},
    {id:'arrowverse', icon:'⚡', name:'Arrowverso', desc:'Checklist cronológico', href: base + 'apps/arrowverse/', accent:'violet'},
    {id:'rutina', icon:'🌱', name:'Rutina atómica', desc:'Hábitos mínimos diarios', href: base + 'apps/rutina-atomica/', accent:'lime'},
    {id:'botiquin', icon:'🧰', name:'Botiquín', desc:'Inventario, compras y alertas', href: base + 'apps/botiquin/', accent:'amber'},
    {id:'respaldo', icon:'☁', name:'Respaldos', desc:'Respaldos externos y Drive', href: base + 'apps/respaldo/', accent:'blue'},
    {id:'sheets', icon:'▦', name:'Sync Sheets', desc:'Google Sheets experimental', href: base + 'apps/sheets-sync/', accent:'violet'}
  ];
  function create(){
    if(document.querySelector('.emma-shell-toggle')) return;
    const overlay = document.createElement('div');
    overlay.className = 'emma-shell-overlay';
    overlay.setAttribute('aria-hidden','true');
    const btn = document.createElement('button');
    btn.className = 'emma-shell-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label','Abrir menú de Emma OS');
    btn.setAttribute('aria-expanded','false');
    btn.innerHTML = '<span>☰</span><b>Emma OS</b>';
    const drawer = document.createElement('aside');
    drawer.className = 'emma-shell-drawer';
    drawer.setAttribute('aria-label','Menú de aplicaciones Emma OS');
    drawer.innerHTML = `
      <div class="emma-shell-head">
        <div class="emma-shell-logo">E</div>
        <div>
          <strong>Emma OS</strong>
          <small>Centro de control personal · ${version}</small>
        </div>
        <button class="emma-shell-close" type="button" aria-label="Cerrar menú">×</button>
      </div>
      <nav class="emma-shell-list" aria-label="Aplicaciones instaladas">
        ${apps.map(app => `
          <a class="emma-shell-item ${current===app.id?'active':''}" data-accent="${app.accent}" href="${app.href}">
            <span class="emma-shell-icon">${app.icon}</span>
            <span><b>${app.name}</b><small>${app.desc}</small></span>
          </a>`).join('')}
      </nav>
      <div class="emma-shell-foot">
        <span>${version}</span>
        <span>Datos locales por módulo</span>
      </div>`;
    document.body.appendChild(btn);
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
    function open(){document.body.classList.add('emma-shell-open');btn.setAttribute('aria-expanded','true');}
    function close(){document.body.classList.remove('emma-shell-open');btn.setAttribute('aria-expanded','false');}
    btn.addEventListener('click',open);
    overlay.addEventListener('click',close);
    drawer.querySelector('.emma-shell-close').addEventListener('click',close);
    document.addEventListener('keydown',e=>{if(e.key==='Escape') close();});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',create); else create();
})();
