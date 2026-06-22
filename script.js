// ── 상태 변수 ──────────────────────────────────────
let currentCharacter = 'blair';
let isRunning = false;
let intervalId = null;
let timeLeft = 25 * 60;
let sessionCount = 0;
let isFocusSession = true;

// ── 캐릭터 멘트 ────────────────────────────────────
const quotes = {
  blair: {
    start:      "집중하지 않으면 도태돼. 시작해, Darling.",
    focusEnd:   "훌륭해. 역시 넌 할 수 있었잖아.",
    breakStart: "5분이야. 우아하게 쉬어.",
    breakEnd:   "휴식은 끝났어. 다시 집중할 시간이야.",
    longBreak:  "4세션 완료. 오늘의 너, 꽤 괜찮은데.",
  },
  rory: {
    start:      "책상 앞에 앉는 것, 그게 이미 절반이야. 시작하자!",
    focusEnd:   "25분 완주! 커피 한 모금 마셔도 돼.",
    breakStart: "잠깐 눈 좀 쉬어. 5분 후에 다시 만나.",
    breakEnd:   "자, 다시 페이지를 펼쳐볼까?",
    longBreak:  "4세션이나 했어! 오늘 정말 잘했다.",
  },
  hermione: {
    start:      "Honestly, have you read the syllabus? 시작해.",
    focusEnd:   "There's always time for one more page.",
    breakStart: "5분. 그 이상은 필요 없어.",
    breakEnd:   "Knowledge is the most powerful magic. 다시 시작.",
    longBreak:  "4세션 완료. 심지어 Hermione도 쉬어가.",
  }
};

// ── 캐릭터 선택 ────────────────────────────────────
function selectCharacter(character) {
  currentCharacter = character;
  document.body.className = `theme-${character}`;
  document.querySelectorAll('.char-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`btn-${character}`).classList.add('active');
  showQuote('start');
  resetTimer();
}

// ── 멘트 표시 ──────────────────────────────────────
function showQuote(type) {
  const quoteEl = document.getElementById('character-quote');
  quoteEl.textContent = quotes[currentCharacter][type];
}

// ── 화면 업데이트 ──────────────────────────────────
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('timer-display').textContent =
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// ── 세션 전환 ──────────────────────────────────────
function switchSession() {
  if (isFocusSession) {
    sessionCount++;
    document.getElementById('session-count').textContent = `완료한 세션: ${sessionCount}`;
    if (sessionCount % 4 === 0) {
      timeLeft = 30 * 60;
      showQuote('longBreak');
      document.getElementById('session-label').textContent = '긴 휴식 (30분)';
    } else {
      timeLeft = 5 * 60;
      showQuote('breakStart');
      document.getElementById('session-label').textContent = '휴식 세션 (5분)';
    }
    isFocusSession = false;
  } else {
    timeLeft = 25 * 60;
    showQuote('breakEnd');
    document.getElementById('session-label').textContent = '집중 세션 (25분)';
    isFocusSession = true;
  }
  updateDisplay();
}

// ── 타이머 시작 ────────────────────────────────────
function startTimer() {
  if (isRunning) return;
  isRunning = true;
  showQuote('start');
  intervalId = setInterval(() => {
    timeLeft--;
    updateDisplay();
    if (timeLeft === 0) {
      clearInterval(intervalId);
      isRunning = false;
      showQuote(isFocusSession ? 'focusEnd' : 'breakEnd');
      setTimeout(switchSession, 1500);
    }
  }, 1000);
}

// ── 일시정지 ───────────────────────────────────────
function pauseTimer() {
  clearInterval(intervalId);
  isRunning = false;
}

// ── 리셋 ───────────────────────────────────────────
function resetTimer() {
  clearInterval(intervalId);
  isRunning = false;
  isFocusSession = true;
  timeLeft = 25 * 60;
  document.getElementById('session-label').textContent = '집중 세션 (25분)';
  document.getElementById('session-count').textContent = `완료한 세션: ${sessionCount}`;
  updateDisplay();
}

// ── 음악 플레이어 ──────────────────────────────────
function loadMusic() {
  const input = document.getElementById('music-url-input').value.trim();
  if (!input) return;

  // YouTube URL에서 영상 ID 추출
  let videoId = '';
  try {
    const url = new URL(input);
    if (url.hostname.includes('youtu.be')) {
      videoId = url.pathname.slice(1);
    } else {
      videoId = url.searchParams.get('v');
    }
  } catch {
    alert('올바른 YouTube 링크를 입력해주세요.');
    return;
  }

  if (!videoId) {
    alert('영상 ID를 찾을 수 없어요. YouTube 링크를 확인해주세요.');
    return;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  document.getElementById('youtube-player').src = embedUrl;
}

function stopMusic() {
  document.getElementById('youtube-player').src = '';
  document.getElementById('music-url-input').value = '';
}

// ── 무드보드 ───────────────────────────────────────
let moodImages = [];

function uploadImages(event) {
  const files = Array.from(event.target.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      moodImages.push(e.target.result);
      saveMoodboard();
      renderMoodboard();
    };
    reader.readAsDataURL(file);
  });
  // 같은 파일 다시 업로드 가능하도록 초기화
  event.target.value = '';
}

function renderMoodboard() {
  const grid = document.getElementById('image-grid');
  grid.innerHTML = '';
  moodImages.forEach((src, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'mood-img-wrapper';

    const img = document.createElement('img');
    img.src = src;
    img.className = 'mood-img';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'mood-delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.onclick = () => deleteImage(index);

    wrapper.appendChild(img);
    wrapper.appendChild(deleteBtn);
    grid.appendChild(wrapper);
  });
}

function deleteImage(index) {
  moodImages.splice(index, 1);
  saveMoodboard();
  renderMoodboard();
}

function clearMoodboard() {
  if (moodImages.length === 0) return;
  if (confirm('무드보드를 전부 삭제할까요?')) {
    moodImages = [];
    saveMoodboard();
    renderMoodboard();
  }
}

// ── localStorage 저장/불러오기 ─────────────────────
function saveMoodboard() {
  try {
    localStorage.setItem('focusDarlingMoodboard', JSON.stringify(moodImages));
  } catch {
    alert('이미지 용량이 너무 커서 저장할 수 없어요. 일부 이미지를 삭제해주세요.');
  }
}

function loadMoodboard() {
  const saved = localStorage.getItem('focusDarlingMoodboard');
  if (saved) {
    moodImages = JSON.parse(saved);
    renderMoodboard();
  }
}

// ── 초기 실행 ──────────────────────────────────────
updateDisplay();
showQuote('start');
loadMoodboard();