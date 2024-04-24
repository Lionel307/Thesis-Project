import React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {
  useNavigate,
  useParams
} from 'react-router-dom';
const NewCourse = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [newCourseTitle, setNewCourseTitle] = React.useState('');
  const [numStudents, setNumStudents] = React.useState('');
  const newCourse = async () => {
    const response = await fetch(`http://localhost:5005/Course/New`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        id: params.id,
        title: newCourseTitle,
        numStudents: numStudents
      })
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
        navigate('/Course/' + newCourseTitle + '/' + params.id)
    }
  }
    return (
      <>
    <Container component="main" maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5rem' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="newTitle"
            name="newTitle"
            aria-label='new Course title'
            label="New Course Title"
            fullWidth
            variant="standard"
            value={newCourseTitle}
            onChange={(e) => setNewCourseTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            type="number"
            InputProps={{ inputProps: { min: 1 } }}
            id="student"
            name="student"
            aria-label='Max number of students'
            label="Max number of students"
            fullWidth
            variant="standard"
            value={numStudents}
            onChange={(e) => setNumStudents(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button aria-label='submit new Course' sx={{ fontSize: '15pt' }} variant="outlined" name="create-new-Course" onClick={() => {
            // Handle form submission
            newCourse()
          }}>Create!</Button>
        </Grid>
      </Grid>
    </Container>
    </>
    );
  }
  
  export default NewCourse;