const categorySelect = document.getElementById('categorySelect');
const countSelect = document.getElementById('countSelect');
const shuffleToggle = document.getElementById('shuffleToggle');
const startBtn = document.getElementById('startBtn');
const retryWrongBtn = document.getElementById('retryWrongBtn');
const questionCard = document.getElementById('questionCard');
const statusText = document.getElementById('statusText');
const scoreText = document.getElementById('scoreText');
const progressBar = document.getElementById('progressBar');
const nextBtn = document.getElementById('nextBtn');
const navButtons = document.getElementById('navButtons');
const resultCard = document.getElementById('resultCard');

const allQuestions = Array.isArray(window.QUIZ_QUESTIONS) ? window.QUIZ_QUESTIONS : [];
const categories = ['すべて', ...new Set(allQuestions.map(q => q.category))];

let quizQuestions = [];
let currentIndex = 0;
let score = 0;
let answered = false;
let wrongQuestions = [];
let lastMode = 'all';

function shuffle(array) {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function setupCategories() {
  categorySelect.innerHTML = categories
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join('');
}

function getFilteredQuestions() {
  const selectedCategory = categorySelect.value;
  const pool = selectedCategory === 'すべて'
    ? [...allQuestions]
    : allQuestions.filter(q => q.category === selectedCategory);

  const prepared = shuffleToggle.checked ? shuffle(pool) : pool;
  const countValue = countSelect.value;
  if (countValue === 'all') return prepared;
  return prepared.slice(0, Number(countValue));
}

function startQuiz(customPool = null) {
  quizQuestions = customPool ? [...customPool] : getFilteredQuestions();
  if (!quizQuestions.length) {
    questionCard.className = 'question-card empty-state';
    questionCard.innerHTML = '<h2>問題がありません</h2><p>条件を変えてください。</p>';
    navButtons.classList.add('hidden');
    resultCard.classList.add('hidden');
    return;
  }

  currentIndex = 0;
  score = 0;
  answered = false;
  wrongQuestions = [];
  scoreText.textContent = score;
  resultCard.classList.add('hidden');
  retryWrongBtn.disabled = true;
  navButtons.classList.remove('hidden');
  renderQuestion();
}

function renderQuestion() {
  const q = quizQuestions[currentIndex];
  answered = false;
  nextBtn.disabled = true;
  questionCard.className = 'question-card';

  const optionsHtml = q.choices.map((choice, index) => `
    <button class="option-btn" data-index="${index}">
      <strong>${String.fromCharCode(65 + index)}.</strong> ${choice}
    </button>
  `).join('');

  questionCard.innerHTML = `
    <div class="meta-row">
      <span class="pill">${q.category}</span>
      <span class="pill">${currentIndex + 1} / ${quizQuestions.length}</span>
    </div>
    <p class="question-text">${q.question}</p>
    <div class="options">${optionsHtml}</div>
  `;

  const optionButtons = questionCard.querySelectorAll('.option-btn');
  optionButtons.forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(Number(btn.dataset.index), optionButtons));
  });

  updateStatus();
}

function handleAnswer(selectedIndex, optionButtons) {
  if (answered) return;
  answered = true;
  const q = quizQuestions[currentIndex];
  const isCorrect = selectedIndex === q.answer;

  optionButtons.forEach((btn, index) => {
    btn.disabled = true;
    if (index === q.answer) btn.classList.add('correct');
    if (index === selectedIndex && !isCorrect) btn.classList.add('wrong');
  });

  if (isCorrect) {
    score += 1;
    scoreText.textContent = score;
  } else {
    wrongQuestions.push(q);
  }

  const explanation = document.createElement('section');
  explanation.className = 'explanation';
  explanation.innerHTML = `
    <h3>${isCorrect ? '正解です' : '不正解です'}</h3>
    <p><strong>正解:</strong> ${String.fromCharCode(65 + q.answer)}. ${q.choices[q.answer]}</p>
    <p>${q.explanation}</p>
    <p><a href="${q.sourceUrl}" target="_blank" rel="noopener noreferrer">参考: ${q.sourceLabel}</a></p>
  `;
  questionCard.appendChild(explanation);

  nextBtn.disabled = false;
  if (currentIndex === quizQuestions.length - 1) {
    nextBtn.textContent = '結果を見る';
  } else {
    nextBtn.textContent = '次へ';
  }
  updateStatus();
}

function updateStatus() {
  const progress = quizQuestions.length ? ((currentIndex) / quizQuestions.length) * 100 : 0;
  progressBar.style.width = `${progress}%`;
  statusText.textContent = answered
    ? `解答済み ${currentIndex + 1}問目`
    : `出題中 ${currentIndex + 1}問目`;
}

function finishQuiz() {
  progressBar.style.width = '100%';
  statusText.textContent = '結果を表示しています';
  navButtons.classList.add('hidden');
  retryWrongBtn.disabled = wrongQuestions.length === 0;
  resultCard.classList.remove('hidden');

  const rate = Math.round((score / quizQuestions.length) * 100);
  const comment = rate === 100
    ? '完璧です。このまま実務確認へ進めます。'
    : rate >= 80
      ? 'かなり理解できています。間違えた問題を見直すと強くなります。'
      : rate >= 60
        ? '基礎はできています。制度ごとの差を重点的に復習すると良いです。'
        : 'もう一度、全体像と金額・対象要件を整理して復習するのがおすすめです。';

  const reviewHtml = wrongQuestions.length
    ? wrongQuestions.map((q, i) => `
        <article class="review-item">
          <p><strong>${i + 1}. ${q.question}</strong></p>
          <p>正解: ${q.choices[q.answer]}</p>
          <p>${q.explanation}</p>
          <p><a href="${q.sourceUrl}" target="_blank" rel="noopener noreferrer">参考: ${q.sourceLabel}</a></p>
        </article>
      `).join('')
    : '<p>今回は全問正解です。</p>';

  resultCard.innerHTML = `
    <h2>結果</h2>
    <div class="summary-grid">
      <div class="summary-box"><span>正解数</span><strong>${score} / ${quizQuestions.length}</strong></div>
      <div class="summary-box"><span>正答率</span><strong>${rate}%</strong></div>
      <div class="summary-box"><span>再挑戦候補</span><strong>${wrongQuestions.length}問</strong></div>
    </div>
    <p>${comment}</p>
    <h3>復習メモ</h3>
    <div class="review-list">${reviewHtml}</div>
  `;
}

nextBtn.addEventListener('click', () => {
  if (!answered) return;
  if (currentIndex === quizQuestions.length - 1) {
    finishQuiz();
    return;
  }
  currentIndex += 1;
  renderQuestion();
});

startBtn.addEventListener('click', () => {
  lastMode = 'all';
  startQuiz();
});

retryWrongBtn.addEventListener('click', () => {
  if (!wrongQuestions.length) return;
  lastMode = 'wrong';
  const pool = shuffleToggle.checked ? shuffle(wrongQuestions) : [...wrongQuestions];
  startQuiz(pool);
});

setupCategories();
