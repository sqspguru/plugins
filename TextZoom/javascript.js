document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.TextZoomerConfig || {};

  // Container selector
  let containerSelector = "html";
  if(cfg.scope === 'blog') {
    if(!document.querySelector('.blog-item-wrapper')) return;
    containerSelector = '.blog-basic-grid-item-wrapper .sqs-block-content';
  }

  // Cookie helpers
  function setCookie(name, value, days){
    const d = new Date();
    d.setTime(d.getTime() + days*24*60*60*1000);
    document.cookie = `${name}=${value};path=/;expires=${d.toUTCString()}`;
  }
  function getCookie(name){
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  // Load saved zoom
  let currentZoom = 100;
  if(cfg.useCookies){
    const saved = getCookie('fontZoom');
    if(saved) currentZoom = parseInt(saved);
  } else {
    const saved = localStorage.getItem('fontZoom');
    if(saved) currentZoom = parseInt(saved);
  }

  // Tooltip side
  const tooltipSideClass = (cfg.position === "left-center") ? "tooltip-right" : "tooltip-left";

  // Toolbar element
  const toolbar = document.createElement("div");
  toolbar.className = "fontzoom-controls " + (cfg.tooltips ? "tooltip-enabled" : "");

  // Position
  const posMap = {
    "left-center": "left:20px; top:50%; transform:translateY(-50%);",
    "right-center": "right:20px; top:50%; transform:translateY(-50%);",
    "bottom-right": "right:20px; bottom:20px;"
  };
  toolbar.style.cssText = posMap[cfg.position] || posMap["left-center"];

  // Toggle SVG (mobile)
  const toggleSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 23" width="36" height="23">
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2">
      <path stroke-linejoin="round" d="M26.58 21.32V1m-7.92 4.06V1H34.5v4.06"/>
      <path d="M22.62 21.32h7.92"/>
      <path stroke-linejoin="round" d="M6.78 18.61V5.06M1.5 7.77V5.06h10.56v2.71"/>
      <path d="M4.14 18.61h5.28"/>
    </g>
  </svg>
  `;

  // Toolbar HTML
  toolbar.innerHTML = `
    <button class="fz-toggle">${toggleSVG}</button>
    <div class="fontzoom-buttons">
      <button class="${tooltipSideClass}" data-tooltip="Zoom In" data-action="increase">A+</button>
      <button class="${tooltipSideClass}" data-tooltip="Reset" data-action="reset">A</button>
      <button class="${tooltipSideClass}" data-tooltip="Zoom Out" data-action="decrease">A-</button>
    </div>
  `;

  document.body.appendChild(toolbar);

  // Apply zoom
  function applyZoom(){
    document.querySelectorAll(containerSelector).forEach(el => {
      el.style.fontSize = currentZoom + "%";
    });
    if(cfg.useCookies){
      setCookie('fontZoom', currentZoom, cfg.cookieDays);
    } else {
      localStorage.setItem('fontZoom', currentZoom);
    }
  }

  applyZoom();

  // Button click events
  toolbar.addEventListener("click", (e)=>{
    const btn = e.target.closest("button");
    if(!btn) return;

    // Mobile toggle
    if(btn.classList.contains("fz-toggle") && window.innerWidth <= 767){
      toolbar.classList.toggle("expanded");
      return;
    }

    const action = btn.dataset.action;
    if(action === "increase" && currentZoom < cfg.maxZoom) currentZoom += cfg.step;
    if(action === "decrease" && currentZoom > cfg.minZoom) currentZoom -= cfg.step;
    if(action === "reset") currentZoom = 100;

    applyZoom();
  });
});
