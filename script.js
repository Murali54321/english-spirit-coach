const levels = [];
let userData = {
  xp: 0,
  streak: 0,
  lastPracticeDate: null,
  progress: {}
};

async function loadLevels() {
  for (let i = 1; i <= 5; i++) {
 const res = await fetch('content/level-' + i + '.json');
    const data = await res.json();
    levels.push(data);
  }
}

async function init() {
  loadFromStorage();
  await loadLevels();
  renderHome();
  setupHandlers();
  updateStreak();
}

function setupHandlers() {
  document.getElementById('exportBtn').addEventListener('click', exportProgress);
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', importProgress);
 document.getElementById('backHome').addEventListener('click', () => {
    document.getElementById('lessonView').style.display = 'none';
    document.getElementById('homeView').style.display = 'block';
    renderHome();
  });
  document.getElementById('prevExercise').addEventListener('click', () => {
    if (currentExerciseIndex > 0) {
      currentExerciseIndex--;
      renderExercise();
    }
  });
  document.getElementById('nextExercise').addEventListener('click', () => {
    nextExercise();
  });
}

function renderHome() {
  const container = document.getElementById('levelsContainer');
  container.innerHTML = '';
  levels.forEach((lvl, idx) => {
    const card = document.createElement('div');
    card.className = 'level-card';
    const progress = userData.progress[lvl.level] || {completed: 0};
    const unlocked = idx === 0 || (userData.progress[idx] && (userData.progress[idx].completed / levels[idx-0].lessons.length >= 0.8));
    if (!unlocked) card.classList.add('locked');
    card.innerHTML = '<h3>' + lvl.name + '</h3>' +
      '<p>Level ' + lvl.level + '</p>' +
      '<p>' + (progress.completed || 0) + ' / ' + lvl.lessons.length + ' lessons completed</p>';
    if (unlocked) {
      card.addEventListener('click', () => startLevel(lvl.level));
 }
    container.appendChild(card);
  });
  document.getElementById('streakInfo').textContent = 'Streak: ' + userData.streak + ' days | XP: ' + userData.xp;
}

function startLevel(levelNum) {
  const lvl = levels.find(l => l.level === levelNum);
  const userLevel = userData.progress[levelNum] || {completedLessons: []};
  let nextLessonIdx = userLevel.completedLessons ? userLevel.completedLessons.length : 0;
  if (nextLessonIdx >= lvl.lessons.length) nextLessonIdx = 0;
  startLesson(levelNum, nextLessonIdx);
}

let currentExercises = [];
let currentExerciseIndex = 0;
let currentLevelNum = 1;
let currentLessonIndex = 0;

function startLesson(levelNum, lessonIdx) {
  currentLevelNum = levelNum;
  currentLessonIndex = lessonIdx;
  const level = levels.find(l => l.level === levelNum);
  const lesson = level.lessons[lessonIdx];
  currentExercises = buildExercises(lesson);
  currentExerciseIndex = 0;
  renderExercise();
  document.getElementById('homeView').style.display = 'none';
  document.getElementById('lessonView').style.display = 'block';
  document.getElementById('lessonTitle').textContent = level.name + ' - Lesson ' + (lessonIdx + 1);
}

function buildExercises(lesson) {
  return [
    { type: 'reading', content: lesson.passage, quote: lesson.quote, vocab: lesson.vocab },
    { type: 'listening', text: lesson.passage },
    { type: 'speaking', prompt: lesson.speakingPrompt },
    { type: 'writing', prompt: lesson.writingPrompt, vocab: lesson.vocab }
  ];
}

function renderExercise() {
  const ex = currentExercises[currentExerciseIndex];
  const container = document.getElementById('exerciseContainer');
  container.innerHTML = '';
  document.getElementById('prevExercise').disabled = currentExerciseIndex === 0;
  if (!ex) return;
  switch (ex.type) {
    case 'reading':
      container.innerHTML = '<h3>Reading</h3><p>' + ex.content + '</p><blockquote>' + ex.quote + '</blockquote><p><strong>Key words:</strong> ' + ex.vocab.join(', ') + '</p>';
      break;
    case 'listening':
      container.innerHTML = '<h3>Listening</h3><p>Click play to listen to the passage.</p><button id="playAudio">Play</button>';
      setTimeout(() => {
        document.getElementById('playAudio').addEventListener('click', () => playText(ex.text));
      }, 50);
      break;
    case 'speaking':
      container.innerHTML = '<h3>Speaking</h3><p>' + ex.prompt + '</p><button id="startRec">Start Recording</button><p id="speechResult"></p>';
      setTimeout(() => {
 document.getElementById('startRec').addEventListener('click', startRecording);
      }, 50);
      break;
    case 'writing':
      container.innerHTML = '<h3>Writing</h3><p>' + ex.prompt + '</p><textarea id="writingInput" placeholder="Write your response..."></textarea><button id="submitWriting">Submit</button><p id="writingFeedback"></p>';
      setTimeout(() => {
        document.getElementById('submitWriting').addEventListener('click', () => {
          const text = document.getElementById('writingInput').value.trim();
          if (text.length < 50) {
            document.getElementById('writingFeedback').textContent = 'Please write at least 50 characters.';
            return;
          }
          const vocab = ex.vocab;
          const found = vocab.some(w => text.toLowerCase().includes(w.toLowerCase()));
          let feedback = 'Great job! ';
          feedback += found ? 'You used some target vocabulary.' : 'Try including target vocabulary next time.';
          document.getElementById('writingFeedback').textContent = feedback;
          nextExercise();
        });
      }, 50);
      break;
  }
}

function nextExercise() {
  if (currentExerciseIndex < currentExercises.length - 1) {
    currentExerciseIndex++;
    renderExercise();
  } else {
    completeLesson();
 }
}

function completeLesson() {
  userData.xp += 10;
  if (!userData.progress[currentLevelNum]) {
    userData.progress[currentLevelNum] = {completedLessons: [], completed: 0, xp: 0};
  }
  const levelData = userData.progress[currentLevelNum];
  if (!levelData.completedLessons.includes(currentLessonIndex)) {
    levelData.completedLessons.push(currentLessonIndex);
    levelData.completed = levelData.completedLessons.length;
    levelData.xp += 10;
  }
  saveToStorage();
  updateStreak(true);
  alert('Lesson completed! Good job!');
  document.getElementById('lessonView').style.display = 'none';
  document.getElementById('homeView').style.display = 'block';
  renderHome();
}

function playText(text) {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utter);
  } else {
    alert('Text-to-speech not supported in your browser.');
  }
}

function startRecording() {
  const resultEl = document.getElementById('speechResult');
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    resultEl.textContent = 'Speech recognition not supported.';
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.start();
  recognition.onresult = e => {
    const transcript = e.results[0][0].transcript;
    resultEl.textContent = 'You said: ' + transcript;
  };
  recognition.onerror = e => {
    resultEl.textContent = 'Error: ' + e.error;
  };
}

function saveToStorage() {
  localStorage.setItem('englishSpiritCoach', JSON.stringify(userData));
}

function loadFromStorage() {
  const saved = localStorage.getItem('englishSpiritCoach');
  if (saved) {
    try {
      userData = JSON.parse(saved);
    } catch (e) { console.error(e); }
 }
}

function exportProgress() {
  const data = JSON.stringify(userData);
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'english_spirit_progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importProgress(evt) {
  const file = evt.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      userData = imported;
      saveToStorage();
      alert('Progress imported successfully.');
      renderHome();
    } catch {
      alert('Failed to import progress.');
    }
  };
  reader.readAsText(file);
}

function updateStreak(practiced = false) {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  if (practiced) {
    if (userData.lastPracticeDate) {
      const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0];
      if (userData.lastPracticeDate === yesterday) {
        userData.streak += 1;
      } else if (userData.lastPracticeDate !== today) {
        userData.streak = 1;
      }
    } else {
      userData.streak = 1;
    }
    userData.lastPracticeDate = today;
    saveToStorage();
  }
  document.getElementById('streakInfo').textContent = 'Streak: ' + userData.streak + ' days | XP: ' + userData.xp;
}

init();
      
