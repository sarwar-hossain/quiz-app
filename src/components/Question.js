import React from 'react';

function Question({ questions, currentQuestion, selectedAnswers, handleOptionChange }) {
    return (
        <>
            <div className="question-section">
                <p>{currentQuestion + 1}: {questions[currentQuestion].question}</p>
            </div>

            <div className="options-section">
                {questions[currentQuestion].options.map((option, index) => (
                    <div key={index}>
                        <label>
                            <input
                                type="radio"
                                name="option"
                                value={option}
                                checked={selectedAnswers[currentQuestion] === option}
                                onChange={(e) => handleOptionChange(e, currentQuestion)}
                            />
                            {option}
                        </label>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Question;
