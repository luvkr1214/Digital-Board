const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');

const penslider = document.getElementById("pen-width");
const colorSwatches = document.querySelectorAll(".color-swatch");
const penButton = document.getElementById("Pen");
const eraserBtn = document.getElementById("Eraser");
const eraseAllBtn = document.getElementById("EraseAll");
const highlighterBtn = document.getElementById("Highlighter");
const pointerBtn = document.getElementById("Pointer");
const undoBtn = document.getElementById("undo");
const redoBtn = document.getElementById("redo"); // NEW

let isDrawing = false;
let penWidth = penslider.value;
let selectedColor = '#000000';
let selectedTool = 'pen';

let undoStack = [];
let redoStack = [];

window.addEventListener('load', () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = penWidth;
  ctx.strokeStyle = selectedColor;
  saveState(); // Save blank canvas state
});

const getXY = (e) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
};

// ================= Drawing Events =================
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  const { x, y } = getXY(e);

  if (selectedTool === 'pointer') {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    setTimeout(() => {
      ctx.clearRect(x - 6, y - 6, 12, 12);
    }, 500);
    ctx.restore();
    isDrawing = false;
    return;
  }

  ctx.beginPath();
  ctx.moveTo(x, y);
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing || selectedTool === 'pointer') return;
  const { x, y } = getXY(e);
  ctx.lineTo(x, y);
  ctx.stroke();
});

canvas.addEventListener('mouseup', () => {
  if (selectedTool !== 'pointer') {
    isDrawing = false;
    ctx.closePath();
    saveState(); // Save canvas state after stroke
  }
});

canvas.addEventListener('mouseleave', () => {
  if (selectedTool !== 'pointer') {
    isDrawing = false;
    ctx.closePath();
  }
});

// ================= Pen Thickness =================
penslider.addEventListener("input", () => {
  penWidth = penslider.value;
  ctx.lineWidth = penWidth;
  const display = document.getElementById("pen-width-value");
  if (display) display.textContent = penWidth;
});

// ================= Color Swatch =================
colorSwatches.forEach((swatch) => {
  swatch.addEventListener("click", () => {
    if (selectedTool !== 'pen') return;
    colorSwatches.forEach((btn) => btn.classList.remove("selected-color"));
    swatch.classList.add("selected-color");
    selectedColor = swatch.dataset.color;
    ctx.strokeStyle = selectedColor;
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  });
});

// ================= Tools =================

// Pen Tool
penButton.addEventListener("click", () => {
  selectedTool = 'pen';
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.strokeStyle = selectedColor;
});

// Eraser Tool
eraserBtn.addEventListener("click", () => {
  selectedTool = 'eraser';
  ctx.globalCompositeOperation = 'destination-out';
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.globalAlpha = 1;
});

// Highlighter Tool
highlighterBtn.addEventListener("click", () => {
  selectedTool = 'highlighter';
  ctx.globalCompositeOperation = 'destination-over';
  ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
  ctx.globalAlpha = 1;
});

// Pointer Tool
pointerBtn.addEventListener("click", () => {
  selectedTool = 'pointer';
});

// ================= Erase All =================
eraseAllBtn.addEventListener("click", () => {
  Swal.fire({
    title: 'Are you sure?',
    text: "This will erase everything on the board.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, erase it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      Swal.fire('Cleared!', 'The board has been erased.', 'success');
      saveState();
    }
  });
});

// ================= Undo =================
undoBtn.addEventListener('click', () => {
  if (undoStack.length <= 1) {
    Swal.fire("Nothing to undo!", "", "info");
    return;
  }

  const current = undoStack.pop();
  redoStack.push(current);

  const lastState = undoStack[undoStack.length - 1];
  const img = new Image();
  img.src = lastState;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
});

// ================= Redo =================
redoBtn.addEventListener('click', () => {
  if (redoStack.length === 0) {
    Swal.fire("Nothing to redo!", "", "info");
    return;
  }

  const redoState = redoStack.pop();
  undoStack.push(redoState);

  const img = new Image();
  img.src = redoState;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
});

// ================= Save Canvas State =================
function saveState() {
  if (undoStack.length >= 20) undoStack.shift();
  undoStack.push(canvas.toDataURL());
  redoStack = []; // Clear redo history on new draw
}

