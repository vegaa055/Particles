const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const numParticles = 2500;  // ! number of particles (otiginally 1500)
const particles = [];
const mouse = {
  x: null,
  y: null,
};
const escapeRadius = 100; // radius within which particles escape from the mouse
const radiusMultiplier = 1.5; // ! multiplier for particle radius
let isAttracting = false;

// * Initialize particles with random positions and velocities
// * and store their original velocities
for (let i = 0; i < numParticles; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5, // initial velocity in x direction
    vy: (Math.random() - 0.5) * 0.5, // initial velocity in y direction
    originalVx: (Math.random() - 0.5) * 0.5, // store original velocity in x direction
    originalVy: (Math.random() - 0.5) * 0.5, // store original velocity in y direction
    radius: Math.random() * radiusMultiplier + 1,
    color: "rgba(127, 175, 207, 0.8)", // particle color 
  });
}

// * Function to draw each particle
function drawParticles(particle) {
  const dx = particle.x - mouse.x; // distance from mouse x
  const dy = particle.y - mouse.y; // distance from mouse y
  const distance = Math.sqrt(dx * dx + dy * dy); // calculate distance to mouse

  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2); // draw circle

  if (mouse.x !== null && distance < escapeRadius) {
    ctx.shadowColor = "rgba(255, 0, 0, 0.8)"; // lightblue glow
    ctx.shadowBlur = 15; // ! blur effect for glow
  } else {
    ctx.shadowBlur = 0; // ! no glow effect when not near mouse
  }

  ctx.fillStyle = particle.color;
  ctx.fill();
  ctx.shadowBlur = 0; // reset to avoid applying it to next frame unintentionally
}

// * Function to update particle positions and handle escape behavior
function updateParticles(particle) {

  const dx = mouse.x - particle.x;
  const dy = mouse.y - particle.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const angle = Math.atan2(dy, dx);
  const force = (escapeRadius - distance) / escapeRadius;
  const clampedForce = Math.max(Math.min(force, 1), 0); // clamp between 0 and 1
  const effectStrength = clampedForce * 0.5;

  if (distance < escapeRadius) {
    if (isAttracting) {
      // Pull toward mouse
      particle.vx += Math.cos(angle) * effectStrength;
      particle.vy += Math.sin(angle) * effectStrength;
    } else {
      // Push away from mouse
      particle.vx -= Math.cos(angle) * effectStrength;
      particle.vy -= Math.sin(angle) * effectStrength;
    }
  } else {
    // Ease back to original velocity
    particle.vx += (particle.originalVx - particle.vx) * 0.05;
    particle.vy += (particle.originalVy - particle.vy) * 0.05;
  }

  // Optional velocity dampening
  particle.vx *= 0.98;
  particle.vy *= 0.98;

  particle.x += particle.vx;
  particle.y += particle.vy;

  // Wrap screen
  if (particle.x < 0) particle.x = canvas.width;
  if (particle.x > canvas.width) particle.x = 0;
  if (particle.y < 0) particle.y = canvas.height;
  if (particle.y > canvas.height) particle.y = 0;
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    updateParticles(particle);
    drawParticles(particle);
  });
  requestAnimationFrame(draw);
}

draw();

canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});
canvas.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});
canvas.addEventListener("mousedown", (e) => {
  if (e.button === 0) isAttracting = true;
});

canvas.addEventListener("mouseup", (e) => {
  if (e.button === 0) isAttracting = false;
});

canvas.addEventListener("mouseout", () => {
  isAttracting = false; // cancel attraction if mouse leaves window
});

