/**
 * SHOOT & HIDE — 3D Turn-Based Sniper Cover Duel vs Intelligent AI
 * Recreated from video analysis (7m19s gameplay recording of "Shoot & Hide"):
 * - Areas: Area 8 Night Temple, Area 1 Beach Island, Area 5 City Street, Area 7 Drowned Town
 * - Turn-Based 1v1 Sniper Duels (3 Rifle Shots per Turn) against AI Opponents (SanneSau, OdaFromTheCabin, etc.)
 * - HIDE! 3-2-1 Countdown with Yellow Polka-Dot Curtain Warning
 * - Destructible Shoji Screen Panels & Bamboo Bundles + Floating Cash (+25), Trophies & Medkits
 * - Stance Switching (Stand, Crouch, Prone) & AI Red Laser Sight Tracking
 * - First-Person Sniper Scope Zoom with HEADSHOT, BODY SHOT & HANDSHOT Diamond Callouts
 */

(() => {
  'use strict';

  // --- Fallback for <dialog closedby="any"> per modern-web-guidance ---
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const outside = (e, dialog) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (e) => { pressedOutside = outside(e, dialog); });
      dialog.addEventListener('pointerup', (e) => { if (pressedOutside && outside(e, dialog)) dialog.close(); });
    }
  }

  // --- Synthesized Web Audio Engine ---
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playSniperShot() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // High-velocity supersonic crack + noise tail
      const len = Math.floor(this.ctx.sampleRate * 0.32);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.055));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1250, now);
      filter.Q.setValueAtTime(0.75, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.65, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);

      // Heavy rifle chamber punch
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(34, now + 0.16);
      oscGain.gain.setValueAtTime(0.55, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.17);
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    }

    playCoverBreak() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const len = Math.floor(this.ctx.sampleRate * 0.18);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(680, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.17);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    }

    playHitCallout(isHeadshot = false) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = isHeadshot ? [587.33, 880, 1174.66] : [440, 587.33];
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.045);
        gain.gain.setValueAtTime(0.32, now + idx * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.008, now + idx * 0.045 + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.045);
        osc.stop(now + idx * 0.045 + 0.29);
      });
    }

    playPickup() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1318.5, now + 0.055);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.008, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.21);
    }

    playCountdownBeep(finalGo = false) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(finalGo ? 880 : 523.25, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.008, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    }

    playCrackerBurst() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const len = Math.floor(this.ctx.sampleRate * 0.24);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      noise.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    }
  }

  const sfx = new SoundEngine();

  // --- Arena Definitions (Matching Video Frame 10, 14, 15, 16) ---
  const ARENAS = [
    {
      id: 'night_temple',
      areaTag: '📍 AREA 8',
      name: 'Night Temple',
      skyTop: '#0f172a',
      skyBot: '#4c1d95',
      groundColor: 0x64748b,
      grassColor: 0x115e59,
      wallFrameColor: 0x1e130c,
      wallPanelColor: 0xc29b7f,
      bambooColor: 0x9a7b56,
      aiBot: {
        name: 'SanneSau',
        flag: '🇳🇴',
        emoji: '🧔🏼',
        trophies: 34359,
        baseHp: 2190,
        baseAtk: 740,
        coatColor: 0xf1f5f9,
      },
    },
    {
      id: 'city',
      areaTag: '📍 AREA 5',
      name: 'City Street',
      skyTop: '#38bdf8',
      skyBot: '#e0f2fe',
      groundColor: 0x475569,
      grassColor: 0x15803d,
      wallFrameColor: 0x334155,
      wallPanelColor: 0x94a3b8,
      bambooColor: 0xeab308,
      aiBot: {
        name: 'OdaFromTheCabin',
        flag: '🇨🇭',
        emoji: '🧔🏻‍♂️',
        trophies: 34610,
        baseHp: 2650,
        baseAtk: 810,
        coatColor: 0x38bdf8,
      },
    },
    {
      id: 'beach',
      areaTag: '📍 AREA 1',
      name: 'Beach Island',
      skyTop: '#0284c7',
      skyBot: '#67e8f9',
      groundColor: 0xfde68a,
      grassColor: 0x0ea5e9,
      wallFrameColor: 0x475569,
      wallPanelColor: 0x94a3b8,
      bambooColor: 0xd97706,
      aiBot: {
        name: 'Kovalski_PL',
        flag: '🇵🇱',
        emoji: '🕵🏻‍♂️',
        trophies: 34120,
        baseHp: 1950,
        baseAtk: 680,
        coatColor: 0xfacc15,
      },
    },
    {
      id: 'drowned_town',
      areaTag: '📍 AREA 7',
      name: 'Drowned Town',
      skyTop: '#083344',
      skyBot: '#155e75',
      groundColor: 0x334155,
      grassColor: 0x0f766e,
      wallFrameColor: 0x451a03,
      wallPanelColor: 0x9a3412,
      bambooColor: 0x22c55e,
      aiBot: {
        name: 'Valkyrie_SE',
        flag: '🇸🇪',
        emoji: '🥷',
        trophies: 34890,
        baseHp: 2890,
        baseAtk: 860,
        coatColor: 0xf43f5e,
      },
    },
  ];

  // --- Persistent Player State ---
  const STATE = {
    trophies: Number(localStorage.getItem('sh3d_trophies') ?? 34295),
    cash: Number(localStorage.getItem('sh3d_cash') ?? 151000),
    gems: Number(localStorage.getItem('sh3d_gems') ?? 10),
    gearLevel: Number(localStorage.getItem('sh3d_gear_lvl') ?? 30),
    atk: Number(localStorage.getItem('sh3d_atk') ?? 739),
    hp: Number(localStorage.getItem('sh3d_hp') ?? 1881),
    selectedArenaIdx: 0,
    aiDifficulty: 'pro',
    showLaser: true,
  };

  function saveState() {
    localStorage.setItem('sh3d_trophies', String(STATE.trophies));
    localStorage.setItem('sh3d_cash', String(STATE.cash));
    localStorage.setItem('sh3d_gems', String(STATE.gems));
    localStorage.setItem('sh3d_gear_lvl', String(STATE.gearLevel));
    localStorage.setItem('sh3d_atk', String(STATE.atk));
    localStorage.setItem('sh3d_hp', String(STATE.hp));
  }

  // --- DOM Elements ---
  const canvasWrap = document.getElementById('canvas-wrap');
  const scopeOverlay = document.getElementById('scope-overlay');
  const curtainWarning = document.getElementById('curtain-warning');
  const popupLayer = document.getElementById('popup-layer');
  const hitCallout = document.getElementById('hit-callout');
  const diamondBadge = document.getElementById('diamond-badge');
  const calloutIcon = document.getElementById('callout-icon');
  const calloutLabel = document.getElementById('callout-label');

  const lobbyScreen = document.getElementById('lobby-screen');
  const matchmakingScreen = document.getElementById('matchmaking-screen');
  const battleHud = document.getElementById('battle-hud');
  const resultScreen = document.getElementById('result-screen');
  const settingsDialog = document.getElementById('settings-dialog');

  const dodgeControls = document.getElementById('dodge-controls');
  const shootControlsHint = document.getElementById('shoot-controls-hint');
  const phaseBanner = document.getElementById('phase-banner');
  const countdownCircle = document.getElementById('countdown-circle');

  // --- Three.js Scene Setup ---
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 320);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  canvasWrap.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.72);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xfff7ed, 0.95);
  dirLight.position.set(16, 35, 25);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  scene.add(dirLight);

  const worldGroup = new THREE.Group();
  const fxGroup = new THREE.Group();
  scene.add(worldGroup);
  scene.add(fxGroup);

  // --- 3D Character Builder (Player & AI Sniper) ---
  function createCharacterRig(isPlayer, coatHex) {
    const root = new THREE.Group();

    const bodyGroup = new THREE.Group();
    root.add(bodyGroup);

    const coatMat = new THREE.MeshStandardMaterial({
      color: coatHex,
      roughness: 0.45,
    });
    const pantsMat = new THREE.MeshStandardMaterial({
      color: isPlayer ? 0x3b0764 : 0x1e293b,
      roughness: 0.6,
    });
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfdba74,
      roughness: 0.5,
    });
    const helmetMat = new THREE.MeshStandardMaterial({
      color: isPlayer ? 0x451a03 : 0x111827,
      roughness: 0.35,
    });
    const shoeMat = new THREE.MeshStandardMaterial({
      color: isPlayer ? 0x7c3aed : 0x0f172a,
    });

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.14, 0.11, 0.85, 10);
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.set(-0.2, 0.45, 0);
    leftLeg.castShadow = true;
    bodyGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.set(0.2, 0.45, 0);
    rightLeg.castShadow = true;
    bodyGroup.add(rightLeg);

    // Purple sneakers (just like video character!)
    const shoeGeo = new THREE.BoxGeometry(0.22, 0.14, 0.34);
    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.position.set(-0.2, 0.07, 0.05);
    bodyGroup.add(leftShoe);

    const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rightShoe.position.set(0.2, 0.07, 0.05);
    bodyGroup.add(rightShoe);

    // Torso Hoodie/Vest
    const torsoGeo = new THREE.BoxGeometry(0.64, 0.92, 0.38);
    const torso = new THREE.Mesh(torsoGeo, coatMat);
    torso.position.set(0, 1.32, 0);
    torso.castShadow = true;
    bodyGroup.add(torso);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.72, 10);
    const leftArm = new THREE.Mesh(armGeo, coatMat);
    leftArm.position.set(-0.44, 1.32, 0);
    leftArm.rotation.z = 0.18;
    bodyGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, coatMat);
    rightArm.position.set(0.44, 1.32, 0);
    rightArm.rotation.z = -0.18;
    bodyGroup.add(rightArm);

    // Head + Aviator Helmet/Goggles
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 2.02, 0);

    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 18), skinMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    const helmetMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.305, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.62),
      helmetMat
    );
    helmetMesh.position.y = 0.03;
    headGroup.add(helmetMesh);

    bodyGroup.add(headGroup);

    // Sniper Rifle slung on back / held in hands
    const rifleGroup = new THREE.Group();
    const gunMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.65, roughness: 0.3 });
    const stockMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });

    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.65, 8), gunMat);
    barrel.rotation.z = Math.PI / 2;
    rifleGroup.add(barrel);

    const scopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.48, 8), gunMat);
    scopeTube.rotation.z = Math.PI / 2;
    scopeTube.position.set(0.1, 0.11, 0);
    rifleGroup.add(scopeTube);

    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 0.1), stockMat);
    stock.position.set(-0.55, -0.04, 0);
    rifleGroup.add(stock);

    rifleGroup.position.set(0.05, 1.42, 0.24);
    rifleGroup.rotation.z = -0.65;
    bodyGroup.add(rifleGroup);

    return {
      root,
      bodyGroup,
      headGroup,
      leftLeg,
      rightLeg,
      leftArm,
      rightArm,
      torso,
      rifleGroup,
      stance: 'crouch', // 'stand' | 'crouch' | 'prone'
      animTime: 0,
    };
  }

  function applyRigStance(rig, stance, isMoving, dt) {
    rig.stance = stance;
    if (isMoving) {
      rig.animTime += dt * 11;
    }

    if (stance === 'stand') {
      rig.bodyGroup.scale.set(1, 1, 1);
      rig.bodyGroup.position.y = 0;
      rig.bodyGroup.rotation.x = 0;
      const swing = isMoving ? Math.sin(rig.animTime) * 0.45 : 0;
      rig.leftLeg.rotation.x = swing;
      rig.rightLeg.rotation.x = -swing;
    } else if (stance === 'crouch') {
      // Low crouch profile behind mid-height cover
      rig.bodyGroup.scale.set(1.04, 0.68, 1.05);
      rig.bodyGroup.position.y = -0.05;
      rig.bodyGroup.rotation.x = 0.14;
      const swing = isMoving ? Math.sin(rig.animTime) * 0.35 : 0;
      rig.leftLeg.rotation.x = swing;
      rig.rightLeg.rotation.x = -swing;
    } else if (stance === 'prone') {
      // Crawling low on the ground (just like Frame 35!)
      rig.bodyGroup.scale.set(1.08, 0.38, 1.2);
      rig.bodyGroup.position.y = -0.1;
      rig.bodyGroup.rotation.x = 0.35;
      const swing = isMoving ? Math.sin(rig.animTime) * 0.25 : 0;
      rig.leftLeg.rotation.x = swing;
      rig.rightLeg.rotation.x = -swing;
    }
  }

  function getStanceHeights(stance) {
    if (stance === 'stand') {
      return { totalH: 2.32, headMinY: 1.72, headMaxY: 2.32, bodyMinY: 0.75, bodyMaxY: 1.72 };
    }
    if (stance === 'crouch') {
      return { totalH: 1.58, headMinY: 1.15, headMaxY: 1.58, bodyMinY: 0.48, bodyMaxY: 1.15 };
    }
    // prone
    return { totalH: 0.92, headMinY: 0.58, headMaxY: 0.92, bodyMinY: 0.22, bodyMaxY: 0.58 };
  }

  // --- Build 3D Night Temple / Arena Environment & Destructible Cover ---
  let playerCoverBlocks = []; // At z = 0 (protects Player at z = 2.0)
  let aiCoverBlocks = [];     // At z = -34 (protects AI at z = -36.0)
  let groundPickups = [];     // Floating Cash, Trophies & Medkits along Player's cover line
  let activeParticles = [];
  let activeTracers = [];

  let playerRig = null;
  let aiRig = null;
  let aiLaserLine = null;
  let aiLaserDot = null;
  let skyMoonMesh = null;

  const PLAYER_Z = 2.0;
  const PLAYER_COVER_Z = 0.0;
  const AI_COVER_Z = -34.0;
  const AI_Z = -36.0;
  const LANE_LIMIT_X = 6.2;

  function buildCoverLine(zPos, arena, targetArray) {
    // Creates a row of destructible Japanese Shoji screen panels & bamboo clusters across X in [-6.0, +6.0]
    // Each Shoji wall is subdivided into a 3x3 grid of breakable tiles + bamboo bundles between walls!
    const frameMat = new THREE.MeshStandardMaterial({ color: arena.wallFrameColor, roughness: 0.7 });
    const panelMat = new THREE.MeshStandardMaterial({ color: arena.wallPanelColor, roughness: 0.55 });
    const bambooMat = new THREE.MeshStandardMaterial({ color: arena.bambooColor, roughness: 0.5 });

    const wallCentersX = [-4.3, 0.0, 4.3];
    wallCentersX.forEach((wx) => {
      // 3 columns x 3 rows of destructible Shoji tiles
      const cols = 3;
      const rows = 3;
      const tileW = 0.86;
      const tileH = 0.68;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Leave occasional pre-broken gaps on upper row so snipers have tactical peek holes!
          if (r === 2 && c === 1 && Math.random() < 0.45) continue;

          const tx = wx + (c - 1) * tileW;
          const ty = 0.36 + r * tileH;

          const tileGroup = new THREE.Group();
          tileGroup.position.set(tx, ty, zPos);

          const pMesh = new THREE.Mesh(new THREE.BoxGeometry(tileW - 0.06, tileH - 0.06, 0.14), panelMat);
          pMesh.castShadow = true;
          pMesh.receiveShadow = true;
          tileGroup.add(pMesh);

          const borderMesh = new THREE.Mesh(new THREE.BoxGeometry(tileW, tileH, 0.11), frameMat);
          tileGroup.add(borderMesh);

          worldGroup.add(tileGroup);

          targetArray.push({
            type: 'shoji',
            mesh: tileGroup,
            x: tx,
            y: ty,
            z: zPos,
            w: tileW,
            h: tileH,
            hp: 1,
            colorHex: arena.wallPanelColor,
            alive: true,
          });
        }
      }
    });

    // Bamboo stalks bundles in the gaps (-2.15 and +2.15) just like Frame 28 & 50!
    const bambooCentersX = [-2.15, 2.15];
    bambooCentersX.forEach((bx) => {
      for (let s = -2; s <= 2; s++) {
        const sx = bx + s * 0.28;
        const stalkH = 1.15 + ((Math.abs(s) % 2) * 0.42);
        const stalkGeo = new THREE.CylinderGeometry(0.12, 0.13, stalkH, 8);
        const stalkMesh = new THREE.Mesh(stalkGeo, bambooMat);
        stalkMesh.position.set(sx, stalkH / 2, zPos);
        stalkMesh.castShadow = true;
        worldGroup.add(stalkMesh);

        targetArray.push({
          type: 'bamboo',
          mesh: stalkMesh,
          x: sx,
          y: stalkH / 2,
          z: zPos,
          w: 0.28,
          h: stalkH,
          hp: 1,
          colorHex: arena.bambooColor,
          alive: true,
        });
      }
    });
  }

  function spawnGroundPickup(x, type) {
    const group = new THREE.Group();
    group.position.set(x, 0.55, PLAYER_Z);

    if (type === 'cash') {
      const cashMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, emissive: 0x16a34a, emissiveIntensity: 0.35 });
      const bandMat = new THREE.MeshStandardMaterial({ color: 0xfef08a });
      const bill = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.22, 0.32), cashMat);
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.24, 0.34), bandMat);
      group.add(bill, band);
    } else if (type === 'trophy') {
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.65, roughness: 0.2, emissive: 0xca8a04, emissiveIntensity: 0.3 });
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.12, 0.42, 10), goldMat);
      group.add(cup);
    } else if (type === 'medkit') {
      const boxMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc });
      const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.4 });
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.36, 0.24), boxMat);
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.26), redMat);
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.24, 0.26), redMat);
      group.add(box, crossH, crossV);
    }

    worldGroup.add(group);
    groundPickups.push({
      mesh: group,
      x,
      type,
      collected: false,
    });
  }

  function buildArenaScene(arena) {
    while (worldGroup.children.length) worldGroup.remove(worldGroup.children[0]);
    while (fxGroup.children.length) fxGroup.remove(fxGroup.children[0]);

    playerCoverBlocks = [];
    aiCoverBlocks = [];
    groundPickups = [];
    activeParticles = [];
    activeTracers = [];

    // Sky background gradient on container
    canvasWrap.style.background = `linear-gradient(180deg, ${arena.skyTop} 0%, ${arena.skyBot} 55%, #1e293b 100%)`;

    // Outer lawn / water plane
    const lawnGeo = new THREE.PlaneGeometry(140, 160);
    const lawnMat = new THREE.MeshLambertMaterial({ color: arena.grassColor });
    const lawn = new THREE.Mesh(lawnGeo, lawnMat);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.set(0, -0.05, -25);
    worldGroup.add(lawn);

    // Central Stone Temple Courtyard Pathway (Matches Frame 28, 35, 55)
    const roadGeo = new THREE.PlaneGeometry(15.5, 75);
    const roadMat = new THREE.MeshStandardMaterial({ color: arena.groundColor, roughness: 0.8 });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -20);
    road.receiveShadow = true;
    worldGroup.add(road);

    // Glowing Full Moon + Distant Mount Fuji & Japanese Pagoda Silhouettes + Sakura Trees (Frame 28 & 55!)
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    skyMoonMesh = new THREE.Mesh(new THREE.SphereGeometry(2.6, 20, 20), moonMat);
    skyMoonMesh.position.set(9.5, 11.5, -55);
    worldGroup.add(skyMoonMesh);

    // Mount Fuji Cone in far background
    const fujiMat = new THREE.MeshLambertMaterial({ color: 0x475569 });
    const fuji = new THREE.Mesh(new THREE.ConeGeometry(22, 18, 6), fujiMat);
    fuji.position.set(-10, 8, -82);
    worldGroup.add(fuji);

    const snowCap = new THREE.Mesh(
      new THREE.ConeGeometry(7.5, 6.2, 6),
      new THREE.MeshBasicMaterial({ color: 0xe2e8f0 })
    );
    snowCap.position.set(-10, 14, -81.9);
    worldGroup.add(snowCap);

    // Torii Gate & Pagoda Roofs behind AI Sniper
    const redWoodMat = new THREE.MeshLambertMaterial({ color: 0x991b1b });
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });

    const pillarL = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 9, 8), redWoodMat);
    pillarL.position.set(-4.5, 4.5, -54);
    const pillarR = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 9, 8), redWoodMat);
    pillarR.position.set(4.5, 4.5, -54);
    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.9, 1.0), redWoodMat);
    topBeam.position.set(0, 8.8, -54);
    worldGroup.add(pillarL, pillarR, topBeam);

    // Pink Cherry Blossom (Sakura) Trees flanking the avenue
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x451a03 });
    const foliageMat = new THREE.MeshLambertMaterial({ color: 0xdb2777 });
    for (let i = 0; i < 14; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const tx = side * (9.5 + (i % 3) * 3.8);
      const tz = -6 - i * 3.6;

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 2.2, 6), trunkMat);
      trunk.position.set(tx, 1.1, tz);
      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(1.35, 0), foliageMat);
      crown.position.set(tx, 2.6, tz);
      crown.scale.set(1.3, 0.75, 1.1);
      worldGroup.add(trunk, crown);
    }

    // Build Player & AI Destructible Cover Walls
    buildCoverLine(PLAYER_COVER_Z, arena, playerCoverBlocks);
    buildCoverLine(AI_COVER_Z, arena, aiCoverBlocks);

    // Build Player & AI 3D Character Rigs
    playerRig = createCharacterRig(true, 0xb91c1c); // Red/Black tactical hoodie like video Player_3260
    playerRig.root.position.set(0, 0, PLAYER_Z);
    playerRig.root.rotation.y = Math.PI; // Facing toward the AI at -Z
    worldGroup.add(playerRig.root);

    aiRig = createCharacterRig(false, arena.aiBot.coatColor);
    aiRig.root.position.set(0, 0, AI_Z);
    aiRig.root.rotation.y = 0; // Facing toward Player at +Z
    worldGroup.add(aiRig.root);

    // AI Sniper Red Laser Sight Beam + Red Dot (Matches Frame 35 & Late 20!)
    const laserGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 1.5, AI_Z),
      new THREE.Vector3(0, 1.0, PLAYER_Z + 4),
    ]);
    const laserMat = new THREE.LineBasicMaterial({
      color: 0xff1e27,
      transparent: true,
      opacity: 0.0,
    });
    aiLaserLine = new THREE.Line(laserGeo, laserMat);
    fxGroup.add(aiLaserLine);

    aiLaserDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xff1e27, transparent: true, opacity: 0.0 })
    );
    fxGroup.add(aiLaserDot);
  }

  // --- Particle Shatter & Blood/Spark Effects ---
  const fragGeo = new THREE.BoxGeometry(0.24, 0.24, 0.12);
  const sparkGeo = new THREE.SphereGeometry(0.12, 6, 6);

  function spawnShatterDebris(wx, wy, wz, colorHex, count = 12) {
    for (let i = 0; i < count; i++) {
      const mat = new THREE.MeshLambertMaterial({ color: colorHex, transparent: true, opacity: 1 });
      const mesh = new THREE.Mesh(fragGeo, mat);
      mesh.position.set(
        wx + (Math.random() - 0.5) * 0.4,
        wy + (Math.random() - 0.5) * 0.4,
        wz + (Math.random() - 0.5) * 0.2
      );
      mesh.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      fxGroup.add(mesh);

      activeParticles.push({
        mesh,
        mat,
        vx: (Math.random() - 0.5) * 5.5,
        vy: 2.0 + Math.random() * 4.5,
        vz: (Math.random() - 0.5) * 4.5,
        life: 0.85,
        maxLife: 0.85,
        gravity: -16,
        spin: true,
      });
    }
  }

  function spawnFirecrackerCelebration() {
    const colors = [0xa3e635, 0xfacc15, 0x38bdf8, 0xf43f5e, 0xc084fc];
    for (let b = 0; b < 5; b++) {
      setTimeout(() => {
        sfx.playCrackerBurst();
        const cx = (Math.random() - 0.5) * 14;
        const cy = 4 + Math.random() * 6;
        const cz = -15 - Math.random() * 18;
        for (let i = 0; i < 32; i++) {
          const mat = new THREE.MeshBasicMaterial({
            color: colors[i % colors.length],
            transparent: true,
            opacity: 1,
          });
          const mesh = new THREE.Mesh(sparkGeo, mat);
          mesh.position.set(cx, cy, cz);
          fxGroup.add(mesh);

          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const spd = 4 + Math.random() * 8;
          activeParticles.push({
            mesh,
            mat,
            vx: Math.sin(phi) * Math.cos(theta) * spd,
            vy: Math.sin(phi) * Math.sin(theta) * spd + 2,
            vz: Math.cos(phi) * spd,
            life: 1.1,
            maxLife: 1.1,
            gravity: -6,
            spin: false,
          });
        }
      }, b * 240);
    }
  }

  function spawnBulletSmokeTracer(startVec, endVec) {
    const dir = new THREE.Vector3().subVectors(endVec, startVec);
    const dist = dir.length();
    const geo = new THREE.CylinderGeometry(0.03, 0.03, dist, 6);
    geo.translate(0, dist / 2, 0);
    geo.rotateX(Math.PI / 2);

    const mat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.85,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(startVec);
    mesh.lookAt(endVec);
    fxGroup.add(mesh);

    activeTracers.push({ mesh, mat, life: 0.22, maxLife: 0.22 });
  }

  // --- Floating 2D UI Popups & Hit Callout Diamond ---
  function spawnPopup(worldPos, text, cssType = 'dmg') {
    const v = worldPos.clone().project(camera);
    const rect = canvasWrap.getBoundingClientRect();
    const sx = (v.x * 0.5 + 0.5) * rect.width;
    const sy = (-v.y * 0.5 + 0.5) * rect.height;

    const el = document.createElement('div');
    el.className = `floating-pop ${cssType}`;
    el.textContent = text;
    el.style.left = `${THREE.MathUtils.clamp(sx, 50, rect.width - 50)}px`;
    el.style.top = `${THREE.MathUtils.clamp(sy, 60, rect.height - 60)}px`;
    popupLayer.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1100);
  }

  let calloutTimeout = null;
  function showHitCallout(type) {
    // type: 'HEADSHOT' | 'BODY SHOT' | 'HANDSHOT'
    if (calloutTimeout) clearTimeout(calloutTimeout);
    hitCallout.classList.remove('hidden');

    if (type === 'HEADSHOT') {
      diamondBadge.className = 'diamond-badge';
      calloutIcon.textContent = '💀';
      calloutLabel.textContent = 'HEADSHOT';
      calloutLabel.className = 'callout-label headshot-text';
    } else if (type === 'HANDSHOT') {
      diamondBadge.className = 'diamond-badge';
      calloutIcon.textContent = '🖐️';
      calloutLabel.textContent = 'HANDSHOT';
      calloutLabel.className = 'callout-label';
    } else {
      diamondBadge.className = 'diamond-badge bodyshot';
      calloutIcon.textContent = '🎯';
      calloutLabel.textContent = 'BODY SHOT';
      calloutLabel.className = 'callout-label';
    }

    calloutTimeout = setTimeout(() => {
      hitCallout.classList.add('hidden');
    }, 1250);
  }

  // --- Match & Turn-Based Combat State Machine ---
  const MATCH = {
    active: false,
    phase: 'IDLE', // 'PLAYER_HIDE_COUNTDOWN' | 'AI_SHOOTING' | 'AI_HIDE_COUNTDOWN' | 'PLAYER_SHOOTING' | 'RESULT'
    phaseTimer: 0,
    lastCountdownInt: 0,

    // Player combat state
    playerMaxHp: 1881,
    playerHp: 1881,
    playerAtk: 739,
    playerX: 0,
    playerMoveDir: 0,
    playerStance: 'crouch',
    playerBullets: 3,

    // AI Bot combat state
    aiMaxHp: 2190,
    aiHp: 2190,
    aiAtk: 740,
    aiX: 0,
    aiTargetX: 0,
    aiStance: 'crouch',
    aiBullets: 3,
    aiAimX: 0,
    aiAimY: 1.1,
    aiShotCooldown: 0,

    // First-Person Sniper Scope state (during PLAYER_SHOOTING)
    isScoping: false,
    scopeAimX: 0,    // World X at AI plane (z = -36)
    scopeAimY: 1.25, // World Y at AI plane (z = -36)
    recoilPitch: 0,

    // Match statistics & bonus loot
    bonusCashEarned: 0,
    headshotsScored: 0,
    bodyshotsScored: 0,
    coverBlocksBroken: 0,
  };

  function updateBattleHUD() {
    const pPct = Math.max(0, (MATCH.playerHp / MATCH.playerMaxHp) * 100);
    document.getElementById('player-hp-fill').style.width = `${pPct}%`;
    document.getElementById('player-hp-text').textContent = String(Math.max(0, Math.ceil(MATCH.playerHp)));

    const aiPct = Math.max(0, (MATCH.aiHp / MATCH.aiMaxHp) * 100);
    document.getElementById('ai-hp-fill').style.width = `${aiPct}%`;
    document.getElementById('ai-hp-text').textContent = String(Math.max(0, Math.ceil(MATCH.aiHp)));

    // Render 3 rifle cartridges
    const pRack = document.getElementById('player-ammo-rack');
    const aiRack = document.getElementById('ai-ammo-rack');
    pRack.innerHTML = '';
    aiRack.innerHTML = '';

    for (let i = 0; i < 3; i++) {
      const b1 = document.createElement('div');
      b1.className = `rifle-bullet ${i >= MATCH.playerBullets ? 'spent' : ''}`;
      pRack.appendChild(b1);

      const b2 = document.createElement('div');
      b2.className = `rifle-bullet ${i >= MATCH.aiBullets ? 'spent' : ''}`;
      aiRack.appendChild(b2);
    }
  }

  function spawnTurnPickups() {
    // Clear old uncollected pickups
    groundPickups.forEach(p => worldGroup.remove(p.mesh));
    groundPickups = [];

    // Spawn 3 collectible pickups along Player's movement lane (Cash, Trophy, Medkit) just like Frame 45 & Late 12!
    const xs = [-4.6, -1.5, 1.8, 4.7];
    xs.forEach((px, idx) => {
      if (Math.random() < 0.75) {
        const type = idx === 2 && MATCH.playerHp < MATCH.playerMaxHp * 0.7 ? 'medkit' : (idx % 2 === 0 ? 'cash' : 'trophy');
        spawnGroundPickup(px + (Math.random() - 0.5) * 0.8, type);
      }
    });
  }

  // --- AI Decision Engine (Smart Cover Selection & Laser Tracking) ---
  function pickSmartAICoverSpot() {
    // Evaluate X positions in [-5.4, +5.4] to find where AI cover blocks at AI_COVER_Z are still intact
    let bestX = (Math.random() - 0.5) * 9.0;
    let bestScore = -999;

    for (let testX = -5.2; testX <= 5.2; testX += 0.65) {
      let coverCount = 0;
      for (const blk of aiCoverBlocks) {
        if (!blk.alive) continue;
        if (Math.abs(blk.x - testX) < 0.85) {
          coverCount += blk.y < 1.3 ? 2 : 1;
        }
      }
      const jitter = Math.random() * 1.5;
      if (coverCount + jitter > bestScore) {
        bestScore = coverCount + jitter;
        bestX = testX;
      }
    }

    MATCH.aiTargetX = THREE.MathUtils.clamp(bestX, -5.5, 5.5);

    // Choose crouch or prone depending on remaining cover height at bestX
    const hasHighCover = aiCoverBlocks.some(b => b.alive && Math.abs(b.x - MATCH.aiTargetX) < 0.6 && b.y > 1.0);
    MATCH.aiStance = hasHighCover ? (Math.random() < 0.7 ? 'crouch' : 'stand') : (Math.random() < 0.65 ? 'prone' : 'crouch');
  }

  // --- Phase Transitions ---
  function startPlayerHideCountdown() {
    MATCH.phase = 'PLAYER_HIDE_COUNTDOWN';
    MATCH.phaseTimer = 3.2;
    MATCH.lastCountdownInt = 4;
    MATCH.aiBullets = 3;
    MATCH.isScoping = false;

    scopeOverlay.classList.add('hidden');
    curtainWarning.classList.remove('hidden');
    dodgeControls.classList.remove('hidden');
    shootControlsHint.classList.add('hidden');
    document.getElementById('player-ammo-rack').classList.add('hidden');
    document.getElementById('ai-ammo-rack').classList.remove('hidden');

    phaseBanner.textContent = 'HIDE!';
    countdownCircle.classList.remove('hidden');

    // AI stands ready on far platform
    aiRig.stance = 'stand';
    spawnTurnPickups();
    updateBattleHUD();
  }

  function startAIShootingPhase() {
    MATCH.phase = 'AI_SHOOTING';
    MATCH.aiBullets = 3;
    MATCH.aiShotCooldown = 1.25;
    MATCH.aiAimX = MATCH.playerX + (Math.random() - 0.5) * 3.0;
    MATCH.aiAimY = 1.1;

    curtainWarning.classList.add('hidden');
    countdownCircle.classList.add('hidden');
    phaseBanner.textContent = 'ENEMY IS SHOOTING';
    updateBattleHUD();
  }

  function startAIHideCountdown() {
    MATCH.phase = 'AI_HIDE_COUNTDOWN';
    MATCH.phaseTimer = 3.0;
    MATCH.lastCountdownInt = 4;
    MATCH.playerBullets = 3;
    MATCH.isScoping = false;

    aiLaserLine.material.opacity = 0;
    aiLaserDot.material.opacity = 0;

    dodgeControls.classList.add('hidden');
    shootControlsHint.classList.remove('hidden');
    document.getElementById('ai-ammo-rack').classList.add('hidden');
    document.getElementById('player-ammo-rack').classList.remove('hidden');

    phaseBanner.textContent = 'ENEMY IS HIDING';
    countdownCircle.classList.remove('hidden');

    // Player stands up with sniper rifle ready (just like Frame 28!)
    MATCH.playerStance = 'stand';
    pickSmartAICoverSpot();
    updateBattleHUD();
  }

  function startPlayerShootingPhase() {
    MATCH.phase = 'PLAYER_SHOOTING';
    MATCH.phaseTimer = 9.5; // 9.5 seconds to fire 3 sniper shots
    countdownCircle.classList.add('hidden');
    phaseBanner.textContent = 'YOUR TURN — SNIPE!';
    updateBattleHUD();
  }

  // --- Execute a Sniper Shot (From AI -> Player OR Player -> AI) ---
  function executeAIShot() {
    if (MATCH.aiBullets <= 0 || MATCH.phase !== 'AI_SHOOTING') return;
    MATCH.aiBullets--;
    sfx.playSniperShot();
    updateBattleHUD();

    const startVec = new THREE.Vector3(MATCH.aiX, 1.55, AI_Z);

    // Difficulty accuracy scatter
    const diffSpread = STATE.aiDifficulty === 'elite' ? 0.22 : (STATE.aiDifficulty === 'pro' ? 0.48 : 0.92);
    const shotX = MATCH.aiAimX + (Math.random() - 0.5) * diffSpread;
    const shotY = MATCH.aiAimY + (Math.random() - 0.5) * (diffSpread * 0.6);

    // 1. Check if shot hits a Player Cover Block at PLAYER_COVER_Z (z = 0)
    for (const blk of playerCoverBlocks) {
      if (!blk.alive) continue;
      if (
        Math.abs(shotX - blk.x) <= blk.w * 0.54 &&
        Math.abs(shotY - blk.y) <= blk.h * 0.54
      ) {
        // Cover absorbed the sniper bullet and shattered! (Matches Frame 35 & Late 29!)
        blk.alive = false;
        blk.mesh.visible = false;
        sfx.playCoverBreak();
        const hitPos = new THREE.Vector3(shotX, shotY, PLAYER_COVER_Z);
        spawnBulletSmokeTracer(startVec, hitPos);
        spawnShatterDebris(blk.x, blk.y, PLAYER_COVER_Z, blk.colorHex, 14);
        spawnPopup(hitPos, 'BLOCKED!', 'cash');
        return;
      }
    }

    // 2. If cover didn't block it, check if shot hits Player at PLAYER_Z (z = 2.0)
    const hInfo = getStanceHeights(MATCH.playerStance);
    const dx = Math.abs(shotX - MATCH.playerX);
    const endVec = new THREE.Vector3(shotX, shotY, PLAYER_Z);
    spawnBulletSmokeTracer(startVec, endVec);

    if (dx <= 0.48 && shotY >= 0.1 && shotY <= hInfo.totalH) {
      let mult = 1.0;
      let callout = 'BODY SHOT';
      if (shotY >= hInfo.headMinY) {
        mult = 1.55;
        callout = 'HEADSHOT';
      } else if (dx > 0.3 || shotY < hInfo.bodyMinY) {
        mult = 0.68;
        callout = 'HANDSHOT';
      }

      const dmg = Math.round(MATCH.aiAtk * mult * (0.92 + Math.random() * 0.16));
      MATCH.playerHp = Math.max(0, MATCH.playerHp - dmg);
      sfx.playHitCallout(callout === 'HEADSHOT');
      showHitCallout(callout);
      spawnPopup(new THREE.Vector3(MATCH.playerX, hInfo.headMaxY, PLAYER_Z), `-${dmg}`, 'crit');
      spawnShatterDebris(MATCH.playerX, shotY, PLAYER_Z, 0xef4444, 8);
      updateBattleHUD();

      if (MATCH.playerHp <= 0) {
        endMatch(false);
      }
    } else {
      spawnPopup(endVec, 'DODGED!', 'heal');
    }
  }

  function executePlayerShot() {
    if (MATCH.playerBullets <= 0 || MATCH.phase !== 'PLAYER_SHOOTING') return;
    MATCH.playerBullets--;
    sfx.playSniperShot();
    MATCH.recoilPitch = 0.38; // Scope upward kick
    updateBattleHUD();

    const startVec = new THREE.Vector3(MATCH.playerX, 1.55, PLAYER_Z);
    const shotX = MATCH.scopeAimX;
    const shotY = MATCH.scopeAimY;

    // 1. Check if Player's bullet hits AI Cover Block at AI_COVER_Z (z = -34)
    for (const blk of aiCoverBlocks) {
      if (!blk.alive) continue;
      if (
        Math.abs(shotX - blk.x) <= blk.w * 0.52 &&
        Math.abs(shotY - blk.y) <= blk.h * 0.52
      ) {
        blk.alive = false;
        blk.mesh.visible = false;
        MATCH.coverBlocksBroken++;
        sfx.playCoverBreak();
        const hitPos = new THREE.Vector3(shotX, shotY, AI_COVER_Z);
        spawnBulletSmokeTracer(startVec, hitPos);
        spawnShatterDebris(blk.x, blk.y, AI_COVER_Z, blk.colorHex, 14);
        spawnPopup(hitPos, 'COVER SMASHED!', 'cash');
        checkPlayerTurnComplete();
        return;
      }
    }

    // 2. Check if Player's bullet hits the AI Opponent at AI_Z (z = -36)
    const hInfo = getStanceHeights(MATCH.aiStance);
    const dx = Math.abs(shotX - MATCH.aiX);
    const endVec = new THREE.Vector3(shotX, shotY, AI_Z);
    spawnBulletSmokeTracer(startVec, endVec);

    if (dx <= 0.54 && shotY >= 0.08 && shotY <= hInfo.totalH + 0.08) {
      let mult = 1.0;
      let callout = 'BODY SHOT';
      if (shotY >= hInfo.headMinY) {
        mult = 1.65;
        callout = 'HEADSHOT';
        MATCH.headshotsScored++;
      } else if (dx > 0.32 || shotY < hInfo.bodyMinY) {
        mult = 0.72;
        callout = 'HANDSHOT';
        MATCH.bodyshotsScored++;
      } else {
        MATCH.bodyshotsScored++;
      }

      const dmg = Math.round(MATCH.playerAtk * mult * (0.94 + Math.random() * 0.12));
      MATCH.aiHp = Math.max(0, MATCH.aiHp - dmg);
      sfx.playHitCallout(callout === 'HEADSHOT');
      showHitCallout(callout);
      spawnPopup(new THREE.Vector3(MATCH.aiX, hInfo.headMaxY + 0.3, AI_Z), `${dmg}`, callout === 'HEADSHOT' ? 'crit' : 'dmg');
      spawnShatterDebris(MATCH.aiX, shotY, AI_Z, 0xf43f5e, 10);
      updateBattleHUD();

      if (MATCH.aiHp <= 0) {
        endMatch(true);
        return;
      }
    } else {
      spawnShatterDebris(shotX, Math.max(0.1, shotY), AI_Z - 1, 0x94a3b8, 5);
    }

    checkPlayerTurnComplete();
  }

  function checkPlayerTurnComplete() {
    if (MATCH.playerBullets <= 0 && MATCH.phase === 'PLAYER_SHOOTING') {
      MATCH.isScoping = false;
      scopeOverlay.classList.add('hidden');
      setTimeout(() => {
        if (MATCH.active && MATCH.phase === 'PLAYER_SHOOTING') {
          startPlayerHideCountdown();
        }
      }, 950);
    }
  }

  let pendingCashReward = 0;
  let pendingTrophyReward = 0;

  function endMatch(playerWon) {
    MATCH.active = false;
    MATCH.phase = 'RESULT';
    MATCH.isScoping = false;
    scopeOverlay.classList.add('hidden');
    curtainWarning.classList.add('hidden');
    aiLaserLine.material.opacity = 0;
    aiLaserDot.material.opacity = 0;

    if (playerWon) {
      aiRig.root.rotation.x = -Math.PI / 2;
      aiRig.root.position.y = 0.25;
      spawnFirecrackerCelebration();
    } else {
      playerRig.root.rotation.x = -Math.PI / 2;
      playerRig.root.position.y = 0.25;
    }

    pendingCashReward = (playerWon ? 3500 : 1425) + MATCH.bonusCashEarned + MATCH.headshotsScored * 400;
    pendingTrophyReward = playerWon ? 35 : 15;

    setTimeout(() => {
      battleHud.classList.add('hidden');
      resultScreen.classList.remove('hidden');

      const banner = document.getElementById('result-banner');
      banner.textContent = playerWon ? 'VICTORY!' : 'DEFEAT!';
      banner.className = `result-header-banner ${playerWon ? 'win' : 'lose'}`;

      document.getElementById('result-subtitle').textContent = playerWon
        ? 'You eliminated the AI Sniper in cover combat!'
        : 'The AI Sniper zeroed in on your position!';

      document.getElementById('rew-cash').textContent = `+${pendingCashReward.toLocaleString()}`;
      document.getElementById('rew-trophies').textContent = `+${pendingTrophyReward}`;
      document.getElementById('result-summary').textContent =
        `Headshots: ${MATCH.headshotsScored} • Body/Hand Hits: ${MATCH.bodyshotsScored} • Cover Smashed: ${MATCH.coverBlocksBroken}`;
    }, 1350);
  }

  // --- Main Real-Time Game Loop ---
  function updateMatch(dt) {
    // Always update particles & tracers
    for (let i = activeParticles.length - 1; i >= 0; i--) {
      const p = activeParticles[i];
      p.life -= dt;
      if (p.life <= 0) {
        fxGroup.remove(p.mesh);
        activeParticles.splice(i, 1);
        continue;
      }
      p.vy += p.gravity * dt;
      p.mesh.position.x += p.vx * dt;
      p.mesh.position.y = Math.max(0.05, p.mesh.position.y + p.vy * dt);
      p.mesh.position.z += p.vz * dt;
      if (p.spin) {
        p.mesh.rotation.x += 6 * dt;
        p.mesh.rotation.y += 8 * dt;
      }
      p.mat.opacity = p.life / p.maxLife;
    }

    for (let i = activeTracers.length - 1; i >= 0; i--) {
      const t = activeTracers[i];
      t.life -= dt;
      if (t.life <= 0) {
        fxGroup.remove(t.mesh);
        activeTracers.splice(i, 1);
        continue;
      }
      t.mat.opacity = (t.life / t.maxLife) * 0.85;
    }

    // Rotate pickups
    for (const pk of groundPickups) {
      if (!pk.collected) {
        pk.mesh.rotation.y += 2.2 * dt;
        pk.mesh.position.y = 0.52 + Math.sin(performance.now() * 0.005 + pk.x) * 0.08;
      }
    }

    if (!MATCH.active) {
      // Idle orbit camera when on Lobby or Result screen
      const t = performance.now() * 0.0003;
      camera.position.set(Math.sin(t) * 2.5, 3.2, 8.5);
      camera.lookAt(0, 1.5, -20);
      camera.fov = 45;
      camera.updateProjectionMatrix();
      return;
    }

    // 1. Player Horizontal Movement & Stance Animation (Active during HIDE & AI_SHOOTING)
    const canPlayerMove =
      MATCH.phase === 'PLAYER_HIDE_COUNTDOWN' || MATCH.phase === 'AI_SHOOTING';
    const speedMult =
      MATCH.playerStance === 'stand' ? 5.6 : MATCH.playerStance === 'crouch' ? 4.2 : 2.8;

    const isPlayerMoving = canPlayerMove && Math.abs(MATCH.playerMoveDir) > 0.05;
    if (isPlayerMoving) {
      MATCH.playerX = THREE.MathUtils.clamp(
        MATCH.playerX + MATCH.playerMoveDir * speedMult * dt,
        -LANE_LIMIT_X,
        LANE_LIMIT_X
      );
      playerRig.root.position.x = MATCH.playerX;
      playerRig.root.rotation.y = MATCH.playerMoveDir > 0 ? Math.PI * 0.65 : Math.PI * 1.35;
    } else {
      playerRig.root.rotation.y = Math.PI;
    }

    applyRigStance(playerRig, MATCH.playerStance, isPlayerMoving, dt);

    // Check Player Pickup Collection (+25 Cash, Trophies, Medkits just like Frame 45 & Late 20!)
    for (const pk of groundPickups) {
      if (!pk.collected && Math.abs(pk.x - MATCH.playerX) < 0.72) {
        pk.collected = true;
        pk.mesh.visible = false;
        sfx.playPickup();
        const popPos = new THREE.Vector3(pk.x, 1.2, PLAYER_Z);
        if (pk.type === 'cash') {
          MATCH.bonusCashEarned += 250;
          spawnPopup(popPos, '+250 💵', 'cash');
        } else if (pk.type === 'trophy') {
          STATE.trophies += 5;
          spawnPopup(popPos, '+5 🏆', 'cash');
        } else if (pk.type === 'medkit') {
          const heal = Math.round(MATCH.playerMaxHp * 0.18);
          MATCH.playerHp = Math.min(MATCH.playerMaxHp, MATCH.playerHp + heal);
          updateBattleHUD();
          spawnPopup(popPos, `+${heal} HP`, 'heal');
        }
      }
    }

    // 2. AI Movement & Stance Animation
    const aiDist = MATCH.aiTargetX - MATCH.aiX;
    const isAIMoving = Math.abs(aiDist) > 0.12 && MATCH.phase === 'AI_HIDE_COUNTDOWN';
    if (isAIMoving) {
      MATCH.aiX += Math.sign(aiDist) * Math.min(Math.abs(aiDist), 5.0 * dt);
      aiRig.root.position.x = MATCH.aiX;
    }
    applyRigStance(
      aiRig,
      MATCH.phase === 'AI_SHOOTING' || MATCH.phase === 'PLAYER_HIDE_COUNTDOWN'
        ? 'stand'
        : MATCH.aiStance,
      isAIMoving,
      dt
    );

    // 3. Phase Timers & Logic
    if (MATCH.phase === 'PLAYER_HIDE_COUNTDOWN') {
      MATCH.phaseTimer -= dt;
      const cInt = Math.ceil(MATCH.phaseTimer);
      if (cInt !== MATCH.lastCountdownInt && cInt >= 1 && cInt <= 3) {
        MATCH.lastCountdownInt = cInt;
        countdownCircle.textContent = String(cInt);
        sfx.playCountdownBeep(false);
      }
      if (MATCH.phaseTimer <= 0) {
        sfx.playCountdownBeep(true);
        startAIShootingPhase();
      }
    } else if (MATCH.phase === 'AI_SHOOTING') {
      // AI tracks player with Red Sniper Laser Beam!
      const trackSpeed = STATE.aiDifficulty === 'elite' ? 4.8 : STATE.aiDifficulty === 'pro' ? 3.2 : 1.9;
      const pHeights = getStanceHeights(MATCH.playerStance);
      const desiredY = (pHeights.bodyMinY + pHeights.headMaxY) * 0.52;

      MATCH.aiAimX += (MATCH.playerX - MATCH.aiAimX) * Math.min(1, dt * trackSpeed);
      MATCH.aiAimY += (desiredY - MATCH.aiAimY) * Math.min(1, dt * trackSpeed);

      if (STATE.showLaser) {
        const startV = new THREE.Vector3(MATCH.aiX, 1.55, AI_Z);
        const endV = new THREE.Vector3(MATCH.aiAimX, MATCH.aiAimY, PLAYER_COVER_Z);
        aiLaserLine.geometry.setFromPoints([startV, endV]);
        aiLaserLine.material.opacity = 0.85;
        aiLaserDot.position.copy(endV);
        aiLaserDot.material.opacity = 0.95;
      }

      MATCH.aiShotCooldown -= dt;
      if (MATCH.aiShotCooldown <= 0) {
        executeAIShot();
        if (MATCH.aiBullets > 0 && MATCH.phase === 'AI_SHOOTING') {
          MATCH.aiShotCooldown = 1.35;
        } else if (MATCH.phase === 'AI_SHOOTING') {
          setTimeout(() => {
            if (MATCH.active && MATCH.phase === 'AI_SHOOTING') {
              startAIHideCountdown();
            }
          }, 900);
        }
      }
    } else if (MATCH.phase === 'AI_HIDE_COUNTDOWN') {
      MATCH.phaseTimer -= dt;
      const cInt = Math.ceil(MATCH.phaseTimer);
      if (cInt !== MATCH.lastCountdownInt && cInt >= 1 && cInt <= 3) {
        MATCH.lastCountdownInt = cInt;
        countdownCircle.textContent = String(cInt);
        sfx.playCountdownBeep(false);
      }
      if (MATCH.phaseTimer <= 0) {
        sfx.playCountdownBeep(true);
        startPlayerShootingPhase();
      }
    } else if (MATCH.phase === 'PLAYER_SHOOTING') {
      // Occasionally AI shifts slightly behind cover ifPro/Elite
      MATCH.phaseTimer -= dt;
      if (MATCH.phaseTimer <= 0) {
        MATCH.isScoping = false;
        scopeOverlay.classList.add('hidden');
        startPlayerHideCountdown();
      }
    }

    // 4. Camera Controller (3rd-Person Dodge View vs First-Person Zoomed Sniper Scope!)
    if (MATCH.recoilPitch > 0) {
      MATCH.recoilPitch = Math.max(0, MATCH.recoilPitch - dt * 1.8);
    }

    if (MATCH.phase === 'PLAYER_SHOOTING' && MATCH.isScoping) {
      // Zoomed Sniper Scope Camera (Matches Frame 30, 50, Late 16)
      camera.fov += (13 - camera.fov) * Math.min(1, dt * 14);
      camera.updateProjectionMatrix();

      camera.position.set(MATCH.playerX * 0.3, 1.65, PLAYER_Z - 1.2);
      camera.lookAt(
        MATCH.scopeAimX,
        MATCH.scopeAimY + MATCH.recoilPitch * 1.8,
        AI_Z
      );
      playerRig.root.visible = false;
    } else {
      // 3rd-Person Behind-the-Back Tactical Camera (Matches Frame 28, 35, 45)
      playerRig.root.visible = true;
      camera.fov += (46 - camera.fov) * Math.min(1, dt * 10);
      camera.updateProjectionMatrix();

      const camTargetX = MATCH.playerX * 0.72;
      const camTargetY = MATCH.phase === 'AI_HIDE_COUNTDOWN' ? 2.45 : 3.25;
      const camTargetZ = MATCH.phase === 'AI_HIDE_COUNTDOWN' ? PLAYER_Z + 4.8 : PLAYER_Z + 6.4;

      camera.position.x += (camTargetX - camera.position.x) * Math.min(1, dt * 8);
      camera.position.y += (camTargetY - camera.position.y) * Math.min(1, dt * 8);
      camera.position.z += (camTargetZ - camera.position.z) * Math.min(1, dt * 8);

      camera.lookAt(MATCH.playerX * 0.45, 1.15, -14);
    }
  }

  // --- Lobby & UI Wiring ---
  function renderLobbyUI() {
    document.getElementById('lobby-trophies').textContent = STATE.trophies.toLocaleString();
    document.getElementById('lobby-cash').textContent = STATE.cash.toLocaleString();
    document.getElementById('lobby-gems').textContent = STATE.gems.toLocaleString();

    const nextGoal = Math.ceil((STATE.trophies + 1) / 100) * 100;
    document.getElementById('chest-prog-text').textContent = `${STATE.trophies}/${nextGoal}`;

    const segBar = document.getElementById('chest-seg-bar');
    segBar.innerHTML = '';
    const filledCount = Math.floor(((STATE.trophies % 100) / 100) * 16);
    for (let i = 0; i < 16; i++) {
      const pip = document.createElement('div');
      pip.className = `seg-pip ${i <= filledCount ? 'filled' : ''}`;
      segBar.appendChild(pip);
    }

    // Arena Selector Card
    const arena = ARENAS[STATE.selectedArenaIdx];
    document.getElementById('arena-area-tag').textContent = arena.areaTag;
    document.getElementById('arena-name').textContent = arena.name;
    document.getElementById('arena-ai-tag').textContent =
      `🤖 AI Opponent: ${arena.aiBot.name} ${arena.aiBot.flag}`;

    const artEl = document.getElementById('arena-preview-art');
    artEl.style.background = `linear-gradient(180deg, ${arena.skyTop} 0%, ${arena.skyBot} 65%, #334155 100%)`;

    // Gear Tab Values
    const lvlStr = `LV.${STATE.gearLevel}`;
    ['helmet', 'vest', 'pants', 'rifle', 'gloves', 'boots'].forEach(slot => {
      document.getElementById(`lvl-${slot}`).textContent = lvlStr;
    });
    document.getElementById('gear-atk-val').textContent = String(STATE.atk);
    document.getElementById('gear-hp-val').textContent = String(STATE.hp);

    buildArenaScene(arena);
  }

  // Tab Switching (Battle vs Gear)
  document.querySelectorAll('.nav-item[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-item[data-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.getElementById('tab-battle').classList.toggle('hidden', tab !== 'battle');
      document.getElementById('tab-gear').classList.toggle('hidden', tab !== 'gear');
      sfx.playPickup();
    });
  });

  document.getElementById('btn-prev-arena').addEventListener('click', () => {
    STATE.selectedArenaIdx = (STATE.selectedArenaIdx - 1 + ARENAS.length) % ARENAS.length;
    sfx.playPickup();
    renderLobbyUI();
  });

  document.getElementById('btn-next-arena').addEventListener('click', () => {
    STATE.selectedArenaIdx = (STATE.selectedArenaIdx + 1) % ARENAS.length;
    sfx.playPickup();
    renderLobbyUI();
  });

  // Gear Upgrades & Free Cash
  document.getElementById('btn-upgrade-atk').addEventListener('click', () => {
    if (STATE.cash >= 2500) {
      STATE.cash -= 2500;
      STATE.atk += 65;
      STATE.gearLevel++;
      saveState();
      renderLobbyUI();
      sfx.playHitCallout(true);
    }
  });

  document.getElementById('btn-upgrade-hp').addEventListener('click', () => {
    if (STATE.cash >= 2500) {
      STATE.cash -= 2500;
      STATE.hp += 180;
      STATE.gearLevel++;
      saveState();
      renderLobbyUI();
      sfx.playHitCallout(true);
    }
  });

  document.getElementById('btn-free-cash').addEventListener('click', () => {
    STATE.cash += 5000;
    saveState();
    renderLobbyUI();
    sfx.playPickup();
  });

  document.getElementById('btn-claim-chest').addEventListener('click', () => {
    STATE.cash += 3000;
    STATE.gems += 5;
    saveState();
    renderLobbyUI();
    sfx.playHitCallout(true);
  });

  // Start Matchmaking -> Globe Radar -> VS Screen -> Battle! (Matches Frame 24-27)
  document.getElementById('btn-start-match').addEventListener('click', () => {
    sfx.playPickup();
    const arena = ARENAS[STATE.selectedArenaIdx];
    buildArenaScene(arena);

    lobbyScreen.classList.add('hidden');
    matchmakingScreen.classList.remove('hidden');

    const mmTitle = document.getElementById('mm-status-title');
    const globeWrap = document.getElementById('mm-globe-wrap');
    const vsCards = document.getElementById('mm-vs-cards');

    mmTitle.textContent = 'Finding an opponent...';
    globeWrap.classList.remove('hidden');
    vsCards.classList.add('hidden');

    setTimeout(() => {
      mmTitle.textContent = 'Opponent found...';
      sfx.playCountdownBeep(false);
    }, 700);

    setTimeout(() => {
      mmTitle.textContent = 'Starting a match...';
      globeWrap.classList.add('hidden');
      vsCards.classList.remove('hidden');

      document.getElementById('vs-p-trophy').textContent = STATE.trophies.toLocaleString();
      document.getElementById('vs-p-atk').textContent = STATE.atk.toLocaleString();
      document.getElementById('vs-p-hp').textContent = STATE.hp.toLocaleString();

      document.getElementById('vs-ai-Emoji').textContent = arena.aiBot.emoji;
      document.getElementById('vs-ai-flag').textContent = arena.aiBot.flag;
      document.getElementById('vs-ai-name').textContent = arena.aiBot.name;
      document.getElementById('vs-ai-trophy').textContent = arena.aiBot.trophies.toLocaleString();
      document.getElementById('vs-ai-atk').textContent = arena.aiBot.baseAtk.toLocaleString();
      document.getElementById('vs-ai-hp').textContent = arena.aiBot.baseHp.toLocaleString();
      sfx.playCountdownBeep(true);
    }, 1400);

    setTimeout(() => {
      matchmakingScreen.classList.add('hidden');
      battleHud.classList.remove('hidden');

      document.getElementById('hud-ai-name').textContent = `${arena.aiBot.name} ${arena.aiBot.flag}`;
      document.getElementById('hud-ai-portrait').textContent = arena.aiBot.emoji;

      // Initialize Match Stats
      MATCH.active = true;
      MATCH.playerMaxHp = STATE.hp;
      MATCH.playerHp = STATE.hp;
      MATCH.playerAtk = STATE.atk;
      MATCH.playerX = 0;
      MATCH.playerMoveDir = 0;
      MATCH.playerStance = 'crouch';

      MATCH.aiMaxHp = arena.aiBot.baseHp;
      MATCH.aiHp = arena.aiBot.baseHp;
      MATCH.aiAtk = arena.aiBot.baseAtk;
      MATCH.aiX = 0;
      MATCH.aiTargetX = 0;
      MATCH.aiStance = 'crouch';

      MATCH.bonusCashEarned = 0;
      MATCH.headshotsScored = 0;
      MATCH.bodyshotsScored = 0;
      MATCH.coverBlocksBroken = 0;

      startPlayerHideCountdown();
    }, 2650);
  });

  // Result Claim Buttons
  function claimMatchRewards(mult = 1) {
    STATE.cash += pendingCashReward * mult;
    STATE.trophies += pendingTrophyReward * mult;
    saveState();
    sfx.playPickup();
    resultScreen.classList.add('hidden');
    lobbyScreen.classList.remove('hidden');
    renderLobbyUI();
  }

  document.getElementById('btn-claim-normal').addEventListener('click', () => claimMatchRewards(1));
  document.getElementById('btn-claim-x2').addEventListener('click', () => claimMatchRewards(2));

  // Settings Modal
  document.getElementById('btn-open-settings').addEventListener('click', () => {
    settingsDialog.showModal();
  });

  document.getElementById('chk-sfx').addEventListener('change', (e) => {
    sfx.enabled = e.target.checked;
  });

  document.getElementById('sel-ai-diff').addEventListener('change', (e) => {
    STATE.aiDifficulty = e.target.value;
  });

  document.getElementById('chk-laser').addEventListener('change', (e) => {
    STATE.showLaser = e.target.checked;
  });

  // --- Stance Selector Buttons ---
  document.querySelectorAll('.stance-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.stance-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      MATCH.playerStance = btn.dataset.stance;
      sfx.playPickup();
    });
  });

  // --- Dodge Movement Controls (Buttons, Virtual Joystick Drag, Keyboard A/D/Arrows) ---
  const btnLeft = document.getElementById('btn-move-left');
  const btnRight = document.getElementById('btn-move-right');
  const joyZone = document.getElementById('joystick-zone');
  const joyKnob = document.getElementById('joystick-knob');

  btnLeft.addEventListener('pointerdown', (e) => { e.stopPropagation(); MATCH.playerMoveDir = -1; });
  btnLeft.addEventListener('pointerup', () => { MATCH.playerMoveDir = 0; });
  btnLeft.addEventListener('pointerleave', () => { MATCH.playerMoveDir = 0; });

  btnRight.addEventListener('pointerdown', (e) => { e.stopPropagation(); MATCH.playerMoveDir = 1; });
  btnRight.addEventListener('pointerup', () => { MATCH.playerMoveDir = 0; });
  btnRight.addEventListener('pointerleave', () => { MATCH.playerMoveDir = 0; });

  let joyDragging = false;
  let joyStartX = 0;

  joyZone.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    joyDragging = true;
    joyStartX = e.clientX;
    joyZone.setPointerCapture(e.pointerId);
  });

  joyZone.addEventListener('pointermove', (e) => {
    if (!joyDragging) return;
    const dx = e.clientX - joyStartX;
    const clamped = THREE.MathUtils.clamp(dx, -65, 65);
    joyKnob.style.transform = `translateX(${clamped}px)`;
    MATCH.playerMoveDir = clamped / 55;
  });

  const endJoyDrag = () => {
    joyDragging = false;
    joyKnob.style.transform = 'translateX(0px)';
    MATCH.playerMoveDir = 0;
  };
  joyZone.addEventListener('pointerup', endJoyDrag);
  joyZone.addEventListener('pointercancel', endJoyDrag);

  // Keyboard Controls (A/D or Left/Right to Move; 1/2/3 or W/S for Stance)
  const keysDown = new Set();
  window.addEventListener('keydown', (e) => {
    if (settingsDialog.open) return;
    keysDown.add(e.code);
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') MATCH.playerMoveDir = -1;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') MATCH.playerMoveDir = 1;

    if (e.code === 'Digit1' || e.code === 'KeyW') {
      document.querySelector('.stance-btn[data-stance="stand"]').click();
    } else if (e.code === 'Digit2' || e.code === 'KeyS') {
      document.querySelector('.stance-btn[data-stance="crouch"]').click();
    } else if (e.code === 'Digit3' || e.code === 'KeyC') {
      document.querySelector('.stance-btn[data-stance="prone"]').click();
    }
  });

  window.addEventListener('keyup', (e) => {
    keysDown.delete(e.code);
    if (
      (e.code === 'ArrowLeft' || e.code === 'KeyA') &&
      !keysDown.has('ArrowRight') &&
      !keysDown.has('KeyD')
    ) {
      MATCH.playerMoveDir = 0;
    }
    if (
      (e.code === 'ArrowRight' || e.code === 'KeyD') &&
      !keysDown.has('ArrowLeft') &&
      !keysDown.has('KeyA')
    ) {
      MATCH.playerMoveDir = 0;
    }
  });

  // --- First-Person Sniper Scope Aim & Release-to-Shoot on 3D Canvas ---
  let pointerStartX = 0;
  let pointerStartY = 0;
  let scopeStartAimX = 0;
  let scopeStartAimY = 1.2;

  canvasWrap.addEventListener('pointerdown', (e) => {
    if (!MATCH.active) return;

    if (MATCH.phase === 'PLAYER_SHOOTING' && MATCH.playerBullets > 0) {
      MATCH.isScoping = true;
      scopeOverlay.classList.remove('hidden');
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      // Start crosshair near center or previous aim
      scopeStartAimX = MATCH.scopeAimX;
      scopeStartAimY = MATCH.scopeAimY;
      canvasWrap.setPointerCapture(e.pointerId);
    } else if (MATCH.phase === 'PLAYER_HIDE_COUNTDOWN' || MATCH.phase === 'AI_SHOOTING') {
      // Allow dragging directly on the 3D scene to run Left/Right during Dodge phase too!
      joyDragging = true;
      joyStartX = e.clientX;
    }
  });

  canvasWrap.addEventListener('pointermove', (e) => {
    if (!MATCH.active) return;

    if (MATCH.phase === 'PLAYER_SHOOTING' && MATCH.isScoping) {
      const dx = e.clientX - pointerStartX;
      const dy = e.clientY - pointerStartY;
      const sensitivityX = 0.032;
      const sensitivityY = 0.022;

      MATCH.scopeAimX = THREE.MathUtils.clamp(scopeStartAimX + dx * sensitivityX, -6.5, 6.5);
      MATCH.scopeAimY = THREE.MathUtils.clamp(scopeStartAimY - dy * sensitivityY, 0.15, 3.2);
    } else if (joyDragging && (MATCH.phase === 'PLAYER_HIDE_COUNTDOWN' || MATCH.phase === 'AI_SHOOTING')) {
      const dx = e.clientX - joyStartX;
      MATCH.playerMoveDir = THREE.MathUtils.clamp(dx / 45, -1, 1);
    }
  });

  canvasWrap.addEventListener('pointerup', () => {
    if (MATCH.phase === 'PLAYER_SHOOTING' && MATCH.isScoping) {
      executePlayerShot();
      if (MATCH.playerBullets <= 0) {
        MATCH.isScoping = false;
        scopeOverlay.classList.add('hidden');
      }
    }
    if (joyDragging) {
      joyDragging = false;
      MATCH.playerMoveDir = 0;
    }
  });

  // --- Resize & Boot ---
  function onResize() {
    const rect = canvasWrap.getBoundingClientRect();
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(rect.width, rect.height);
  }
  window.addEventListener('resize', onResize);

  renderLobbyUI();
  onResize();

  let lastTime = performance.now();
  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    updateMatch(dt);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
})();
