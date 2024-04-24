import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, TextField, Container, Grid } from '@mui/material';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';
const AdminFeedback = () => {
    const [response, setResponse] = useState(null); // State to store response details
    const [question, setQuestion] = useState(null); // State to store question details
    const [feedback, setFeedback] = useState(null); // State to store feedback

  const navigate = useNavigate();
  const params = useParams();
  
  

  const fetchResponseDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5005/Response/Feedback?responseID=${params.responseID}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setResponse(data.response)
        setQuestion(data.question)
      }
    } catch (error) {
      alert(error)
    }
  };

  function getVariables(solution) {
    let v = [];
    // check if the solution has variables
    // check the solution's length if more than 1 than it has variables
    if (typeof solution === 'object' && !Array.isArray(solution)) {
        for (const key in solution) {
            if (key !== "solution") {
                v.push(solution[key]);
            }
        }
    }
    return v;
  }

  const submitFeedback = async () => {
    try {
      const response = await fetch(`http://localhost:5005/Response/Feedback`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        }, 
        body: JSON.stringify({
          id: params.responseID,
          userID: params.id,
          feedback: feedback
        })
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        navigate(-1)
      }
    } catch (error) {
      alert(error)
    }
  }

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

  const highlightColour = (answer) => {
    if (answer === 'realAnswer') {
      return 'lightgreen'
    } else if (answer === response.answer && response.marksGiven !== parseInt(question.marks)) {
      return 'lightcoral'
    } else {
      return 'inherit'
    }
  }

  const renderQuestionContent = (question, type) => {

    switch (type) {
      case 'shortanswer':
        return (
          <>
            <div style={{ marginBottom: '20px' }}>
              <Typography variant="h6">Question: {question.question}</Typography>
              <Typography variant="subtitle1">Type: {getQuestionTypeLabel(question.type)}</Typography>
              <Typography variant="subtitle1">Marks: {response.marksGiven}/{question.marks}</Typography>
            </div>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
						<div style={{ width: '60%', marginRight: '10px' }}>
						<Typography variant="subtitle1">Student Answer:</Typography>
						<TextField
								multiline
								rows={4}
								variant="outlined"
								fullWidth
								value={response.answer}
								InputProps={{
								readOnly: true,
								style: { overflowY: 'scroll', marginBottom: '10px', borderRadius: '10px' }
								}}
						/>
						</div>
						<div style={{ width: '60%' }}>
						<Typography variant="subtitle1">Ideal Answer:</Typography>
						<TextField
								multiline
								rows={4}
								variant="outlined"
								fullWidth
								value={response.idealAnswer}
								InputProps={{
								readOnly: true,
								style: { overflowY: 'scroll', marginBottom: '10px', borderRadius: '10px' }
								}}
						/>
						</div>
            </div>
            <div>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                placeholder="Provide your feedback here"
                // Add onChange handler to update feedback state
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          </>
        );
      case 'multiplechoice':
        return (
          <>
            <div style={{ marginBottom: '20px' }}>
              <Typography variant="h6">Question: {question.question}</Typography>
              <Typography variant="subtitle1">Type: {getQuestionTypeLabel(question.type)}</Typography>
              <Typography variant="subtitle1">Marks: {response.marksGiven}/{question.marks}</Typography>
            </div>
            
            <div>
              <Typography variant="h6">Answers</Typography>

              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {question.answers.map((answer, index) => (
                  <li key={index} style={{ marginBottom: '10px' }}>
                    <Typography variant="body1" style={{width: '8%', marginBottom: '10px', borderRadius: '10px', backgroundColor: highlightColour(answer) }}>
                    {index + 1}. {answer}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                placeholder="Provide your feedback here"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          </>

        );
      case 'truefalse':
        return (
          <>
            <div style={{ marginBottom: '20px' }}>
              <Typography variant="h6">Question: {question.question}</Typography>
              <Typography variant="subtitle1">Type: {getQuestionTypeLabel(question.type)}</Typography>
              <Typography variant="subtitle1">Marks: {response.marksGiven}/{question.marks}</Typography>
            </div>
            <div>
              <Typography variant="subtitle1">Student Answer:</Typography>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={response.answer}
                InputProps={{
                  readOnly: true,
                  style: { overflowY: 'scroll', marginBottom: '10px' }
                }}
              />
              <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                placeholder="Provide your feedback here"
                // Add onChange handler to update feedback state
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          </>

        );
      case 'coding':
        return (
          <>
            <div style={{ marginBottom: '20px' }}>
              <Typography variant="h6">Question: {question.question}</Typography>
              <Typography variant="subtitle1">Type: {getQuestionTypeLabel(question.type)}</Typography>
              <Typography variant="subtitle1">Marks: {response.marksGiven}/{question.marks}</Typography>
            </div>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <div style={{ width: '60%', marginRight: '10px' }}>
                <Typography variant="subtitle1">Student Answer:</Typography>
                <TextField
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={response.answer}
                  InputProps={{
                    readOnly: true,
                    style: { height: '200px', overflowY: 'scroll', marginBottom: '10px', borderRadius: '10px' }
                  }}
                />
              </div>
            </div>
            <div>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                placeholder="Provide your feedback here"
                // Add onChange handler to update feedback state
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          </>
        );
      default:
        return null;
    }
    
  }
  useEffect(() => {
    fetchResponseDetails();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      {/* Top left: Back button */}
      <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
      {question && renderQuestionContent(question, question.type)}
      <Button
        variant="contained"
        onClick={submitFeedback}
        style={{ position: 'absolute', bottom: '20px', right: '20px' }}
      >
        Add Feedback
      </Button>

      </div>
  );
}

export default AdminFeedback;
