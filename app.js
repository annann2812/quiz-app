const quizData = [
    {
      question: "Which one of the following is valid data type of JavaScript",
      answers: {
        a: "number",
        b: "void",
        c: "boolean",
        d: "nothing",
      },
      multi: true,
      correctAnswer: "ac",
    },
    {
      question: "Javascript is _________ language.",
      answers: {
        a: "Programming",
        b: "Application",
        c: "None of These",
        d: "Scripting",
      },
      multi: false,
      correctAnswer: "a",
    },
    {
      question:
        "Which of the following is a valid type of function javascript supports?",
      answers: {
        a: "named function",
        b: "anonymous function",
        c: "both of the above",
        d: "none of the above",
      },
      multi: false,
      correctAnswer: "c",
    },
    {
      question:
        "Which built-in method returns the index within the calling String object of the first occurrence of the specified value?",
      answers: {
        a: "getIndex()",
        b: "location()",
        c: "indexOf()",
        d: "getLocation()",
      },
      multi: false,
      correctAnswer: "c",
    },
    {
      question:
        "What are the correct ways to define a JavaScript array?",
      answers: {
        a: 'var colors = ["red", "blue", "green"]',
        b: 'var colors = "red", "blue", "green"',
        c: 'var colors = (1:"red", 2:"blue", 3:"green")',
        d: 'var colors = 1 = ("red"), 2 = ("blue"), 3 = ("green")',
      },
      multi: true,
      correctAnswer: "ac",
    },
  ];
class Question {
  constructor(q, index) {
    this.question = q.question;
    this.answers = q.answers;
    this.correctAnswer = q.correctAnswer;
    this.multi = q.multi;
    this.index = index;
  }
}

class SingleChoiceQuestion extends Question {
  constructor(q, index) {
    super(q, index);
  }

  render() {
    let answersHTML = '';

    for (const letter in this.answers) {
      answersHTML += `
        <label>
          <input type="radio" name="question-${this.index}" value="${letter}">
          ${letter} : ${this.answers[letter]}
        </label>`;
    }

    return `
      <div class="slide">
        <div class="question">${this.question}</div>
        <div class="answers">${answersHTML}</div>
      </div>`;
  }
}


class MultiChoiceQuestion extends Question {
  constructor(q, index) {
    super(q, index);
  }
  render() {
    let answersHTML = '';

    for (const letter in this.answers) {
      answersHTML += `
        <label>
          <input type="checkbox" name="question-${this.index}" value="${letter}">
          ${letter} : ${this.answers[letter]}
        </label>`;
    }

    return `
      <div class="slide">
        <div class="question">${this.question}</div>
        <div class="answers">${answersHTML}</div>
      </div>`;
  }
}

class App {
  constructor(questions) {
    this.questions = questions.map((q, index) => {
      if (q.multi) {
        return new MultiChoiceQuestion(q, index);
      } else {
        return new SingleChoiceQuestion(q, index);
      }
    });

    this.quizContainer = document.getElementById("quiz");
    this.resultsContainer = document.getElementById("results");
    this.submitButton = document.getElementById("submit");
    this.previousButton = document.getElementById("previous");
    this.nextButton = document.getElementById("next");

    this.submitButton.addEventListener("click", this.submitQuiz);
    this.previousButton.addEventListener("click", this.prevQuestion);
    this.nextButton.addEventListener("click", this.nextQuestion);

    this.currentSlide = 0;
  }

  loadQuiz() {
    const output = this.questions.map((currentQuestion) =>
      currentQuestion.render()
    );
    this.quizContainer.innerHTML = output.join("");
  }

  submitQuiz = () => {
    const answerContainers = this.quizContainer.querySelectorAll(".answers");

    let numCorrect = 0;

    this.questions.forEach((currentQuestion, questionNumber) => {
      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name='question-${questionNumber}']:checked`;

      if (currentQuestion.multi) {
        let userAnswer = Array.from(answerContainer.querySelectorAll(selector))
          .map((el) => el.value)
          .join("");
        if (userAnswer === currentQuestion.correctAnswer) {
          numCorrect++;
        }
      } else {
        let userAnswer = answerContainer.querySelector(selector);
        if (userAnswer.value === currentQuestion.correctAnswer) {
          numCorrect++;
          answerContainers[questionNumber].style.color = "lightgreen";
        } else {
          answerContainers[questionNumber].style.color = "red";
        }
      }
    });
    this.resultsContainer.innerHTML = `Your score is ${numCorrect} out of ${this.questions.length}!`;
    this.disableInput(); 
    this.submitButton.style.display = "none";
  };

  showQuestion = (n) => {
    if (this.slides === undefined) {
      this.slides = document.querySelectorAll(".slide");
    }

    this.slides[this.currentSlide].classList.remove("active-slide");
    this.slides[n].classList.add("active-slide");
    this.currentSlide = n;

    this.manageButton();
  };

  manageButton() {
    if (this.currentSlide === 0) {
      this.previousButton.style.display = "none";
    } else {
      this.previousButton.style.display = "inline-block";
    }

    if (this.currentSlide === this.slides.length - 1) {
      this.nextButton.style.display = "none";
      this.submitButton.style.display = "inline-block";
    } else {
      this.nextButton.style.display = "inline-block";
      this.submitButton.style.display = "none";
    }
  }

  nextQuestion = () => {
    this.showQuestion(this.currentSlide + 1);
  };

  prevQuestion = () => {
    this.showQuestion(this.currentSlide - 1);
  };

  disableInput() {
    const inputElements = this.quizContainer.querySelectorAll("input");
    inputElements.forEach((input) => {
      input.disabled = true;
    });
    this.submitButton.disabled = true;
  }

  start() {
    this.loadQuiz();
    this.showQuestion(0);
  }
}
  const app = new App(quizData);
  app.start();