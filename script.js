/**
 * KRISHNA CONSCIOUS BIRTHDAY CELEBRATION
 * JavaScript Interactivity, Particle Simulation & Media Controls
 * For Maheedhar Prabhu
 */

document.addEventListener('DOMContentLoaded', () => {
  initVideoControls();
  initPetalCanvas();
  initWebAudioBell();
  initBlessingButtons();
});

/* ==========================================================================
   1. VIDEO CONTINUOUS PLAYBACK & CONTROLS
   ========================================================================== */
function initVideoControls() {
  const video = document.getElementById('birthdayVideo');
  const soundBtn = document.getElementById('videoSoundBtn');
  const soundIcon = document.getElementById('soundIcon');
  const soundLabel = document.getElementById('soundLabel');
  const playPauseBtn = document.getElementById('videoPlayPauseBtn');
  const playPauseIcon = document.getElementById('playPauseIcon');
  const fullscreenBtn = document.getElementById('videoFullscreenBtn');

  if (!video) return;

  // Guarantee continuous looping playback
  video.loop = true;
  video.muted = true; // Required for reliable autoplay across all mobile & desktop browsers

  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.log('Autoplay deferred by browser policy, awaiting user interaction:', error);
    });
  }

  // Backup in case loop attribute hiccups in edge cases
  video.addEventListener('ended', () => {
    video.currentTime = 0;
    video.play();
  });

  // Sound toggle button
  if (soundBtn) {
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.muted) {
        video.muted = false;
        soundIcon.textContent = '🔊';
        soundLabel.textContent = 'Sound ON';
        soundBtn.classList.remove('sound-pulse');
        soundBtn.style.background = 'linear-gradient(135deg, #00897b 0%, #00bfa5 100%)';
      } else {
        video.muted = true;
        soundIcon.textContent = '🔇';
        soundLabel.textContent = 'Tap for Audio';
        soundBtn.classList.add('sound-pulse');
        soundBtn.style.background = '';
      }
    });
  }

  // Play / Pause toggle
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play();
        playPauseIcon.textContent = '⏸️';
      } else {
        video.pause();
        playPauseIcon.textContent = '▶️';
      }
    });
  }

  video.addEventListener('play', () => {
    if (playPauseIcon) playPauseIcon.textContent = '⏸️';
  });

  video.addEventListener('pause', () => {
    if (playPauseIcon) playPauseIcon.textContent = '▶️';
  });

  // Fullscreen toggle
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!document.fullscreenElement) {
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
          video.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }
}

/* ==========================================================================
   2. SACRED FLOWER PETALS & GOLDEN PARTICLES CANVAS
   ========================================================================== */
let triggerShowerOfBlessings = null;

function initPetalCanvas() {
  const canvas = document.getElementById('blessingsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const petalTypes = [
    { name: 'lotus', color: '#ff77a9', highlight: '#ffffff', shape: 'ellipse' },
    { name: 'marigold', color: '#ffa000', highlight: '#ffd54f', shape: 'round' },
    { name: 'rose', color: '#e91e63', highlight: '#f48fb1', shape: 'petal' },
    { name: 'goldDust', color: '#ffd700', highlight: '#ffffff', shape: 'sparkle' }
  ];

  class Petal {
    constructor(isBurst = false) {
      this.reset(isBurst);
    }

    reset(isBurst = false) {
      this.type = petalTypes[Math.floor(Math.random() * petalTypes.length)];
      this.x = Math.random() * width;
      this.y = isBurst ? Math.random() * -150 - 20 : Math.random() * height - height;
      this.size = this.type.shape === 'sparkle'
        ? Math.random() * 3 + 1.5
        : Math.random() * 12 + 8;

      this.speedY = this.type.shape === 'sparkle'
        ? Math.random() * 1.2 + 0.8
        : Math.random() * 2 + (isBurst ? 2.5 : 1.2);

      this.speedX = Math.random() * 1.5 - 0.75;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 2;
      this.swing = Math.random() * 2 * Math.PI;
      this.swingSpeed = Math.random() * 0.03 + 0.01;
      this.opacity = Math.random() * 0.45 + 0.55;
    }

    update() {
      this.swing += this.swingSpeed;
      this.x += Math.sin(this.swing) * 1.2 + this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;

      if (this.y > height + 40) {
        this.reset();
      }
      if (this.x > width + 40) this.x = -20;
      if (this.x < -40) this.x = width + 20;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      if (this.type.shape === 'sparkle') {
        // Draw golden glint
        ctx.fillStyle = this.type.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffe082';
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw devotional flower petal
        const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size);
        grad.addColorStop(0, this.type.highlight);
        grad.addColorStop(0.6, this.type.color);
        grad.addColorStop(1, 'rgba(120, 20, 50, 0.6)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.5, this.size * 0.8, this.size * 0.8, 0, this.size);
        ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.8, -this.size * 0.8, -this.size * 0.5, 0, -this.size);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Base ambient particles
  const totalAmbient = Math.min(Math.floor(window.innerWidth / 24), 50);
  for (let i = 0; i < totalAmbient; i++) {
    const p = new Petal();
    p.y = Math.random() * height; // Distribute on start
    petals.push(p);
  }

  // Shower of blessings function
  triggerShowerOfBlessings = function (count = 60) {
    for (let i = 0; i < count; i++) {
      petals.push(new Petal(true));
    }
    // Trim back if too many to maintain smooth 60fps
    if (petals.length > 180) {
      petals.splice(0, petals.length - 180);
    }
  };

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. WEB AUDIO TEMPLE BELL CHIME (Offline & Pure Vedic Sound)
   ========================================================================== */
let audioCtx = null;

function playTempleBellChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Traditional brass bell frequencies (fundamental + rich natural harmonics)
    const harmonics = [
      { freq: 440, gain: 0.5, decay: 2.8 },   // Fundamental (A4)
      { freq: 880, gain: 0.3, decay: 2.4 },   // Octave
      { freq: 1320, gain: 0.18, decay: 1.8 }, // 3rd harmonic
      { freq: 1760, gain: 0.1, decay: 1.2 },  // 4th harmonic
      { freq: 2640, gain: 0.05, decay: 0.8 }  // 6th shimmer
    ];

    harmonics.forEach(({ freq, gain, decay }) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(gain, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + decay);
    });
  } catch (err) {
    console.log('Audio playback initialized on interaction:', err);
  }
}

function initWebAudioBell() {
  const bellBtn = document.getElementById('audioToggleBtn');
  if (bellBtn) {
    bellBtn.addEventListener('click', () => {
      playTempleBellChime();
      bellBtn.style.transform = 'scale(1.15)';
      setTimeout(() => {
        bellBtn.style.transform = '';
      }, 250);
    });
  }
}

/* ==========================================================================
   4. CELEBRATION & BLESSING BUTTON ACTIONS
   ========================================================================== */
function initBlessingButtons() {
  const showerBtn = document.getElementById('showerFlowerBtn');
  const heroShowerBtn = document.getElementById('heroFlowerShowerBtn');

  function handleShowerClick(e) {
    if (triggerShowerOfBlessings) {
      triggerShowerOfBlessings(75);
    }
    playTempleBellChime();

    // Create temporary blessing ripple toast
    showBlessingToast('🌸 हरे कृष्ण! Divine Flower Shower Offered! 🪷');
  }

  if (showerBtn) showerBtn.addEventListener('click', handleShowerClick);
  if (heroShowerBtn) heroShowerBtn.addEventListener('click', handleShowerClick);
}

function showBlessingToast(message) {
  let toast = document.getElementById('blessingToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'blessingToast';
    toast.style.position = 'fixed';
    toast.style.top = '70px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%) translateY(-20px)';
    toast.style.background = 'linear-gradient(135deg, rgba(255, 143, 0, 0.95), rgba(216, 67, 21, 0.95))';
    toast.style.color = '#ffffff';
    toast.style.padding = '0.65rem 1.4rem';
    toast.style.borderRadius = '30px';
    toast.style.border = '1.5px solid #ffe082';
    toast.style.fontFamily = "'Philosopher', serif";
    toast.style.fontSize = '0.95rem';
    toast.style.fontWeight = '700';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5), 0 0 20px rgba(255, 215, 0, 0.6)';
    toast.style.zIndex = '999';
    toast.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    toast.style.opacity = '0';
    toast.style.pointerEvents = 'none';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-20px)';
  }, 2400);
}
