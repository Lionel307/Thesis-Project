import React, { useState } from 'react';
import { Button, Typography, TextField, Container, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const Coding = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [functionName, setFunctionName] = useState('');
  const [question, setQuestion] = useState('');
  const [tests, setTests] = useState([]);
  const [newMarks, setNewMarks] = useState(0);
  const [newAttempts, setNewAttempts] = useState(1);

  const handleAddTest = () => {
    setTests([...tests, ['', '']]);
  };

  const handleRemoveTest = (index) => {
    const updatedTests = [...tests];
    updatedTests.splice(index, 1);
    setTests(updatedTests);
  };

  const handleNew = async () => {
    const formattedTests = tests.map(([test, answer]) => [test.trim(), answer.trim()]);
    const response = await fetch(`http://localhost:5005/Question/New-Coding`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        course: params.courseName,
        tests: formattedTests,
        functionName: functionName,
        marks: newMarks,
        creatorID: params.id,
        attempts: newAttempts,
        questionText: question
      })
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      navigate('/Question/Bank/' + params.courseName + '/' + params.id)
    }
  };

  return (
    <div style={{ padding: '20px'}}>
      <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left side: Display quiz information */}

        <div style={{ width: '45%', marginRight: '5%' }}>
          <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5">Question Information</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="questionText"
                  name="questionText"
                  label="Question"
                  fullWidth
                  variant="standard"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="functionName"
                  name="functionName"
                  label="Function Name"
                  fullWidth
                  variant="standard"
                  value={functionName}
                  onChange={(e) => setFunctionName(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  type="number"
                  InputProps={{ inputProps: { min: 1 } }}
                  id="attemptsAllowed"
                  name="attemptsAllowed"
                  label="Attempts Allowed"
                  fullWidth
                  variant="standard"
                  value={newAttempts}
                  onChange={(e) => setNewAttempts(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  id="new marks"
                  name="new marks"
                  label="Marks Available"
                  fullWidth
                  variant="standard"
                  value={newMarks}
                  onChange={(e) => setNewMarks(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2">Type: Coding</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">Course: {params.courseName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNew}>
                  Create New Question
                </Button>
              </Grid>
            </Grid>
          </Container>
        </div>

        {/* Right side: Display tests */}
        <div style={{ width: '45%', overflowY: 'auto' }}>
          <Typography variant="h5">Tests</Typography>
          <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
            {tests.map((test, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TextField
                  label="Test"
                  fullWidth
                  value={test[0]}
                  onChange={(e) => {
                    const updatedTests = [...tests];
                    updatedTests[index][0] = e.target.value;
                    setTests(updatedTests);
                  }}
                />
                <TextField
                  label="Answer"
                  fullWidth
                  value={test[1]}
                  onChange={(e) => {
                    const updatedTests = [...tests];
                    updatedTests[index][1] = e.target.value;
                    setTests(updatedTests);
                  }}
                />
                <Button variant="contained" color="error" onClick={() => handleRemoveTest(index)}>Remove</Button>
              </div>
            ))}
          </div>
          <Button variant="outlined" onClick={handleAddTest}>Add Test</Button>
        </div>
      </div>
    </div>
  );
};

export default Coding;
