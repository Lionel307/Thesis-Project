import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, TextField, Container, Grid, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const Quiz_Details = () => {
  const navigate = useNavigate();
  const params = useParams(); 

  const [quiz, setQuiz] = useState({}); // State to store quiz
  const [questions, setQuestions] = useState([]); // State to store the questions of the quiz
  const [numAttempts, setNumAttempts] = useState(0); // State to store the questions of the quiz
  const [editQuizTitle, setEditQuizTitle] = useState('');
  const [editAttemptsAllowed, setEditAttemptsAllowed] = useState(0);
  const [editTimeAllowed, setEditTimeAllowed] = useState(0);
  const [editDescription, setEditDescription] = useState('');
  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`http://localhost:5005/Quiz/Details?zID=${params.id}&quizID=${params.quizID}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      } else {
        setQuiz(data.quiz);
        setQuestions(data.questions);
        setNumAttempts(data.numAttempts);
        setEditQuizTitle(data.quiz.title);
        setEditAttemptsAllowed(data.quiz.attemptsAllowed);
        setEditDescription(data.quiz.description);
        setEditTimeAllowed(data.quiz.timeAllowed);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleMarkQuiz = async (id) => {
    const confirmed = window.confirm('Do you want to mark this quiz?');
    if (confirmed) {
      const response = await fetch(`http://localhost:5005/Quiz/Details`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          quizID: id
        })
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        navigate('/Quizzes/' + quiz.course + '/' + params.id)
      }
    }
  }

  const handleEdit = async () => {
    const editData = {
      "id": quiz.id,
      "title": editQuizTitle,
      "description": editDescription,
      "creator": quiz.creator,
      "course": quiz.course,
      "questions": quiz.questions,
      "attemptsAllowed": editAttemptsAllowed,
      "timeAllowed": editTimeAllowed,
      "isActive": quiz.isActive
    }
    const response = await fetch(`http://localhost:5005/Quiz/Details`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        id: params.quizID,
        creatorID: params.id,
        changes: editData
      })
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      navigate('/Quizzes/' + quiz.course + '/' + params.id)
    }
    
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Top left: Back button */}
      <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left side: Display quiz information */}
        <div style={{ width: '45%', marginRight: '5%' }}>
          <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5">Quiz Information</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="editTitle"
                  name="editTitle"
                  label="Edit Quiz Title"
                  fullWidth
                  variant="standard"
                  value={editQuizTitle}
                  onChange={(e) => setEditQuizTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  id="attemptsAllowed"
                  name="attemptsAllowed"
                  label="Attempts Allowed"
                  fullWidth
                  variant="standard"
                  value={editAttemptsAllowed}
                  onChange={(e) => setEditAttemptsAllowed(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="timeAllowed"
                  name="timeAllowed"
                  label="Time Allowed"
                  fullWidth
                  variant="standard"
                  value={editTimeAllowed}
                  onChange={(e) => setEditTimeAllowed(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="description"
                  name="description"
                  label="Description"
                  fullWidth
                  variant="standard"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">Number of Attempts: {numAttempts}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">Course: {quiz.course}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleEdit}>
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </Container>
        </div>

        {/* Right side: Display questions */}
        <div style={{ width: '45%' }}>
          <Typography variant="h5">Questions</Typography>
          {questions.map((question) => (
            <Paper key={question.id} style={{ padding: '10px', marginBottom: '10px', border: '1px solid #ddd' }}>
              <Typography variant="body1" gutterBottom>{question.question}</Typography>
              <Typography variant="body2" gutterBottom>Marks: {question.marks}</Typography>
              <Typography variant="body2" gutterBottom>Type: {getQuestionTypeLabel(question.type)}</Typography>
            </Paper>
          ))}
        </div>
      </div>
      
      {/* Buttons at the bottom right */}
      <Box sx={{ position: 'fixed', bottom: '20px', right: '20px', display: 'flex', gap: '10px' }}>
        <Button variant="contained" color="primary" size="large" onClick={() => handleMarkQuiz(quiz.id)}>
          Mark Quiz
        </Button>
      </Box>
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

export default Quiz_Details;

