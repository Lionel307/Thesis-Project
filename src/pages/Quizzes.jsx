import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, Card, CardContent, Divider, Box }from '@mui/material';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

const Quizzes = () => {
  const navigate = useNavigate();
  const params = useParams();

  const goAddQuiz = () => {
    navigate('/Quiz/New/' + params.courseName + '/' + params.id)
  }

  const startQuiz = async (id) => {
    const confirmed = window.confirm('Do you want to start this quiz?');
    if (confirmed) {
      const response = await fetch(`http://localhost:5005/Quizzes`, {
        method: 'PUT',
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

  const quizDetails = (id) => {
    navigate('/Quiz/Details/' + id + '/' + params.id)
  }

  const deleteQuiz = async (id) => {
    const confirmed = window.confirm('Do you want to DELETE this quiz?');
    if (confirmed) {
      const response = await fetch(`http://localhost:5005/Quizzes`, {
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

  const [quizzes, setQuizzes] = useState([]); // State to store quizzes
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const quizzesPerPage = 4; // Number of quizzes per page
  // Fetch quizzes when the component mounts
  useEffect(() => {
    fetchQuizzes();
  }, []);
  const fetchQuizzes = async () => {
    // Fetch quizzes from the database or API
    // Update the quizzes state with the fetched data
    const response = await fetch(`http://localhost:5005/Quizzes?zID=${params.id}&courseName=${params.courseName}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      setQuizzes(data.quizzes);
    }
  };

  
  // Function to handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
   // Calculate index of the first and last quiz on the current page
   const indexOfLastQuiz = currentPage * quizzesPerPage;
   const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
   const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);

  return (
    <div>
      <Typography variant="h3" gutterBottom>
        {params.courseName} Quizzes
      </Typography>
      {quizzes.length === 0 ? (
        <Typography variant="h5">There are no quizzes for this course.</Typography>
      ) : (
        <Grid container justifyContent="center" alignItems="center" height="100vh">
          <Grid container spacing={4} justifyContent="center">
            {/* Display quizs for the current page */}
            {currentQuizzes.map((quiz) => (
              <Grid item xs={12} sm={6} md={3} lg={2.2} key={quiz.id} >
                {/* Display quiz information */}
                <Card variant="outlined" sx={{ height: '100%', boxShadow: '0px 3px 6px #00000029', backgroundColor: '#f0f0f0' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{quiz.title}</Typography>
                    <Divider />
                    <Box mt={2}>
                      <Typography variant="body1" gutterBottom><b>Description:</b> {quiz.description}</Typography>
                      <Typography variant="body1" gutterBottom><b>Attempts Allowed:</b> {quiz.attemptsAllowed}</Typography>
                      <Typography variant="body1" gutterBottom><b>Time Allowed:</b> {quiz.timeAllowed}</Typography>
                      <Typography variant="body1" gutterBottom><b>Active:</b> {quiz.isActive ? 'Yes' : 'No'}</Typography>
                      <Typography variant="body1" gutterBottom><b>Number of Questions:</b> {quiz.questions.length}</Typography>
                    </Box>
                  </CardContent>
                  <Button variant="contained" style={{ backgroundColor: 'green', color: 'white', fontSize: '11.1px' }} onClick={() => startQuiz(quiz.id)}>Start Quiz</Button>
                  <Button variant="contained" style={{ backgroundColor: 'blue', color: 'white', fontSize: '11.1px' }} onClick={() => quizDetails(quiz.id)}>Quiz Details</Button>
                  <Button variant="contained" style={{ backgroundColor: 'red', color: 'white', fontSize: '11.1px' }} onClick={() => deleteQuiz(quiz.id)}>Delete Quiz</Button>
                </Card>
              </Grid>
            ))}
            {/* Display add quiz button if there are less than 3 quizs on the page */}
          </Grid>
        </Grid>
        )}
        {/* Pagination controls */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {/* Previous page button */}
          <Button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</Button>
          {/* Display page numbers */}
          {Array.from({ length: Math.ceil(quizzes.length / quizzesPerPage) }, (_, i) => i + 1).map((page) => (
            <Button key={page} onClick={() => handlePageChange(page)} variant={currentPage === page ? 'contained' : 'outlined'}>{page}</Button>
          ))}
          {/* Next page button */}
          <Button disabled={indexOfLastQuiz >= quizzes.length} onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
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
          onClick={goAddQuiz}
        >
          +
        </Button>
      </div>
    </div>
    
  );
  }
  
  export default Quizzes;