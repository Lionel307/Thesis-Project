import React from 'react';
import { Grid, Button, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
// import QuizzesImage from './quizzes.jpg'; // Import your quizzes image
// import QuestionBankImage from './question_bank.jpg'; // Import your question bank image


const CoursePage = () => {
  const btnStyle = {
    width: '200px',
    height: '100px',
    margin: '16px',
  }
  const navigate = useNavigate();
  const params = useParams();

  const goQuestionbank = () => {
    navigate('/Question/Bank/' + params.courseName + '/' + params.id)
  }
  const goQuizzes = () => {
    navigate('/Quizzes/' + params.courseName + '/' + params.id)
  }
  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" height="100vh">
      {/* Display the course name */}
      <Typography variant="h3" gutterBottom>
        {params.courseName}
      </Typography>
      {/* Grid container for centered buttons */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item>
          <Button style={btnStyle} variant="contained" color="primary" onClick={goQuizzes}>
            <Typography variant="h6">Quizzes</Typography>
          </Button>
        </Grid>
        <Grid item>
          <Button style={btnStyle} variant="contained" color="primary" onClick={goQuestionbank}>
            <Typography variant="h6">Question Bank</Typography>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CoursePage;