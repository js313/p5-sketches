let res = 100;
let lineHeight = 200;
let maxAmplitude = 10;
let initDamp = 1;
let curPoints = [];
let amps = [];
let freq = 0.1; // Initial frequency value

let impulseCheckbox; // Checkbox for triggering an impulse
let impulseActive = false; // State for the impulse (whether it's active or not)
let impulseStrength = 1; // Variable to store the impulse strength (for smooth interpolation)

function setup() {
  // change on browser size change(method in p5 js)
  createCanvas(800, 400);

  // Initialize the points
  curPoints.push(createVector(0, lineHeight));
  for (let i = 1; i <= res; i++) {
    curPoints.push(createVector((i * 800) / res, lineHeight));
    amps.push(0);
  }

  // Create a checkbox to trigger impulse
  impulseCheckbox = createCheckbox("Trigger Impulse", false);
  impulseCheckbox.position(10, height - 30);
  impulseCheckbox.changed(toggleImpulse); // Set callback to trigger when checkbox is changed
}

function draw() {
  background(7, 8, 49, 10);
  // experiment with fading trails
  //   fill(0, 50);

  amps[0] = 10;

  // Smoothly interpolate the impulse strength
  if (impulseActive) {
    impulseStrength = lerp(impulseStrength, 10, 0.1); // Smoothly interpolate towards maxAmplitude
  } else {
    impulseStrength = lerp(impulseStrength, 1, 0.05); // Smoothly return to 0 (no impulse)
  }

  // If the impulse is active, apply the interpolated impulse strength
  amps[0] *= impulseStrength;

  // Update amps[0] based on noise
  amps[0] += noise(frameCount * 0.05);

  // Update the points based on the sine wave
  for (let i = 0; i <= res; i++) {
    curPoints[i].y =
      (sin((frameCount - i) * freq) * amps[i]) / (initDamp * (i / 20 + 1)) +
      lineHeight;
  }

  // Shift the amplitude values
  for (let i = amps.length - 1; i > 0; i--) {
    amps[i] = amps[i - 1];
  }

  // Draw the waveform
  stroke(255, 244, 214);
  strokeWeight(3);
  noFill();
  beginShape();

  for (let i = 0; i < curPoints.length; i++) {
    vertex(curPoints[i].x, curPoints[i].y);
  }

  endShape();
}

// Function to toggle the impulse state when the checkbox is changed
function toggleImpulse() {
  impulseActive = impulseCheckbox.checked();
}
