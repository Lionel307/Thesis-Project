import React from 'react';
import { Grid, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';


const AddQuestion = () => {
  const navigate = useNavigate();
  const params = useParams();

  const handleNavigation = (path) => {
    navigate(`/Question/New-${path}/` + params.courseName + '/' + params.id);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={10} md={6} lg={3} style={{ height: '200px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNavigation('Short')}
            fullWidth
            sx={{ height: '100%', color: 'white' }}
          >
            Short Answer
          </Button>
        </Grid>
        <Grid item xs={10} md={6} lg={3} style={{ height: '200px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNavigation('Multi')}
            fullWidth
            sx={{ height: '100%', color: 'white' }}
          >
            Multiple Choice
          </Button>
        </Grid>
        <Grid item xs={10} md={6} lg={3} style={{ height: '200px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNavigation('TrueFalse')}
            fullWidth
            sx={{ height: '100%', color: 'white' }}
          >
            True False
          </Button>
        </Grid>
        <Grid item xs={10} md={6} lg={3} style={{ height: '200px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNavigation('Coding')}
            fullWidth
            sx={{ height: '100%', color: 'white' }}
          >
            Coding
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default AddQuestion;
