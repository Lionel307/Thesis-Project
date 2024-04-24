import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, TextField, Container, Grid } from '@mui/material';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';
const StudentFeedback = () => {
    const [response, setResponse] = useState(null); // State to store response details
    const [question, setQuestion] = useState(null); // State to store question details
    const [feedback, setFeedback] = useState(null); // State to store feedback

  const navigate = useNavigate();
  const params = useParams();
  
  

  const fetchResponseDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5005/Student/Feedback?responseID=${params.responseID}`, {
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
						<Typography variant="subtitle1">Marks: {response.marksGiven}/{question.marks}</Typography>
				</div>
				<div style={{ display: 'flex', marginBottom: '20px' }}>
						<div style={{ width: '60%', marginRight: '10px' }}>
						<Typography variant="subtitle1">Your Answer:</Typography>
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
						<Typography variant="subtitle1">Feedback:</Typography>
						<TextField
						multiline
						rows={4}
						variant="outlined"
						fullWidth
						value={response.feedback}
						InputProps={{
								readOnly: true,
								style: { overflowY: 'scroll', marginBottom: '10px', borderRadius: '10px' }
						}}
						/>
				</div>
				</>
        );
      case 'multiplechoice':
        return (
          <>
            <div style={{ marginBottom: '20px' }}>
              <Typography variant="h6">Question: {question.question}</Typography>
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
								<Typography variant="subtitle1">Feedback:</Typography>
								<TextField
								multiline
								rows={4}
								variant="outlined"
								fullWidth
								value={response.feedback}
								InputProps={{
										readOnly: true,
										style: { overflowY: 'scroll', marginBottom: '10px', borderRadius: '10px' }
								}}
								/>
						</div>
          </>
        );
      case 'truefalse':
        return (
          <>
            <div style={{ marginBottom: '20px' }}>
									<Typography variant="h6">Question: {question.question}</Typography>
									<Typography variant="subtitle1">Marks: {response.marksGiven}/{question.marks}</Typography>
						</div>
						<div style={{ display: 'flex', marginBottom: '20px' }}>
								<div style={{ width: '60%', marginRight: '10px' }}>
								<Typography variant="subtitle1">Your Answer:</Typography>
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
								<Typography variant="subtitle1">Feedback:</Typography>
								<TextField
								multiline
								rows={4}
								variant="outlined"
								fullWidth
								value={response.feedback}
								InputProps={{
										readOnly: true,
										style: { overflowY: 'scroll', marginBottom: '10px', borderRadius: '10px' }
								}}
								/>
						</div>
          </>
        );
      case 'coding':
        return (
          <>
            <div style={{ marginBottom: '20px' }}>
              <Typography variant="h6">Question: {question.question}</Typography>
              <Typography variant="subtitle1">Marks: {response.marksGiven}/{question.marks}</Typography>
            </div>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <div style={{ width: '60%', marginRight: '10px' }}>
                <Typography variant="subtitle1">Your Answer:</Typography>
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
								<Typography variant="subtitle1">Feedback:</Typography>
								<TextField
								multiline
								rows={4}
								variant="outlined"
								fullWidth
								value={response.feedback}
								InputProps={{
										readOnly: true,
										style: { overflowY: 'scroll', marginBottom: '10px', borderRadius: '10px' }
								}}
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
      

      </div>
  );
}

export default StudentFeedback;
