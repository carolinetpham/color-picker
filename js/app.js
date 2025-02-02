const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const colorDisplay = document.getElementById("color-display");
const colorHex = document.getElementById("hex-code");
const saturationSlider = document.getElementById("saturation-slider");

let isDragging = false; // Track dragging state
let saturation = 100; // Default saturation value (100%)

// Function to draw the color wheel with adjusted saturation
function drawColorWheel() {
  const gradient = ctx.createConicGradient(0, 150, 150);

  // Adjust color stops for the current saturation level
  for (let i = 0; i <= 360; i += 10) {
    const hue = i;
    const sat = saturation; // Adjust saturation
    const lightness = (100 - saturation) / 2; // Mix lightness for desaturation
    gradient.addColorStop(i / 360, `hsl(${hue}, ${sat}%, ${50 - lightness}%)`);
  }

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(150, 150, 150, 0, 2 * Math.PI); // Full circle
  ctx.closePath();
  ctx.fill();
}

// Convert RGB to HEX
function rgbToHex(r, g, b) {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}

// Function to pick and display color from the canvas
function pickColor(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Ensure coordinates are within the canvas
  if (x >= 0 && y >= 0 && x < canvas.width && y < canvas.height) {
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hexColor = rgbToHex(pixel[0], pixel[1], pixel[2]);

    colorDisplay.style.backgroundColor = hexColor;
    colorHex.innerText = `Color: ${hexColor}`;
  }
}

// Event listeners for dragging
canvas.addEventListener("mousedown", (event) => {
  isDragging = true;
  pickColor(event); // Pick color on mousedown
});

canvas.addEventListener("mousemove", (event) => {
  if (isDragging) {
    pickColor(event); // Continuously pick color while dragging
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false; // Stop dragging
});

// Stop dragging if the mouse leaves the canvas
canvas.addEventListener("mouseleave", () => {
  isDragging = false;
});

// Listen for changes to the saturation slider
saturationSlider.addEventListener("input", (event) => {
  saturation = event.target.value; // Update saturation value
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawColorWheel(); // Redraw the base color wheel
});

// Draw the color wheel on page load
window.onload = () => {
  drawColorWheel();
};
