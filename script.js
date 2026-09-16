const API_URL = "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple";

let questions = [];
let currentQuestion = 0;
let score = 0;
let currentAnswers = [];
let highScore = localStorage.getItem("highScore") || 0;

let timer;
let timeLeft = 15;


const startScreen = document.querySelector("#start-screen");
const gameScreen = document.querySelector("#game-screen");
const resultScreen = document.querySelector("#result-screen");

const startBtn = document.querySelector("#start-btn");
const answerButtons = document.querySelectorAll(".answer-btn");
const questionElement = document.querySelector("#question");
const questionNumberElement = document.querySelector("#question-number");
const restartBtn = document.querySelector("#restart-btn");

const timerElement = document.querySelector("#timer");

document.querySelector("#high-score").textContent = highScore;



startBtn.addEventListener("click", async function () {

    startScreen.style.display = "none";

    gameScreen.style.display = "block";


    await getQuestions();
});

async function getQuestions() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("API isteği başarısız oldu.");
        }

        const data = await response.json();

        if (data.response_code !== 0) {
            throw new Error("API soru gönderemedi.");
        }

        questions = data.results;

        console.log(questions);

        showQuestion();

    } catch (error) {
        console.error("API Hatası:", error);

        alert("Sorular yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");

        gameScreen.style.display = "none";
        startScreen.style.display = "block";
    }
}

function showQuestion() {

    const current = questions[currentQuestion];

    questionElement.textContent = decodeHTML(current.question);

    questionNumberElement.textContent =
        `Soru ${currentQuestion + 1} / ${questions.length}`;

    currentAnswers = [
        {
            text: current.correct_answer,
            correct: true
        },
        ...current.incorrect_answers.map(answer => ({
            text: answer,
            correct: false
        }))
    ];

    currentAnswers.sort(() => Math.random() - 0.5);

    answerButtons.forEach((button, index) => {

        button.classList.remove("correct", "wrong");

        button.disabled = false;

        button.textContent =
            `${String.fromCharCode(65 + index)}) ${decodeHTML(currentAnswers[index].text)}`;

    });

    startTimer();

}

answerButtons.forEach((button, index) => {

    button.addEventListener("click", function () {

        const selectedAnswer = currentAnswers[index];

        answerButtons.forEach(button => {
            button.disabled = true;
        });

        if (selectedAnswer.correct) {

            button.classList.add("correct");

            score += 10;

            console.log("DOĞRU!");
            console.log("SKOR:", score);

        } else {

            button.classList.add("wrong");

            console.log("YANLIŞ!");

            const correctIndex = currentAnswers.findIndex(
                answer => answer.correct
            );

            answerButtons[correctIndex].classList.add("correct");
        }

        setTimeout(() => {
            nextQuestion();
        }, 1000);

    });

});

restartBtn.addEventListener("click", function () {
    currentQuestion = 0;
    score = 0;

    resultScreen.style.display = "none";
    startScreen.style.display = "block";
});

function nextQuestion() {
    clearInterval(timer);

    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        gameScreen.style.display = "none";
        resultScreen.style.display = "block";

        document.querySelector("#final-score").textContent = score;

const correctCount = score / 10;
const wrongCount = questions.length - correctCount;

const successRate = (correctCount / questions.length) * 100;

document.querySelector("#correct-count").textContent = correctCount;
document.querySelector("#wrong-count").textContent = wrongCount;
document.querySelector("#success-rate").textContent = `${successRate}%`;

if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
}

document.querySelector("#result-high-score").textContent = highScore;
document.querySelector("#high-score").textContent = highScore;
    }
}

function startTimer() {
    clearInterval(timer);

    timeLeft = 15;
    timerElement.textContent = `⏱️ ${timeLeft}`;

    timer = setInterval(() => {
        timeLeft--;

        timerElement.textContent = `⏱️ ${timeLeft}`;

        if (timeLeft <= 0) {
            clearInterval(timer);

            answerButtons.forEach(button => {
                button.disabled = true;
            });

            const correctIndex = currentAnswers.findIndex(
                answer => answer.correct
            );

            answerButtons[correctIndex].classList.add("correct");

            setTimeout(() => {
                nextQuestion();
            }, 1000);
        }
    }, 1000);
}

function decodeHTML(text) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
}

function nextQuestion() {
    clearInterval(timer);

    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        gameScreen.style.display = "none";
        resultScreen.style.display = "block";

        document.querySelector("#final-score").textContent = score;

const correctCount = score / 10;
const wrongCount = questions.length - correctCount;

const successRate = (correctCount / questions.length) * 100;

document.querySelector("#correct-count").textContent = correctCount;
document.querySelector("#wrong-count").textContent = wrongCount;
document.querySelector("#success-rate").textContent = `${successRate}%`;

if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
}

document.querySelector("#result-high-score").textContent = highScore;
document.querySelector("#high-score").textContent = highScore;
    }
}


