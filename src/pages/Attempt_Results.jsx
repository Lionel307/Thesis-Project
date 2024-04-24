import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';
const AttemptResults = () => {
  const [attempts, setAttempts] = useState([]); // State to store attempts
  const [quiz, setQuiz] = useState({}); // State to store quiz details
  const [showAllAttempts, setShowAllAttempts] = useState(true); // State to track if all attempts should be shown
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const response = await fetch(`http://localhost:5005/Student/Attempt/Results?stuID=${params.id}&quizID=${params.quizID}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setAttempts(data.attempts);
        setQuiz(data.quiz);
      }
    } catch (error) {
      console.error('Error fetching attempts:', error);
    }
  };

  const handleViewDetails = (attemptId) => {
    navigate('/Student/Results/' + attemptId + '/' + params.id);
  };

  const handleDone = () => {
    navigate(-1);
  };
  const handleToggleShowAllAttempts = () => {
    setShowAllAttempts(prevState => !prevState);
  };
  // Filter attempts to show only the highest marks made by the student
  const filteredAttempts = showAllAttempts ? attempts : attempts.reduce((acc, attempt) => {
    const existingAttempt = acc.find(a => a.studentID === attempt.studentID);
    if (!existingAttempt || attempt.score > existingAttempt.score) {
      return acc.filter(a => a.studentID !== attempt.studentID).concat(attempt);
    }
    return acc;
  }, []);


  return (
    <div>
      <h2>Quiz Results</h2>
      {attempts.length === 0 ? (
        <Typography variant="h5">No attempts have been marked for this quiz.</Typography>
      ) : ( 
        <>
        <Button variant="contained" color="primary" onClick={handleToggleShowAllAttempts}>
          {showAllAttempts ? 'Filter Highest Marks' : 'Show All Attempts'}
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Attempt Date</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAttempts.map((attempt, index) => (
                <TableRow key={index}>
                  <TableCell>{attempt.attemptDate}</TableCell>
                  <TableCell>{attempt.score}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="info" onClick={() => handleViewDetails(attempt.id)}>Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </>
      )}
      
        
       {/* "Done" button */}
       <Button variant="contained" color="secondary" onClick={handleDone} style={{ position: 'fixed', bottom: '20px', right: '20px' }}>Done</Button>
    </div>
  );
  }
  
  export default AttemptResults;