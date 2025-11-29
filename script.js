const questions = [
  {
    axis: "Combat Style",
    key: "combat",
    options: [
      "I enjoy diving straight into combat and dealing massive damage.",
      "I like planning my attacks to trigger the best elemental reactions.",
      "I prefer being in the thick of the fight rather than supporting from afar.",
    ],
    letters: ["A", "S"],
  },
  {
    axis: "Gameplay Priority",
    key: "gameplay",
    options: [
      "I get excited when tackling bosses, domains, or Spiral Abyss challenges.",
      "I love exploring every corner of Teyvat, finding hidden treasures and secrets.",
      "Completing events, quests, and side content around the world is more fun than challenging battles.",
    ],
    letters: ["D", "E"],
  },
  {
    axis: "Approach",
    key: "approach",
    options: [
      "I like experimenting with different team compositions and improvising strategies.",
      "I enjoy carefully planning builds, artifacts, and team synergy for maximum efficiency.",
      "I often try unconventional combos or “fun” strategies just for enjoyment.",
    ],
    letters: ["F", "P"],
  },
  {
    axis: "Lore Engagement",
    key: "lore",
    options: [
      "I focus on understanding the official story, character quests, and worldbuilding.",
      "I enjoy creating or following fan theories, memes, and alternate universe (AU) ideas.",
      "I pay attention to in-game lore and canonical details more than community headcanons.",
    ],
    letters: ["C", "N"],
  },
];

const results = {
  ADFC: "Aggressive Dungeon Freeform Canonist – You smash through bosses for fun while staying true to the official lore.",
  ADFN: "Aggressive Dungeon Freeform Non-Canon – You charge into domains while enjoying fan theories and wild headcanons.",
  ADPC: "Aggressive Dungeon Planned Canonist – You dominate Abyss floors with careful planning, keeping story accuracy in mind.",
  ADPN: "Aggressive Dungeon Planned Non-Canon – You meticulously tackle challenges while indulging in AU content and memes.",
  AEFC: "Aggressive Explorer Freeform Canonist – You explore Teyvat freely, enjoying the world as it’s meant to be.",
  AEFN: "Aggressive Explorer Freeform Non-Canon – You roam Teyvat and let fanon and memes guide your journey.",
  AEPC: "Aggressive Explorer Planned Canonist – You chart out your exploration for maximum efficiency while following the story.",
  AEPN: "Aggressive Explorer Planned Non-Canon – You plan every adventure while embracing headcanons and fan culture.",
  SDFC: "Strategic Dungeon Freeform Canonist – You thoughtfully tackle domains while staying true to the lore.",
  SDFN: "Strategic Dungeon Freeform Non-Canon – You approach bosses with strategy while enjoying AU and fan theories.",
  SDPC: "Strategic Dungeon Planned Canonist – You dominate Abyss with precision, respecting the story’s details.",
  SDPN: "Strategic Dungeon Planned Non-Canon – You meticulously plan every challenge while indulging in fan content.",
  SEFC: "Strategic Explorer Freeform Canonist – You roam freely but pay attention to lore and worldbuilding.",
  SEFN: "Strategic Explorer Freeform Non-Canon – You explore creatively, guided by memes and headcanons.",
  SEPC: "Strategic Explorer Planned Canonist – You explore methodically with story accuracy as your compass.",
  SEPN: "Strategic Explorer Planned Non-Canon – You carefully explore while reveling in fan theories and AU adventures.",
};

const scale = [
  "Strongly Agree",
  "Agree",
  "Somewhat Agree",
  "Somewhat Disagree",
  "Disagree",
];
const scaleWeights = [2, 1, 0.5, 0.5, 1, 2]; // weighted mapping, will use index 0-4

let currentQuestionIndex = 0;
let answers = { combat: 0, gameplay: 0, approach: 0, lore: 0 };
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

function selectAnswer(axisIndex, letters, scaleIndex) {
  const firstLetter = letters[0];
  const secondLetter = letters[1];
  if (scaleIndex <= 2) {
    // leaning toward first letter
    totalCounts[questions[axisIndex].key][firstLetter] +=
      scaleWeights[scaleIndex];
  } else {
    // leaning toward second letter
    totalCounts[questions[axisIndex].key][secondLetter] +=
      scaleWeights[scaleIndex];
  }
  currentQuestionIndex++;
  if (currentQuestionIndex >= 12) {
    showResults();
  } else {
    renderQuestion();
  }
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
  document.getElementById("type").innerText = type;
  document.getElementById("description").innerText = results[type];

  // show bar chart
  const barsDiv = document.getElementById("bars");
  barsDiv.innerHTML = "";
  for (let key in totalCounts) {
    const letters = Object.keys(totalCounts[key]);
    const total = totalCounts[key][letters[0]] + totalCounts[key][letters[1]];
    const percent1 = ((totalCounts[key][letters[0]] / total) * 100).toFixed(0);
    const percent2 = ((totalCounts[key][letters[1]] / total) * 100).toFixed(0);
    barsDiv.innerHTML += `
      <div class="bar-label">${letters[0]}: ${percent1}% | ${letters[1]}: ${percent2}%</div>
      <div class="bar-container">
        <div class="bar" style="width:${percent1}%;"></div>
        <div class="bar" style="width:${percent2}%; background:#f39c12;"></div>
      </div>
    `;
  }
}

renderQuestion();
