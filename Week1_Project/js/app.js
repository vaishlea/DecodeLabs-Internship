/* =========================================
   ASSESSMENT PAGE LOGIC
========================================= */

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");

const progressText = document.getElementById("progress-text");
const progressPercent = document.getElementById("progress-percent");
const progressFill = document.getElementById("progress-fill");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");

let currentQuestion = 0;
let answers = [];

/* =========================================
   LOAD QUESTION
========================================= */

function loadQuestion() {

    const current = questions[currentQuestion];

    questionText.textContent = current.question;

    optionsContainer.innerHTML = "";

    current.options.forEach(option => {

        const label = document.createElement("label");
        label.classList.add("option");

        label.innerHTML = `
            <input
                type="radio"
                name="answer"
                value="${option.type}"
                ${answers[currentQuestion] === option.type ? "checked" : ""}
            >
            <span>${option.text}</span>
        `;

        label.querySelector("input").addEventListener("change", () => {
            answers[currentQuestion] = option.type;
        });

        optionsContainer.appendChild(label);
    });

    updateProgress();

    prevBtn.disabled = currentQuestion === 0;

    if (currentQuestion === questions.length - 1) {
        nextBtn.style.display = "none";
        submitBtn.style.display = "inline-block";
    } else {
        nextBtn.style.display = "inline-block";
        submitBtn.style.display = "none";
    }
}

/* =========================================
   UPDATE PROGRESS
========================================= */

function updateProgress() {

    const percentage =
        ((currentQuestion + 1) / questions.length) * 100;

    progressText.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    progressPercent.textContent =
        `${Math.round(percentage)}%`;

    progressFill.style.width =
        `${percentage}%`;
}

/* =========================================
   NEXT
========================================= */

if (nextBtn) {

    nextBtn.addEventListener("click", () => {

        if (!answers[currentQuestion]) {

            alert("Please select an answer.");

            return;
        }

        currentQuestion++;

        loadQuestion();
    });
}

/* =========================================
   PREVIOUS
========================================= */

if (prevBtn) {

    prevBtn.addEventListener("click", () => {

        if (currentQuestion > 0) {

            currentQuestion--;

            loadQuestion();
        }
    });
}

/* =========================================
   SUBMIT
========================================= */

if (submitBtn) {

    submitBtn.addEventListener("click", () => {

        if (!answers[currentQuestion]) {

            alert("Please select an answer.");

            return;
        }

        calculateResults();
    });
}

/* =========================================
   RESULT CALCULATION
========================================= */

function calculateResults() {

    const scores = {
        vata: 0,
        pitta: 0,
        kapha: 0
    };

    answers.forEach(answer => {

        if (answer) {
            scores[answer]++;
        }

    });

    const sorted = Object.entries(scores)
        .sort((a, b) => b[1] - a[1]);

    const totalQuestions = questions.length;

    const result = {

        primary: sorted[0][0],

        secondary: sorted[1][0],

        tertiary: sorted[2][0],

        vataPercent:
            Math.round((scores.vata / totalQuestions) * 100),

        pittaPercent:
            Math.round((scores.pitta / totalQuestions) * 100),

        kaphaPercent:
            Math.round((scores.kapha / totalQuestions) * 100)
    };

    localStorage.setItem(
        "tridoshaResult",
        JSON.stringify(result)
    );

    window.location.href = "results.html";
}

/* =========================================
   RESULTS PAGE
========================================= */

function loadResults() {

    const storedResult =
        JSON.parse(localStorage.getItem("tridoshaResult"));

    if (!storedResult) return;

    const primary =
        document.getElementById("primary-dosha");

    const secondary =
        document.getElementById("secondary-dosha");

    const tertiary =
        document.getElementById("tertiary-dosha");

    const vataScore =
        document.getElementById("vata-score");

    const pittaScore =
        document.getElementById("pitta-score");

    const kaphaScore =
        document.getElementById("kapha-score");

    const vataFill =
        document.getElementById("vata-fill");

    const pittaFill =
        document.getElementById("pitta-fill");

    const kaphaFill =
        document.getElementById("kapha-fill");

    const formatDosha = (dosha) => {

        if (dosha === "vata") return "🌬️ Vata";
        if (dosha === "pitta") return "🔥 Pitta";
        return "🌿 Kapha";
    };

    primary.textContent =
        formatDosha(storedResult.primary);

    secondary.textContent =
        formatDosha(storedResult.secondary);

    tertiary.textContent =
        formatDosha(storedResult.tertiary);

    vataScore.textContent =
        `${storedResult.vataPercent}%`;

    pittaScore.textContent =
        `${storedResult.pittaPercent}%`;

    kaphaScore.textContent =
        `${storedResult.kaphaPercent}%`;

    setTimeout(() => {

        vataFill.style.width =
            `${storedResult.vataPercent}%`;

        pittaFill.style.width =
            `${storedResult.pittaPercent}%`;

        kaphaFill.style.width =
            `${storedResult.kaphaPercent}%`;

    }, 300);
}

/* =========================================
   PAGE INIT
========================================= */

if (questionText) {
    loadQuestion();
}

if (document.getElementById("primary-dosha")) {
    loadResults();
}