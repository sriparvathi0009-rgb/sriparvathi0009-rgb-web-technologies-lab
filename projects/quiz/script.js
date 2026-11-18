const questions = [

    // ===== QUESTION 1 =====
    {
        question: "Which language is used for webpage structure?",
        options: ["HTML", "CSS", "Java", "Python"],
        answer: "HTML"
    },

    // ===== QUESTION 2 =====
    {
        question: "Which language is used for styling webpages?",
        options: ["HTML", "Java", "CSS", "C++"],
        answer: "CSS"
    },

    // ===== QUESTION 3 =====
    {
        question: "Which language makes webpages interactive?",
        options: ["Python", "JavaScript", "C", "SQL"],
        answer: "JavaScript"
    },

    // ===== QUESTION 4 =====
    {
        question: "Which tag creates a hyperlink?",
        options: ["<a>", "<img>", "<p>", "<h1>"],
        answer: "<a>"
    },

    // ===== QUESTION 5 =====
    {
        question: "Which HTML tag displays an image?",
        options: ["<img>", "<image>", "<picture>", "<src>"],
        answer: "<img>"
    },

    // ===== QUESTION 6 =====
    {
        question: "CSS stands for?",
        options: [
            "Cascading Style Sheets",
            "Creative Style System",
            "Computer Style Sheet",
            "Colorful Style Sheet"
        ],
        answer: "Cascading Style Sheets"
    },

    // ===== QUESTION 7 =====
    {
        question: "Which company developed JavaScript?",
        options: ["Netscape", "Microsoft", "Google", "Apple"],
        answer: "Netscape"
    },

    // ===== QUESTION 8 =====
    {
        question: "Which symbol is used for id selector in CSS?",
        options: ["#", ".", "*", "@"],
        answer: "#"
    },

    // ===== QUESTION 9 =====
    {
        question: "Which symbol selects a class in CSS?",
        options: [".", "#", "*", "&"],
        answer: "."
    },

    // ===== QUESTION 10 =====
    {
        question: "Which HTML tag is used for the largest heading?",
        options: ["<h1>", "<h6>", "<head>", "<title>"],
        answer: "<h1>"
    },

    // ===== QUESTION 11 =====
    {
        question: "Which CSS property changes text color?",
        options: ["color", "font", "background", "text"],
        answer: "color"
    },

    // ===== QUESTION 12 =====
    {
        question: "Which method prints a message in the console?",
        options: [
            "console.log()",
            "print()",
            "echo()",
            "display()"
        ],
        answer: "console.log()"
    },

    // ===== QUESTION 13 =====
    {
        question: "Which keyword declares a constant in JavaScript?",
        options: ["const", "let", "var", "constant"],
        answer: "const"
    },

    // ===== QUESTION 14 =====
    {
        question: "Which loop executes at least once?",
        options: ["do while", "for", "while", "foreach"],
        answer: "do while"
    },

    // ===== QUESTION 15 =====
    {
        question: "Which operator checks both equality and datatype?",
        options: ["===", "==", "=", "!="],
        answer: "==="
    },

    // ===== QUESTION 16 =====
    {
        question: "Which HTML tag inserts a line break?",
        options: ["<br>", "<hr>", "<p>", "<break>"],
        answer: "<br>"
    },

    // ===== QUESTION 17 =====
    {
        question: "Which HTML tag creates a paragraph?",
        options: ["<p>", "<para>", "<text>", "<h2>"],
        answer: "<p>"
    },

    // ===== QUESTION 18 =====
    {
        question: "Which event occurs when a button is clicked?",
        options: ["onclick", "onload", "onhover", "onpress"],
        answer: "onclick"
    },

    // ===== QUESTION 19 =====
    {
        question: "Which function converts a JSON string into an object?",
        options: [
            "JSON.parse()",
            "JSON.stringify()",
            "parseJSON()",
            "Object.parse()"
        ],
        answer: "JSON.parse()"
    },

    // ===== QUESTION 20 =====
    {
        question: "What is the file extension of JavaScript?",
        options: [".js", ".java", ".html", ".css"],
        answer: ".js"
    },

    // Add QUESTION 21 to QUESTION 100 here
];


// ======================================
// QUIZ SETTINGS
// ======================================

// Number of questions to display
const QUESTIONS_TO_DISPLAY = 20;


// ======================================
// CREATE RANDOM 20 QUESTIONS
// ======================================

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

}


// Make a copy so the original questions array
// is not permanently changed
let quizQuestions = [...questions];


// Shuffle all questions
shuffle(quizQuestions);


// Take only 20 questions
quizQuestions = quizQuestions.slice(0, QUESTIONS_TO_DISPLAY);


// Shuffle options of each selected question
quizQuestions.forEach(q => {

    shuffle(q.options);

});


// ======================================
// QUIZ VARIABLES
// ======================================

let currentQuestion = 0;
let score = 0;
let selectedAnswer = "";


// ======================================
// GET HTML ELEMENTS
// ======================================

const question = document.getElementById("question");
const options = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");


// ======================================
// LOAD QUESTION
// ======================================

function loadQuestion() {

    // Safety check
    if (currentQuestion >= quizQuestions.length) {

        showResult();

        return;

    }


    selectedAnswer = "";


    // Display question
    question.innerText =
        (currentQuestion + 1) + ". " +
        quizQuestions[currentQuestion].question;


    // Clear previous options
    options.innerHTML = "";


    // Create option buttons
    quizQuestions[currentQuestion].options.forEach(option => {

        const btn = document.createElement("button");

        btn.innerText = option;

        btn.classList.add("option");


        btn.onclick = function () {

            selectedAnswer = option;


            // Remove selection from all buttons
            document
                .querySelectorAll(".option")
                .forEach(button => {

                    button.classList.remove("selected");

                });


            // Highlight selected answer
            btn.classList.add("selected");

        };


        options.appendChild(btn);

    });

}


// ======================================
// NEXT BUTTON
// ======================================

nextBtn.onclick = function () {

    // Check whether answer is selected
    if (selectedAnswer === "") {

        alert("Please select an answer.");

        return;

    }


    // Check answer
    if (
        selectedAnswer ===
        quizQuestions[currentQuestion].answer
    ) {

        score++;

    }


    // Move to next question
    currentQuestion++;


    // Check if there are more questions
    if (currentQuestion < quizQuestions.length) {

        loadQuestion();

    } else {

        showResult();

    }

};


// ======================================
// SHOW RESULT
// ======================================

function showResult() {

    const quiz = document.getElementById("quiz");
    const result = document.getElementById("result");
    const scoreElement = document.getElementById("score");


    if (quiz) {

        quiz.classList.add("hide");

    }


    if (result) {

        result.classList.remove("hide");

    }


    if (scoreElement) {

        scoreElement.innerHTML =
            "You scored <b>" +
            score +
            "</b> out of <b>" +
            quizQuestions.length +
            "</b>";

    }

}


// ======================================
// START QUIZ
// ======================================

loadQuestion();