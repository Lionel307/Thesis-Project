import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, TextField, Container, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
const MultipleChoice = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [newQuestion, setNewQuestion] = React.useState('');
  const [newSolution, setNewSolution] = React.useState('');
  const [newChoices, setNewChoices] = React.useState(['realAnswer']);
  const [newVariables, setNewVariables] = React.useState({});
  const [newMarks, setNewMarks] = React.useState(0);
  const [newAttempts, setNewAttempts] = React.useState(1)
  const handleVariableChange = (key, value) => {
    setNewVariables(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const handleAddVariable = () => {
    const newKey = `v${Object.keys(newVariables).length + 1}`;
    setNewVariables(prevState => ({
      ...prevState,
      [newKey]: ''
    }));
  };
   const handleRemoveVariable = (key) => {
    const { [key]: removedVariable, ...restVariables } = newVariables;
    setNewVariables(restVariables);
  };

  const handleNew = async () => {
    if (!newQuestion || !newSolution) {
      alert('Key information missing');
      return;
    }
    const solutionDict = {"solution": newSolution}
    const mergedDict = { ...solutionDict, ...newVariables };
  
    const response = await fetch(`http://localhost:5005/Question/New-Multi`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        course: params.courseName,
        solution: mergedDict,
        questionText: newQuestion,
        marks: newMarks,
        creatorID: params.id,
        attempts: newAttempts,
        answers: newChoices
      })
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      navigate('/Question/Bank/' + params.courseName + '/' + params.id)
    }
  }
  const handleOtherAnswerChange = (index, value) => {
    // Update the corresponding index in newChoices
    const updatedChoices = [...newChoices];
    updatedChoices[index] = value;
    setNewChoices(updatedChoices);
  };

  const handleTabKeyPress = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      // Insert a tab character at the cursor position
      const { selectionStart, selectionEnd } = event.target;
      const textBeforeCursor = event.target.value.substring(0, selectionStart);
      const textAfterCursor = event.target.value.substring(selectionEnd);
      const updatedValue = textBeforeCursor + '\t' + textAfterCursor;
      event.target.value = updatedValue;
    }
  };

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
                <Typography variant="h5">Question Information</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="newQuestion"
                  name="newQuestion"
                  label="Question Text"
                  fullWidth
                  variant="standard"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
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
                <TextField
                  id="newSolution"
                  name="newSolution"
                  label="Solution"
                  fullWidth
                  multiline
                  rows={12} // Adjust the number of rows as needed
                  variant="outlined" // Change the variant to "outlined"
                  value={newSolution}
                  onKeyDown={handleTabKeyPress}
                  onChange={(e) => setNewSolution(e.target.value)}
                  sx={{
                    width: '130%', // Set the width to 100%
                    height: '300px', // Set the height to 200px
                    padding: '10px'
                  }} // Add border and padding styles
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">Type: Multiple Choice</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">Course: {params.courseName}</Typography>
              </Grid>
              {/* Additional input boxes for other answers */}
              <Grid item xs={12}>
                <Typography variant="h5">Other Answers</Typography>
              </Grid>
              <Grid item xs={12}>
                {/* Input boxes for other answers */}
                {/* You can adjust the number of input boxes as needed */}
                <TextField
                  label="Answer 1"
                  fullWidth
                  onChange={(e) =>  handleOtherAnswerChange(1, e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Answer 2"
                  fullWidth
                  onChange={(e) =>  handleOtherAnswerChange(2, e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Answer 3"
                  fullWidth
                  onChange={(e) =>  handleOtherAnswerChange(3, e.target.value)}
                />
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

        {/* Right side: Display questions */}
        <div style={{ width: '45%' }}>
          <Typography variant="h5">Variables</Typography>
          <div style={{ maxHeight: '700px', overflowY: 'auto', marginBottom: '10px' }}>
            {Object.entries(newVariables).map(([key, value]) => (
               <Paper key={key} style={{ padding: '10px', marginBottom: '10px', border: '1px solid #ddd', position: 'relative' }}>
                <TextField
                  label={key}
                  fullWidth
                  value={value}
                  onChange={(e) => handleVariableChange(key, e.target.value)}
                />
               <Button
                 variant="contained"
                 color="error"
                 onClick={() => handleRemoveVariable(key)}
                 style={{ position: 'absolute', top: '5px', right: '5px' }}
               >
                 Remove
               </Button>
             </Paper>
            ))}
          </div>
          <Button variant="outlined" onClick={handleAddVariable}>Add Variable</Button>
        </div>
      </div>
      
    </div>
    );
  }
  
  export default MultipleChoice;