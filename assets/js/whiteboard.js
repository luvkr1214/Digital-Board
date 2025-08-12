// public/whiteboard.js

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Example: Draw a circle
function drawCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "lightblue";
  ctx.fill();

  // Send to backend
  saveShapeToDB({
    type: "circle",
    props: { x, y, radius }
  });
}

// Save shape to MongoDB via API
function saveShapeToDB(shapeData) {
  fetch("http://localhost:3000/api/shapes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(shapeData)
  })
    .then(res => res.json())
    .then(data => {
      console.log("✅ Shape saved:", data);
    })
    .catch(err => {
      console.error("❌ Error saving shape:", err);
    });
}

// Optional: Draw when canvas clicked
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  drawCircle(x, y, 30);
});

// Store shapes globally
window.savedShapes = window.savedShapes || [];
window.savedShapes.push({
  type: "circle", // or line, rectangle, etc.
  props: { x, y, radius }, // your shape props
});

// Store shapes globally
window.savedShapes = window.savedShapes || [];
window.savedShapes.push({
  type: "circle", // or line, rectangle, etc.
  props: { x, y, radius }, // your shape props
});


// Load existing shapes on load
window.onload = function () {
  fetch("http://localhost:3000/api/shapes")
    .then(res => res.json())
    .then(shapes => {
      shapes.forEach(shape => {
        if (shape.type === "circle") {
          const { x, y, radius } = shape.props;
          drawCircle(x, y, radius);
        }
        // You can expand this for other shape types
      });
    });
};
