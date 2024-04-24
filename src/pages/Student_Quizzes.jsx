import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, Card, CardContent, Divider, Box }from '@mui/material';

import {
    useNavigate,
    useParams,
  } from 'react-router-dom';
const Student_Quizzes = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [quizzes, setQuizzes] = useState([]); // State to store quizzes
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const quizzesPerPage = 4; // Number of quizzes per page
    const startQuiz = async (id) => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        
        const response = await fetch(`http://localhost:5005/Student/Quizzes`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            quizID: id,
            studentID: params.id,
            date: formattedDate
          })
        });
        const data = await response.json();
        if (data.error) {
        alert(data.error);
        } else {
            navigate('/Quiz/Attempt/' + id + '/' +  data.quiz_attempt_id + '/' + params.id)
        }
    }
    
    const quizDetails = (id) => {
        navigate('/Student/Attempt/Results/' + id + '/' + params.id)
    }
    
    // Fetch quizzes when the component mounts
    useEffect(() => {
      fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
      // Fetch quizzes from the database or API
      // Update the quizzes state with the fetched data
      const response = await fetch(`http://localhost:5005/Student/Quizzes?courseName=${params.courseName}`, {
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
                    {quiz.isActive && (
                        <Button variant="contained" style={{ backgroundColor: 'green', color: 'white', fontSize: '11.1px' }} onClick={() => startQuiz(quiz.id)}>Start Quiz</Button>
                    )}
                    
                    <Button variant="contained" style={{ backgroundColor: 'blue', color: 'white', fontSize: '11.1px' }} onClick={() => quizDetails(quiz.id)}>Quiz Details</Button>
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
    
      </div>
    );
  }
  
  export default Student_Quizzes;