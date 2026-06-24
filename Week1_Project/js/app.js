const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const progressText = document.getElementById("progress-text");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");

let currentQuestion = 0;
let answers = new Array(questions.length).fill(null);

/* =========================
   LOAD QUESTION
========================= */

function loadQuestion() {

    const current = questions[currentQuestion];

    questionText.textContent = current.question;

    optionsContainer.innerHTML = "";

    current.options.forEach(option => {

        const label = document.createElement("label");
        label.classList.add("option");

        const radio = document.createElement("input");

        radio.type = "radio";
        radio.name = "answer";
        radio.value = option.type;

        if (answers[currentQuestion] === option.type) {
            radio.checked = true;
        }

        radio.addEventListener("change", () => {
            answers[currentQuestion] = option.type;
        });

        label.appendChild(radio);
        label.append(option.text);

        optionsContainer.appendChild(label);
    });

    progressText.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    prevBtn.disabled = currentQuestion === 0;

    if (currentQuestion === questions.length - 1) {
        nextBtn.style.display = "none";
        submitBtn.style.display = "inline-block";
    } else {
        nextBtn.style.display = "inline-block";
        submitBtn.style.display = "none";
    }
}

/* =========================
   NEXT BUTTON
========================= */

nextBtn.addEventListener("click", () => {

    if (!answers[currentQuestion]) {
        alert("Please select an option.");
        return;
    }

    currentQuestion++;

    loadQuestion();
});

/* =========================
   PREVIOUS BUTTON
========================= */

prevBtn.addEventListener("click", () => {

    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
});

/* =========================
   SUBMIT BUTTON
========================= */

submitBtn.addEventListener("click", () => {

    if (!answers[currentQuestion]) {
        alert("Please select an option.");
        return;
    }

    calculateResult();
});

/* =========================
   RESULT CALCULATION
========================= */

function calculateResult() {

    const scores = {
        vata: 0,
        pitta: 0,
        kapha: 0
    };

    answers.forEach(answer => {
        scores[answer]++;
    });

    const sorted = Object.entries(scores)
        .sort((a, b) => b[1] - a[1]);

    const result = {
        primary: sorted[0][0],
        secondary: sorted[1][0],
        tertiary: sorted[2][0],
        scores: scores
    };

    localStorage.setItem(
        "tridoshaResult",
        JSON.stringify(result)
    );

    window.location.href = "results.html";
}

/* =========================
   START QUIZ
========================= */

if (questionText) {
    loadQuestion();
}