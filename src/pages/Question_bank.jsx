import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, Card, CardContent, Divider, Box }from '@mui/material';

import { useNavigate, useParams } from 'react-router-dom';

const QuestionBank = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const questionsPerPage = 4; // Number of questions per page

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const response = await fetch(`http://localhost:5005/Question/Bank?zID=${params.id}&courseName=${params.courseName}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      setQuestions(data.questions);
    }
  };

  // Function to handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate index of the first and last question on the current page
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const goAddQuestion = () => {
    navigate('/Question/New/courseName/' + 'token');
  };

  const questionDetails = (id) => {
    navigate('/Question/Details/'+ id + '/' + params.id)
  }

  const deleteQuestion = async (id) => {
    const confirmed = window.confirm('Do you want to DELETE this question?');
    if (confirmed) {
      const response = await fetch(`http://localhost:5005/Question/Bank`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          creatorID: params.id,
          id: id,
        })
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } 
      window.location.reload();
    }
  }
  return (
    <div>
      <Typography variant="h3" gutterBottom>
        Question Bank for {params.courseName} 
      </Typography>
      {questions.length === 0 ? (
        <Typography variant="h5">There are no question for this course.</Typography>
      ) : (
        <Grid container justifyContent="center" alignItems="center" height="100vh">
          <Grid container spacing={4} justifyContent="center">
            {/* Display questions for the current page */}
            {currentQuestions.map((question) => (
              <Grid item xs={12} sm={6} md={3} lg={2.2} key={question.id} >
                {/* Display question information */}
                <Card variant="outlined" sx={{ height: '100%', boxShadow: '0px 3px 6px #00000029', backgroundColor: '#f0f0f0' }}>
                  <CardContent>
                    <Box mt={2}>
                      <Typography variant="body1" gutterBottom>{question.question}</Typography>
                      <Typography variant="body2" gutterBottom>Marks: {question.marks}</Typography>
                      <Typography variant="body2" gutterBottom>Type: {getQuestionTypeLabel(question.type)}</Typography>
                    </Box>
                  </CardContent>
                  {/* <Button variant="contained" style={{ backgroundColor: 'green', color: 'white', fontSize: '11.1px' }} onClick={() => startQuiz(quiz.id)}>Start Quiz</Button> */}
                  <Button variant="contained" style={{ backgroundColor: 'blue', color: 'white', fontSize: '11.1px' }} onClick={() => questionDetails(question.id)}>Question Details</Button>
                  <Button variant="contained" style={{ backgroundColor: 'red', color: 'white', fontSize: '11.1px' }} onClick={() => deleteQuestion(question.id)}>Delete Question</Button>
                </Card>
              </Grid>
            ))}
            {/* Display add question button if there are less than 3 questions on the page */}
          </Grid>
        </Grid>
        )}
        {/* Pagination controls */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {/* Previous page button */}
          <Button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</Button>
          {/* Display page numbers */}
          {Array.from({ length: Math.ceil(questions.length / questionsPerPage) }, (_, i) => i + 1).map((page) => (
            <Button key={page} onClick={() => handlePageChange(page)} variant={currentPage === page ? 'contained' : 'outlined'}>{page}</Button>
          ))}
          {/* Next page button */}
          <Button disabled={indexOfLastQuestion >= questions.length} onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
        </div>
    
      <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
      <Button
          variant="contained"
          color="primary"
          style={{
            borderRadius: '50%',
            width: '100px',
            height: '100px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            fontSize: '64px'
          }}
          onClick={goAddQuestion}
        >
          +
        </Button>
      </div>
    </div>
  );
};

const getQuestionTypeLabel = (type) => {
  switch (type) {
    case 'shortanswer':
      return 'Short Answer';
    case 'coding':
      return 'Coding';
    case 'truefalse':
      return 'True/False';
    case 'multiplechoice':
      return 'Multiple Choice';
    default:
      return '';
  }
};

export default QuestionBank;
