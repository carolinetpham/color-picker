const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const colorDisplay = document.getElementById("color-display");
const colorHex = document.getElementById("hex-code");
const saturationSlider = document.getElementById("saturation-slider");
const brightnessSlider = document.getElementById("brightness-slider");
document.getElementById("reset-button").addEventListener("click", resetValues);

let isDragging = false;
let hue = 0;
let saturation = 100;
let brightness = 50;

function drawColorWheel() {
  const gradient = ctx.createConicGradient(0, 150, 150);

  // Add color stops for the gradient
  for (let i = 0; i <= 360; i += 10) {
    const h = i;
    const s = saturation;
    const l = brightness;
    gradient.addColorStop(i / 360, `hsl(${h}, ${s}%, ${l}%)`);
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
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    // Convert the picked RGB color to HSL
    const { h, s, l } = rgbToHsl(r, g, b);
    hue = Math.round(h);
    saturation = Math.round(s * 100);
    brightness = Math.round(l * 100);

    // Update color display and sliders
    colorDisplay.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${brightness}%)`;
    colorHex.textContent = rgbToHex(r, g, b);
    updateSliders();
  }
}

function updateSliders() {
  saturationSlider.style.background = `linear-gradient(to right, hsl(${hue}, 0%, ${brightness}%), hsl(${hue}, 100%, ${brightness}%))`;
  brightnessSlider.style.background = `linear-gradient(to right, black, hsl(${hue}, ${saturation}%, 50%), white)`;
}

// Convert RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h, s;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s, l };
}

function updateColor() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawColorWheel();

  const hslColor = `hsl(${hue}, ${saturation}%, ${brightness}%)`;
  colorDisplay.style.backgroundColor = hslColor;
  const hexColor = hslToHex(hue, saturation / 100, brightness / 100);
  colorHex.textContent = hexColor;

  updateSliders();
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
  isDragging = false;
});

canvas.addEventListener("mouseleave", () => {
  isDragging = false;
});

// Listen for slider adjustments
saturationSlider.addEventListener("input", (event) => {
  saturation = event.target.value;
  updateColor();
});

brightnessSlider.addEventListener("input", (event) => {
  brightness = event.target.value;
  updateColor();
});

// Initialize the canvas and sliders
window.onload = () => {
  drawColorWheel();
  updateColor();
  updateSliders();
};

// To copy to your clip
function copyToClipboard() {
  const hexCode = document.getElementById("hex-code").textContent;

  navigator.clipboard
    .writeText(hexCode)
    .then(() => {
      alert(`Copied to clipboard: ${hexCode}`);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}

// To reset to original values

function resetValues() {
  hue = 0;
  saturation = 100;
  brightness = 50;
  document.getElementById("saturation-slider").value = saturation;
  document.getElementById("brightness-slider").value = brightness;
  document.getElementById("hex-code").textContent = "#FF000";
  updateColor();
}
