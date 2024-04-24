import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';
const AttemptDetails = () => {
  const [attempt, setAttempt] = useState(null); // State to store attempt details
  const [responses, setResponses] = useState([]); // State to store responses
  const [marks, setMarks] = useState(0); // State to marks for each response
  const [totalMarks, setTotalMarks] = useState(0); // State to store responses
  const navigate = useNavigate();
  const params = useParams();
  // Fetch attempt details and responses when the component mounts
  useEffect(() => {
    fetchAttemptDetails();
  }, []);

  const fetchAttemptDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5005/Attempt/Details?attemptID=${params.attemptID}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setAttempt(data.attempt);
        setResponses(data.responses);
        setMarks(data.marks);
        setTotalMarks(data.totalMarks);
      }
    } catch (error) {
      console.error('Error fetching attempt details:', error);
    }
  };


  const handleDeleteResponse = async (id) => {
    const confirmed = window.confirm('Do you want to DELETE this response?');
    if (confirmed) {
      try {
        const response = await fetch(`http://localhost:5005/Attempt/Details`, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            userID: params.id,
            id: id,
          })
        });
        const data = await response.json();
        
        if (data.error) {
          alert(data.error);
        } else {
          // Remove the deleted response from the state
          setResponses(responses.filter(response => response.id !== id));
          // Reload the page
          window.location.reload();
        }
      } catch (error) {
        console.error('Error deleting response:', error);
      }
    }
  };
  
  const handleResponseFeedback = (id) => {
    navigate('/Response/Feedback/' + id + '/' + params.id);
  }

  return (
    <div>
      <h2>Attempt Details</h2>
      {attempt && (
        <div>
           <span style={{ fontSize: '48px' }}> {attempt.score} / {totalMarks}</span>
          <p>Attempt Date: {attempt.attemptDate}</p>
        </div>
      )}
      <h3>Question Responses</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Response ID</TableCell>
              <TableCell>Answer</TableCell>
              <TableCell>Marks Given</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {responses.map((response, index) => (
              <TableRow key={index}>
                <TableCell>{response.questionID}</TableCell>
                <TableCell>{response.answer}</TableCell>
                <TableCell>{response.marksGiven}/{marks[index]}</TableCell>
                <TableCell>
                  <Button variant="contained" color="error" onClick={() => handleDeleteResponse(response.id)}>Delete</Button>
                  <Button variant="contained" color="info" onClick={() => handleResponseFeedback(response.id)}>Feedback</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* "Done" button */}
      <Button variant="contained" color="secondary" onClick={() => navigate(-1)} style={{ position: 'fixed', bottom: '20px', right: '20px' }}>Done</Button>
    </div>
  );
}

export default AttemptDetails;
