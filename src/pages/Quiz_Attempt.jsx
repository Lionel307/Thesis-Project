
import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, Divider, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
const QuizAttempt = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const questionsPerPage = 1; // Number of questions per page

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const response = await fetch(`http://localhost:5005/Quiz/Attempt?quizID=${params.quizID}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      // Process each question before setting them in the state
      const processedQuestions = data.questions.map((question) => {
        if (question.type !== 'coding') {
          const modified = renderQuestion(question.question, question.solution);
          const processedQuestion = {
            ...question,
            question: modified.modifiedQuestion,
            variables: modified.variables
          };
          return processedQuestion;

        }
        return question
      });
      setQuestions(processedQuestions);
    }
  };
  useEffect(() => {
    if (questions.length > 0) { // Check if questions are available
      initialiseLsAnswers();
    }
  }, [questions]);

  // Function to initialize lsAnswers in localStorage
  const initialiseLsAnswers = () => {
    const initialAnswers = questions.map((question, index) => {
      let answer = "";
      if (question.type === 'coding') {
        // If the question type is 'coding', set answer to question.functionName
        answer = question.functionName;
      }
      return {
        questionNum: index + 1,
        answer: answer
      };
    });
    localStorage.setItem('lsAnswers', JSON.stringify(initialAnswers));
  };

  // Function to handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case 'shortanswer':
        return 'Short Answer';
      case 'multiplechoice':
        return 'Multiple Choice';
      case 'truefalse':
        return 'True/False';
      case 'coding':
        return 'Coding';
      default:
        return '';
    }
  };

  const handleTabKeyPress = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      // Insert a tab character at the cursor position
      const { selectionStart, selectionEnd } = event.target;
      const textBeforeCursor = event.target.value.substring(0, selectionStart);
      const textAfterCursor = event.target.value.substring(selectionEnd);
      const updatedValue = textBeforeCursor + '\t' + textAfterCursor;
      event.target.value = updatedValue;
    }
  };

  // Calculate index of the first and last question on the current page
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  // sets the variables from the question
  function getVariables(solution) {
    let v = [];
    // check if the solution has variables
    // check the solution's length if more than 1 than it has variables
    if (typeof solution === 'object' && !Array.isArray(solution)) {
        for (const key in solution) {
            if (key !== "solution") {
                let value = solution[key];

                // check if the string represents a list
                if (typeof value === 'string' && value.trim().startsWith('[') && value.trim().endsWith(']')) {
                  value = value.replace(/'/g, '"')
                  let listValue = JSON.parse(value);
                  let item = listValue[Math.floor(Math.random() * listValue.length)];
                  
                  v.push(item);
                } else if (Array.isArray(value)) {
                    // choose a random variable from a provided list of values
                    let item = value[Math.floor(Math.random() * value.length)];
                    if (typeof item === 'string') {
                        item = '"' + item + '"';
                    }
                    v.push(item);
                } else if (typeof value === 'number') {
                    v.push(value);
                } else if (value === null || value === undefined) {
                    throw new Error("Variable cannot be empty");
                } else if (/random\.randint\(\s*(\d+)\s*,\s*(\d+)\s*\)/.test(value)) {
                    const pattern = /\(\s*(\d+)\s*,\s*(\d+)\s*\)/;
                    const match = value.match(pattern);
                    const value1 = parseInt(match[1]);
                    const value2 = parseInt(match[2]);
                    v.push(Math.floor(Math.random() * (value2 - value1 + 1)) + value1);
                } else {
                    v.push(value);
                }
            }
        }
    }
    return v;
}
  // replaces all the variables with its corresponding values
  function renderQuestion (question, solution) {
    if (typeof solution === 'object') {
      const variables = getVariables(solution)
      const modifiedQuestion  = question.replace(/v(\d+)/g, (match, index) => variables[parseInt(index) - 1]);

      return { modifiedQuestion, variables };
    }
  }
  // Function to render question content based on question type
  const renderQuestionContent = (question, type, index) => {
    
    function handleMultipleChoice (answer) {
      if (answer === "realAnswer") {
        return "realAnswer"
      } else {
        return answer
      }
    }
    const handleAnswerChange = (event) => {
      const newAnswer = event.target.value;
      // Get lsAnswers from localStorage
      const lsAnswers = JSON.parse(localStorage.getItem('lsAnswers'));
      // Update the answer for the current question
      lsAnswers[index].answer = newAnswer;
      // Save the updated lsAnswers back to localStorage
      localStorage.setItem('lsAnswers', JSON.stringify(lsAnswers));
    };
    switch (type) {
      case 'shortanswer':
        return (
          <>
            <Typography variant="body1" gutterBottom>{question.question}</Typography>
            <Divider />
            { }
            <Box mt={2}>
              <Typography variant="body2" gutterBottom>Marks Available: {question.marks}</Typography>
              <Typography variant="body2" gutterBottom>Attempts: {question.attempts}</Typography>
              <Typography variant="body2" gutterBottom>Type: {getQuestionTypeLabel(question.type)}</Typography>

            </Box>
            <textarea
              rows="6" // Adjust the number of rows as needed
              style={{ width: '100%', minHeight: '200px', fontSize: '17px'}} // Adjust width and minimum height
              onChange={handleAnswerChange} // Add onChange event handler
          ></textarea>
          </>
        );
      case 'multiplechoice':
        
        const shuffledAnswers = question.answers.sort(() => Math.random() - 0.5);

        return (
          <>
            <Typography variant="body1" gutterBottom>{question.question}</Typography>
            <Divider />
            <Box mt={2}>
              <Typography variant="body2" gutterBottom>Marks: {question.marks}</Typography>
              <Typography variant="body2" gutterBottom>Attempts: {question.attempts}</Typography>
              <Typography variant="body2" gutterBottom>Type: {getQuestionTypeLabel(question.type)}</Typography>
            </Box>
            <Box mt={2}>
              {shuffledAnswers.map((answer, index) => (
                <div key={index}>
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name="multiple-choice-options"
                    value={handleMultipleChoice(answer)}
                    onChange={handleAnswerChange} // Add onChange event handler
                  />
                  <label htmlFor={`option-${index}`}>{handleMultipleChoice(answer)}</label>
                </div>
              ))}
            </Box>
          </>
        );
      case 'truefalse':
        return (
          <>
          <Typography variant="body1" gutterBottom>{question.question}</Typography>
          <Divider />
          <Box mt={2}>
            <Typography variant="body2" gutterBottom>Marks: {question.marks}</Typography>
            <Typography variant="body2" gutterBottom>Attempts: {question.attempts}</Typography>
            <Typography variant="body2" gutterBottom>Type: {getQuestionTypeLabel(question.type)}</Typography>
          </Box>
          {/* True/False form */}
          <div>
            <input
              type="radio"
              id={`true_${question.id}`}
              name={`truefalse_${question.id}`}
              value="true"
              onChange={handleAnswerChange} // Add onChange event handler
            />
            <label htmlFor={`true_${question.id}`}>True</label>
          </div>
          <div>
            <input
              type="radio"
              id={`false_${question.id}`}
              name={`truefalse_${question.id}`}
              value="false"
              onChange={handleAnswerChange} // Add onChange event handler
            />
            <label htmlFor={`false_${question.id}`}>False</label>
          </div>
        </>
        );
      case 'coding':
        const lsAnswers = JSON.parse(localStorage.getItem('lsAnswers'));
        return (
          <>
          <Typography variant="body1" gutterBottom>{question.question}</Typography>
          <Divider />
          <Box mt={2}>
            <Typography variant="body2" gutterBottom>Marks: {question.marks}</Typography>
            <Typography variant="body2" gutterBottom>Attempts: {question.attempts}</Typography>
            <Typography variant="body2" gutterBottom>Type: {getQuestionTypeLabel(question.type)}</Typography>
          </Box>
          <textarea
              rows="10" // Adjust the number of rows as needed
              style={{ width: '100%', minHeight: '300px', fontSize: '17px' }} // Adjust width and minimum height
              onChange={handleAnswerChange} // Add onChange event handler
              onKeyDown={handleTabKeyPress} // Add onKeyDown event handler to handle tab key press
          ></textarea>
        </>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    const lsAnswers = JSON.parse(localStorage.getItem('lsAnswers'));
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (question.type !== 'coding') {
        const response = await fetch(`http://localhost:5005/Quiz/Attempt`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            type:question.type,
            questionID: question.id,
            studentID: params.id,
            quizAttemptID: params.attemptID,
            answer:lsAnswers[i].answer,
            variables: question.variables
          })
        });
        const data = await response.json();
        if (data.error) {
          alert(data.error);
        } 
      } else {
          const response = await fetch(`http://localhost:5005/Quiz/Attempt`, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
              type:question.type,
              questionID: question.id,
              studentID: params.id,
              quizAttemptID: params.attemptID,
              answer:lsAnswers[i].answer,
            })
          });
          const data = await response.json();
          if (data.error) {
            alert(data.error);
            } 
      }
      navigate('/Home/Student/' + params.id)
        
    }
    
  }

  return (
    <div>    
      <Grid container justifyContent="center" alignItems="center" height="100vh">
        <Grid container spacing={4} justifyContent="center">
          {/* Display questions for the current page */}
          {currentQuestions.map((question, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={question.id} >
              {/* Display question information */}
              {renderQuestionContent(question, question.type, indexOfFirstQuestion + index)}
            </Grid>
          ))}
        </Grid>
      </Grid>
      {/* Pagination controls */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {/* Previous page button */}
        <Button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</Button>
        {/* Display page numbers */}
        {Array.from({ length: Math.ceil(questions.length / questionsPerPage) }, (_, i) => i + 1).map((page) => (
          <Button key={page} onClick={() => handlePageChange(page)} variant={currentPage === page ? 'contained' : 'outlined'}>{page}</Button>
        ))}
        {/* Next page button */}
        <Button disabled={indexOfLastQuestion >= questions.length} onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
        {/* Render submit button if it's the last page */}
        {indexOfLastQuestion >= questions.length && (
          <Button variant="contained" color="secondary" onClick={handleSubmit}>Submit</Button>
        )}
      </div>
    </div>
  );
}
  
export default QuizAttempt;
