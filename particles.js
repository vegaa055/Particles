const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const numParticles = 1500;
const particles = [];
const mouse = {
  x: null,
  y: null,
};
const escapeRadius = 100; // radius within which particles escape from the mouse
const radiusMultiplier = 1.5; // multiplier for particle radius

// Initialize particles with random positions and velocities
// and store their original velocities
for (let i = 0; i < numParticles; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    originalVx: (Math.random() - 0.5) * 0.5,
    originalVy: (Math.random() - 0.5) * 0.5,
    radius: Math.random() * radiusMultiplier + 1,
    color: "lightblue",
  });
}

// Function to draw each particle
function drawParticles(particle) {
  const dx = particle.x - mouse.x;
  const dy = particle.y - mouse.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

  if (mouse.x !== null && distance < escapeRadius) {
    ctx.shadowColor = "rgba(218, 22, 22, 0.8)"; // lightblue glow
    ctx.shadowBlur = 15;
  } else {
    ctx.shadowBlur = 0;
  }

  ctx.fillStyle = particle.color;
  ctx.fill();
  ctx.shadowBlur = 0; // reset to avoid applying it to next frame unintentionally
}

// Function to update particle positions and handle escape behavior
function updateParticles(particle) {
  const dx = particle.x - mouse.x; // distance from mouse x
  const dy = particle.y - mouse.y; // distance from mouse y
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (mouse.x !== null && distance < escapeRadius) {
    const angle = Math.atan2(dy, dx); // direction away from mouse
    const force = (escapeRadius - distance) / escapeRadius; // closer = stronger push
    const speed = force * 2; // max 2px/frame
    particle.vx += Math.cos(angle) * speed * 0.1; // apply force to velocity in x direction
    particle.vy += Math.sin(angle) * speed * 0.1; // apply force to velocity in y direction
  } else {
    // ease back to original velocity
    particle.vx += (particle.originalVx - particle.vx) * 0.05;
    particle.vy += (particle.originalVy - particle.vy) * 0.05;
  }

  particle.x += particle.vx;
  particle.y += particle.vy;

  // Wrap-around screen edges
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
