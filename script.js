// ── 상태 변수 ──────────────────────────────────────
let currentCharacter = 'blair'; // 기본 캐릭터
let isRunning = false;           // 타이머 실행 중 여부
let intervalId = null;           // setInterval ID
let timeLeft = 25 * 60;         // 남은 시간 (초 단위, 기본 25분)
let sessionCount = 0;            // 완료한 세션 수
let isFocusSession = true;       // true = 집중, false = 휴식

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
  }
};

// ── 캐릭터 선택 ────────────────────────────────────
function selectCharacter(character) {
  currentCharacter = character;

  // 테마 전환
  document.body.className = `theme-${character}`;

  // 활성 버튼 표시
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
    // 집중 세션 끝
    sessionCount++;
    document.getElementById('session-count').textContent =
      `완료한 세션: ${sessionCount}`;

    if (sessionCount % 4 === 0) {
      // 4세션마다 긴 휴식
      timeLeft = 30 * 60;
      showQuote('longBreak');
      document.getElementById('session-label').textContent = '긴 휴식 (30분)';
    } else {
      // 짧은 휴식
      timeLeft = 5 * 60;
      showQuote('breakStart');
      document.getElementById('session-label').textContent = '휴식 세션 (5분)';
    }
    isFocusSession = false;

  } else {
    // 휴식 세션 끝 → 집중으로 복귀
    timeLeft = 25 * 60;
    showQuote('breakEnd');
    document.getElementById('session-label').textContent = '집중 세션 (25분)';
    isFocusSession = true;
  }

  updateDisplay();
}

// ── 타이머 시작 ────────────────────────────────────
function startTimer() {
  if (isRunning) return; // 이미 실행 중이면 무시
  isRunning = true;
  showQuote('start');

  intervalId = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft === 0) {
      clearInterval(intervalId);
      isRunning = false;
      showQuote(isFocusSession ? 'focusEnd' : 'breakEnd');
      setTimeout(switchSession, 1500); // 1.5초 후 다음 세션으로
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

// ── 초기 실행 ──────────────────────────────────────
updateDisplay();
showQuote('start');
// ── 배경 음악 ───────────────────────────────────
const playlists = {
  rory: 'https://www.youtube.com/embed/videoseries?list=PLOzDu3MXeV3DqK3oaN0by6WhTny3528hZ&autoplay=1',
  blair: 'https://www.youtube.com/embed/videoseries?list=PLOzDu3MXeV3AV0-p3JVNl9sfT20HQGX5g&autoplay=1',
};

function playMusic(character) {
  const player = document.getElementById('youtube-player');
  player.src = playlists[character];
}

function stopMusic() {
  const player = document.getElementById('youtube-player');
  player.src = '';
}