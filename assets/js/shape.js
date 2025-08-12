document.addEventListener("DOMContentLoaded", () => {
  const shapeDropdown = document.querySelector("#shape-dropdown");
  const shapeDropBtn = document.querySelector(".tool-btn.shape");
  const shapeOptions = document.querySelectorAll(".shape-option");
  const selectedShapeIcon = document.querySelector(".selected-shape-icon");
  const fillCheckbox = document.getElementById("fill-shape");
  let currentShape = null;
  let isFill = false;
  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  const canvas = document.getElementById("whiteboard");
  const ctx = canvas.getContext("2d");
  function getXY(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }
  shapeDropBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = shapeDropdown.classList.contains("show");
    document.querySelectorAll(".dropdown").forEach((d) => d.classList.remove("show"));
    if (!isVisible) shapeDropdown.classList.add("show");
    const rect = shapeDropBtn.getBoundingClientRect();
    shapeDropdown.style.left = `${rect.left}px`;
    shapeDropdown.style.top = `${rect.top - shapeDropdown.offsetHeight - 10}px`;
  });
  document.addEventListener("click", (e) => {
    if (!shapeDropdown.contains(e.target) && !shapeDropBtn.contains(e.target)) {
      shapeDropdown.classList.remove("show");
    }
  });
  shapeOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      shapeOptions.forEach((b) => b.classList.remove("selected-shape"));
      btn.classList.add("selected-shape");
      const icon = btn.querySelector("i").cloneNode(true);
      selectedShapeIcon.innerHTML = "";
      selectedShapeIcon.appendChild(icon);
      currentShape = btn.dataset.shape;
      shapeDropdown.classList.remove("show");
    });
  });
  fillCheckbox?.addEventListener("change", () => {
    isFill = fillCheckbox.checked;
  });
  canvas.addEventListener("mousedown", (e) => {
    if (!currentShape) return; 
    const { x, y } = getXY(e);
    startX = x;
    startY = y;
    isDrawing = true;
  });
  canvas.addEventListener("mouseup", (e) => {
  if (!isDrawing || !currentShape) return;
  const { x, y } = getXY(e);
  const w = x - startX;
  const h = y - startY;
  const centerX = (startX + x) / 2;
  const centerY = (startY + y) / 2;
  const radius = Math.hypot(w, h) / 2;
  const selectedColorBtn = document.querySelector(".color-swatch.selected-color");
  const selectedColor = selectedColorBtn ? selectedColorBtn.dataset.color : "#000000";
  ctx.fillStyle = selectedColor;
  ctx.strokeStyle = selectedColor;
  ctx.beginPath();
  switch (currentShape) {
    case "rectangle":
      isFill ? ctx.fillRect(startX, startY, w, h) : ctx.strokeRect(startX, startY, w, h);
      break;
    case "circle":
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      isFill ? ctx.fill() : ctx.stroke();
      break;
    case "triangle":
      ctx.moveTo(startX + w / 2, startY);
      ctx.lineTo(startX, startY + h);
      ctx.lineTo(startX + w, startY + h);
      ctx.closePath();
      isFill ? ctx.fill() : ctx.stroke();
      break;
    case "diamond":
      ctx.moveTo(startX + w / 2, startY); 
      ctx.lineTo(startX + w, startY + h / 2); 
      ctx.lineTo(startX + w / 2, startY + h); 
      ctx.lineTo(startX, startY + h / 2); 
      ctx.closePath();
      isFill ? ctx.fill() : ctx.stroke();
      break;
  }
  ctx.closePath();
  isDrawing = false;
  if (typeof saveState === "function") saveState();
});
  canvas.addEventListener("mousemove", (e) => {
    if (isDrawing && currentShape) {
      e.preventDefault(); 
    }
  });
});