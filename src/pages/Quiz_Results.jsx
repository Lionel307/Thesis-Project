import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const QuizResults = () => {
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
      const response = await fetch(`http://localhost:5005/Quiz/Results?quizID=${params.quizID}`, {
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

  const handleDeleteAttempt = async (attemptId) => {
    const confirmed = window.confirm('Do you want to DELETE this attempt?');
    if (confirmed) {
      const response = await fetch(`http://localhost:5005/Quiz/Results`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          attemptID: attemptId,
          adminID: params.id,
        })
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      }
      window.location.reload();
    }
  };

  const handleViewDetails = (attemptId) => {
    navigate('/Attempt/Details/' + attemptId + '/' + params.id);
  };

  const handleDone = () => {
    navigate('/Quizzes/' + quiz.course + '/' + params.id);
  };

  const handleToggleShowAllAttempts = () => {
    setShowAllAttempts(prevState => !prevState);
  };

  // Filter attempts to show only the highest marks made by each student
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
      <Button variant="contained" color="primary" onClick={handleToggleShowAllAttempts}>
          {showAllAttempts ? 'Filter Highest Marks' : 'Show All Attempts'}
        </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Attempt Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAttempts.map((attempt, index) => (
              <TableRow key={index}>
                <TableCell>{attempt.studentID}</TableCell>
                <TableCell>{attempt.score}</TableCell>
                <TableCell>{attempt.attemptDate}</TableCell>
                <TableCell>
                  <Button variant="contained" color="info" onClick={() => handleViewDetails(attempt.id)}>Details</Button>
                  <Button variant="contained" color="error" onClick={() => handleDeleteAttempt(attempt.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

        
       {/* "Done" button */}
       <Button variant="contained" color="secondary" onClick={handleDone} style={{ position: 'fixed', bottom: '20px', right: '20px' }}>Done</Button>
    </div>
  );
}

export default QuizResults;
