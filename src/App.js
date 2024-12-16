
import React, { useState, useEffect } from "react";
import "./App.css";
import questions from "./questions";
import Question from './components/Question';

function App() {
  const totallTime = questions.length*60*10;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(questions.length).fill(null)
  );
  const [markedQuestions, setMarkedQuestions] = useState(
    Array(questions.length).fill(false)
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totallTime);

  const handleOptionChange = (event) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestion] = event.target.value;
    setSelectedAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  const handleQuestionButtonClick = (index) => {
    setCurrentQuestion(index);
  };

  const toggleMarkQuestion = () => {
    const updatedMarks = [...markedQuestions];
    updatedMarks[currentQuestion] = !updatedMarks[currentQuestion];
    setMarkedQuestions(updatedMarks);
  };

  const handleSubmit = () => {

    if (window.confirm("Are you sure you want to submit your answers and finish the exam?")) {
        const calculatedScore = selectedAnswers.reduce((acc, answer, index) => {
          if (answer === questions[index].correctAnswer) {
            return acc + 1;
          }
          return acc;
        }, 0);
        setScore(calculatedScore);
        setSubmitted(true);
    }

  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(Array(questions.length).fill(null));
    setMarkedQuestions(Array(questions.length).fill(false));
    setSubmitted(false);
    setScore(0);
    setTimeLeft(totallTime);
  };


  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup timer on unmount
    } else if (timeLeft === 0 && !submitted) {
      const calculatedScore = selectedAnswers.reduce((acc, answer, index) => {
        if (answer === questions[index].correctAnswer) {
          return acc + 1;
        }
        return acc;
      }, 0);
      setScore(calculatedScore);
      setSubmitted(true);
    }
  }, [timeLeft, submitted]);


  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""
      }${secs}`;
  };

  return (
    <div className="app">
      <h1>Quiz App</h1>
      {!submitted ? (
        <>
          <div className="timer-section">
            <h2>Time Left: {formatTime(timeLeft)}</h2>
          </div>
          <div className="question-buttons-section">
            <p>Totall question: {questions.length}</p>
            <div className="questions-markbar">
              <p className="attend"> Attend: {selectedAnswers.filter((answer) => answer !== null).length} </p>
              <p className="unattend"> Unattend: {questions.length - selectedAnswers.filter((answer) => answer !== null).length}</p>
              <p className="mark"> Mark: {markedQuestions.filter((mark) => mark).length}</p>

            </div>

            {questions.map((_, index) => (
              <button
                key={index}
                className={`question-button ${selectedAnswers[index] ? "selected" : ""
                  } ${currentQuestion === index ? "active" : ""} ${markedQuestions[index] ? "marked" : ""}`}
                onClick={() => handleQuestionButtonClick(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>


          <Question currentQuestion={currentQuestion} questions={questions}  selectedAnswers={selectedAnswers} handleOptionChange={handleOptionChange}  />

      

          <div className="actions-section">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            <button
              onClick={toggleMarkQuestion}
              style={{ background: "orange", width: "100px" }}
            >
              {markedQuestions[currentQuestion] ? "Unmark" : "Mark"}
            </button>
            {currentQuestion < questions.length - 1 ? (
              <button onClick={handleNextQuestion}>Next</button>
            ) : (
              <button
                onClick={handleSubmit}
                style={{ backgroundColor: "green", float: "right" }}
              >
                Submit
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="results-section">
          <h2>Quiz Completed!</h2>
          <p>
            Your Score: {score}/{questions.length}
          </p>
          <h3>Your Answers:</h3>
          <ul>
            {questions.map((question, index) => (
              <li key={index}>
                {question.question} - Your Answer: <strong>{selectedAnswers[index]}</strong> | Correct Answer: <strong>{question.correctAnswer}</strong>
              </li>
            ))}
          </ul>
          <button onClick={handleRestart}>Restart Quiz</button>
        </div>
      )}
    </div>
  );
}

export default App;
