/// <reference path="../node_modules/@types/p5/global.d.ts" />

const bgColor = "#070831";
const primaryColor = "#fff4d6";
const secondaryColor = "#908a76";

let res = 100;
let lineHeight = 400;
let baseAmplitude = 10;
let impulseAmplitude = 30;
let damp = 1;
let curPoints = [];
let amps = [];
let freq = 0.1; // Initial frequency value
let noiseStepMult = 0.1;

let impulseCheckbox; // Checkbox for triggering an impulse
let impulseActive = false; // State for the impulse (whether it's active or not)
let impulseStrength = 0; // Variable to store the impulse strength (for smooth interpolation)

function setup() {
  createCanvas(windowWidth, windowHeight); // Set initial size based on window size

  // Initialize the points
  curPoints.push(createVector(0, lineHeight));
  for (let i = 1; i <= res + 1; i++) {
    curPoints.push(createVector((i * width) / res, lineHeight));
    amps.push(0);
  }

  // Create a checkbox to trigger impulse
  impulseCheckbox = createCheckbox("Trigger Impulse", false);
  impulseCheckbox.position(10, height - 30);
  impulseCheckbox.changed(toggleImpulse); // Set callback to trigger when checkbox is changed
}

function draw() {
  background(bgColor);

  fill(secondaryColor);
  stroke(secondaryColor);
  circle(width / 2, lineHeight - 10, 200);
  //   stroke(bgColor);
  // Create the fading effect using a semi-transparent rectangle
  //   fill(7, 8, 49, 20); // Semi-transparent background (alpha = 20)
  //   noStroke();
  //   rect(0, 0, width, height); // Draw a rectangle covering the entire canvas

  amps[0] = baseAmplitude;

  // Smoothly interpolate the impulse strength
  if (impulseActive) {
    impulseStrength = lerp(impulseStrength, impulseAmplitude, 0.05);
  } else {
    impulseStrength = lerp(impulseStrength, 0, 0.05);
  }

  // If the impulse is active, apply the interpolated impulse strength
  amps[0] += impulseStrength;

  // Update amps[0] based on noise
  amps[0] += (noise(frameCount * noiseStepMult) * amps[0]) / 2;

  // Update the points based on the sine wave
  for (let i = 0; i <= res; i++) {
    curPoints[i].y =
      (sin((frameCount - i) * freq) * amps[i]) / (damp * (i / 20 + 1)) +
      lineHeight;
  }

  // Shift the amplitude values
  for (let i = amps.length - 1; i > 0; i--) {
    amps[i] = amps[i - 1];
  }

  // Draw the waveform
  stroke(primaryColor);
  strokeWeight(3);
  fill(7, 8, 49, 220);
  beginShape();

  for (let i = 0; i < curPoints.length; i++) {
    vertex(curPoints[i].x, curPoints[i].y);
  }
  vertex(curPoints[curPoints.length - 1].x, height + 10);
  vertex(curPoints[0].x, height + 10);

  endShape();
}

// Function to toggle the impulse state when the checkbox is changed
function toggleImpulse() {
  impulseActive = impulseCheckbox.checked();
}

// This will resize the canvas whenever the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Recalculate the points based on the new canvas size
  curPoints = [];
  for (let i = 0; i <= res; i++) {
    curPoints.push(createVector((i * width) / res, lineHeight));
    amps.push(0);
  }
}
