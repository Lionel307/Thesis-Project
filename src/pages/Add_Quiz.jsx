import React from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';

const AddQuiz = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [newQuizTitle, setNewQuizTitle] = React.useState('');
  const [newDescription, setNewDescription] = React.useState('');
  const [attempts, setAttempts] = React.useState(1);
  const [hours, setHours] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);

  const formatTime = () => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const goToAddQuestion = () => {
    if (!newQuizTitle) {
      alert('Please enter a title for the quiz.');
      return;
    }

    const time = formatTime();
    const quizData = {
      newQuizTitle,
      newDescription,
      attempts,
      time,
    };
    localStorage.setItem('quizData', JSON.stringify(quizData));

    navigate('/Quiz/Add-Questions/' + params.courseName + '/' + params.id);
  };

  return (
    <div>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="newTitle"
              name="newTitle"
              aria-label='new Quiz title'
              label="New Quiz Title"
              fullWidth
              variant="standard"
              value={newQuizTitle}
              onChange={(e) => setNewQuizTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="description"
              name="description"
              aria-label='description'
              label="Quiz description"
              fullWidth
              variant="standard"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              id="attempts"
              name="attempts"
              aria-label='attempts allowed by a student'
              label="Number of attempts allowed"
              fullWidth
              variant="standard"
              value={attempts}
              onChange={(e) => setAttempts(e.target.value)}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              required
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              id="hours"
              name="hours"
              aria-label='hours'
              label="Hours"
              fullWidth
              variant="standard"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              required
              type="number"
              InputProps={{ inputProps: { min: 0, max: 59 } }}
              id="minutes"
              name="minutes"
              aria-label='minutes'
              label="Minutes"
              fullWidth
              variant="standard"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              required
              type="number"
              InputProps={{ inputProps: { min: 0, max: 59 } }}
              id="seconds"
              name="seconds"
              aria-label='seconds'
              label="Seconds"
              fullWidth
              variant="standard"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button aria-label='create new quiz' sx={{ fontSize: '15pt' }} variant="outlined" name="create-new-quiz" onClick={() => goToAddQuestion()}>Add Questions!</Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default AddQuiz;
