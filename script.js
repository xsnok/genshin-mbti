const questions = [
  {
    axis: "Combat Style",
    key: "combat",
    options: [
      "I enjoy diving straight into combat and dealing massive damage.",
      "I dislike planning my attacks to trigger the best elemental reactions.",
      "I prefer being in the thick of the fight rather than supporting from afar.",
    ],
    letters: ["A", "S"],
  },
  {
    axis: "Gameplay Priority",
    key: "gameplay",
    options: [
      "I get excited when tackling bosses, domains, or Spiral Abyss challenges.",
      "I exploring is boring, I find fighting more engaging than finding hidden treasures and secrets.",
      "Completing events, quests, and side content is less fun than challenging battles.",
    ],
    letters: ["D", "E"],
  },
  {
    axis: "Approach",
    key: "approach",
    options: [
      "I like experimenting with different team compositions.",
      "I enjoy carefully planning builds and team synergy.",
      "I try unconventional combos or fun strategies.",
    ],
    letters: ["F", "P"],
  },
  {
    axis: "Lore Engagement",
    key: "lore",
    options: [
      "I focus on understanding the official story.",
      "I enjoy learning about official lore fan theories, memes, fanfics, etc.",
      "I pay attention to canonical in-game lore.",
    ],
    letters: ["C", "N"],
  },
];

const results = {
  ADFC: "Aggressive Dungeon Freeform Canonist - You smash through bosses for fun while staying true to the official lore.",
  ADFN: "Aggressive Dungeon Freeform Non-Canon - You charge into domains while enjoying fan theories.",
  ADPC: "Aggressive Dungeon Planned Canonist - You carefully plan your attacks and combos in dungeons, always following canon lore.",
  ADPN: "Aggressive Dungeon Planned Non-Canon - You meticulously plan your dungeon runs but add your own fannon flair.",
  AEFC: "Aggressive Explorer Freeform Canonist - You roam Teyvat at full speed, chasing monsters and treasures while respecting the world’s lore.",
  AEFN: "Aggressive Explorer Freeform Non-Canon - You explore every corner with reckless abandon, enjoying your own fan-created adventures.",
  AEPC: "Aggressive Explorer Planned Canonist - You chart your exploration route carefully, following lore-based priorities.",
  AEPN: "Aggressive Explorer Planned Non-Canon - You plan your travels but like to throw in surprises and personal lore tweaks along the way.",
  SDFC: "Strategic Dungeon Freeform Canonist - You enter domains with precision, adapting on the fly while honoring official lore.",
  SDFN: "Strategic Dungeon Freeform Non-Canon - You strategize in dungeons but love experimenting with unconventional approaches to the story.",
  SDPC: "Strategic Dungeon Planned Canonist - You calculate every move in domains in cannon order.",
  SDPN: "Strategic Dungeon Planned Non-Canon - You make careful plans but enjoy bending the rules when it comes to characters.",
  SEFC: "Strategic Explorer Freeform Canonist - You explore methodically but adjust as needed, always staying true to lore.",
  SEFN: "Strategic Explorer Freeform Non-Canon - You explore with flexibility and creativity, making your own Teyvat adventures.",
  SEPC: "Strategic Explorer Planned Canonist - You plan every step of your exploration with the canon story in mind.",
  SEPN: "Strategic Explorer Planned Non-Canon - You map out exploration carefully but like to add your personal spin on the journey.",
};

const themes = {
  A: { main: "#ff5733", accent: "#ff9a7a", glow: "rgba(255,120,75,0.7)" },
  S: { main: "#7fc6ff", accent: "#b5e1ff", glow: "rgba(120,200,255,0.7)" },
  D: { main: "#e2c877", accent: "#ffe8a0", glow: "rgba(240,210,100,0.7)" },
  E: { main: "#66cc77", accent: "#99e2a7", glow: "rgba(120,230,140,0.7)" },
  F: { main: "#b37fff", accent: "#d0afff", glow: "rgba(180,120,255,0.7)" },
  P: { main: "#3fb8c8", accent: "#89e2eb", glow: "rgba(90,210,220,0.7)" },
  C: { main: "#d8c470", accent: "#f0e3a0", glow: "rgba(240,220,120,0.7)" },
  N: { main: "#6bd7c9", accent: "#a8efe8", glow: "rgba(120,250,230,0.7)" },
};

const scale = [
  "Strongly Agree",
  "Agree",
  "Somewhat Agree",
  "Somewhat Disagree",
  "Disagree",
  "Strongly Disagree",
];

const scaleWeights = [2, 1, 0.5, 0.5, 1, 2];

let currentQuestionIndex = 0;
let totalCounts = {
  combat: { A: 0, S: 0 },
  gameplay: { D: 0, E: 0 },
  approach: { F: 0, P: 0 },
  lore: { C: 0, N: 0 },
};

const questionContainer = document.getElementById("question-container");
const optionsContainer = document.getElementById("options-container");
const progress = document.getElementById("progress");

function renderQuestion() {
  const qIndex = Math.floor(currentQuestionIndex / 3);
  const axis = questions[qIndex];
  const qNum = currentQuestionIndex % 3;

  questionContainer.innerHTML = `<div class="question"><strong>${axis.axis}:</strong> ${axis.options[qNum]}</div>`;
  optionsContainer.innerHTML = "";

  scale.forEach((label, i) => {
    const btn = document.createElement("button");
    btn.innerText = label;
    btn.onclick = () => selectAnswer(qIndex, axis.letters, i);
    optionsContainer.appendChild(btn);
  });

  progress.style.width = `${(currentQuestionIndex / 12) * 100}%`;
}

function updateTheme() {
  let combo = "";
  for (let axis in totalCounts) {
    const letters = Object.keys(totalCounts[axis]);
    const winner =
      totalCounts[axis][letters[0]] >= totalCounts[axis][letters[1]]
        ? letters[0]
        : letters[1];
    combo += winner;
  }
  const dominant = combo[combo.length - 1];
  const t = themes[dominant];

  document.documentElement.style.setProperty("--theme-main", t.main);
  document.documentElement.style.setProperty("--theme-accent", t.accent);
  document.documentElement.style.setProperty("--theme-glow", t.glow);
}

function selectAnswer(axisIndex, letters, scaleIndex) {
  document.querySelector(".container").classList.add("dissolve-out");

  setTimeout(() => {
    document.querySelector(".container").classList.remove("dissolve-out");

    const first = letters[0];
    const second = letters[1];

    if (scaleIndex <= 2) {
      totalCounts[questions[axisIndex].key][first] += scaleWeights[scaleIndex];
    } else {
      totalCounts[questions[axisIndex].key][second] += scaleWeights[scaleIndex];
    }

    updateTheme();
    currentQuestionIndex++;

    if (currentQuestionIndex >= 12) showResults();
    else renderQuestion();
  }, 450);
}

function showResults() {
  document.getElementById("quiz").style.display = "none";
  const resultContainer = document.getElementById("result-container");
  resultContainer.style.display = "block";

  let type = "";
  for (let key in totalCounts) {
    const letters = Object.keys(totalCounts[key]);
    type +=
      totalCounts[key][letters[0]] >= totalCounts[key][letters[1]]
        ? letters[0]
        : letters[1];
  }

  const t = themes[type[0]];
  document.documentElement.style.setProperty("--theme-main", t.main);
  document.documentElement.style.setProperty("--theme-accent", t.accent);
  document.documentElement.style.setProperty("--theme-glow", t.glow);

  document.getElementById("type").innerText = type;
  document.getElementById("description").innerText = results[type];

  const barsDiv = document.getElementById("bars");
  barsDiv.innerHTML = "";

  for (let key in totalCounts) {
    const letters = Object.keys(totalCounts[key]);
    const total = totalCounts[key][letters[0]] + totalCounts[key][letters[1]];
    const percent1 = ((totalCounts[key][letters[0]] / total) * 100).toFixed(0);

    barsDiv.innerHTML += `
      <div class="bar-label">${letters[0]}: ${percent1}% | ${letters[1]}: ${
      100 - percent1
    }%</div>
      <div class="bar-container">
        <div class="bar" style="--final-width:${percent1}%"></div>
      </div>`;
  }
}

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const particles = [];
for (let i = 0; i < 70; i++) {
  particles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2 + 1,
    d: Math.random() * 1 + 0.2,
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "white";

  particles.forEach((p) => {
    ctx.globalAlpha = 0.25 * p.r;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    p.y += p.d;
    if (p.y > h) {
      p.y = 0;
      p.x = Math.random() * w;
    }
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();

renderQuestion();
updateTheme();

renderQuestion();
