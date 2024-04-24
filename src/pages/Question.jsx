import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, TextField, Container, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
const Question = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [question, setQuestion] = useState([]); // State to store the question
  const [editQuestion, setEditQuestion] = useState('');
  const [editMarks, setEditMarks] = useState(0);
  const [editSolution, setEditSolution] = useState('');
  const [editVariables, setEditVariables] = useState({});
  const [editAttempts, setEditAttempts] = useState(0);
  const [tests, setTests] = useState([]);
  const [functionName, setFunctionName] = useState('');



  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`http://localhost:5005/Question/Details?zID=${params.id}&questionID=${params.questionID}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      } else {
        if (data.question.type !== 'coding') {
          setQuestion(data.question);
          setEditQuestion(data.question.question);
          setEditMarks(data.question.marks);
          setEditSolution(data.question.solution.solution);
          setEditAttempts(data.question.attempts);
          getVariables(data.question.solution)
        } else {
          setQuestion(data.question);
          setEditQuestion(data.question.question);
          setEditMarks(data.question.marks);
          setEditAttempts(data.question.attempts);
          setFunctionName(data.question.functionName)
          setTests(data.question.tests)
        }
        
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const getVariables = (solution) => {
    if (Object.keys(solution).length > 1) {
      // Get an array of entries (arrays) from the existing dictionary
      const entries = Object.entries(solution);

      // Remove the first entry (array) from the entries array
      const [, ...remainingEntries] = entries;
      const newDict = Object.fromEntries(remainingEntries);
      setEditVariables(newDict)
    }
  }

  const handleEdit = async () => {
    const solutionDict = {"solution": editSolution}
    const mergedDict = { ...solutionDict, ...editVariables };
    let editData = ''
    let response = ''
    let data = ''
    switch (question.type) {
      case "shortanswer":
        editData = {
          "id": question.id,
          "course": question.course,
          "solution": mergedDict,
          "question": editQuestion,
          "marks": editMarks,
          "creator": question.creator,
          "type": question.type,
          "attempts": editAttempts
        }
        response = await fetch(`http://localhost:5005/Question/Details`, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            id: params.questionID,
            creatorID: params.id,
            changes: editData
          })
        });
        data = await response.json();
        if (data.error) {
          alert(data.error);
        } else {
          navigate('/Question/Bank/' + question.course + '/' + params.id)
        }
        break;
      case "multiplechoice":
        editData = {
          "id": question.id,
          "course": question.course,
          "solution": mergedDict,
          "question": editQuestion,
          "marks": editMarks,
          "creator": question.creator,
          "type": question.type,
          "attempts": editAttempts,
          "answers": question.answers
        }
        response = await fetch(`http://localhost:5005/Question/Details`, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            id: params.questionID,
            creatorID: params.id,
            changes: editData
          })
        });
        data = await response.json();
        if (data.error) {
          alert(data.error);
        } else {
          navigate('/Question/Bank/' + question.course + '/' + params.id)
        }
        break;
      case "truefalse":
        editData = {
          "id": question.id,
          "course": question.course,
          "solution": mergedDict,
          "question": editQuestion,
          "marks": editMarks,
          "creator": question.creator,
          "type": question.type,
          "attempts": editAttempts
        }
        response = await fetch(`http://localhost:5005/Question/Details`, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            id: params.questionID,
            creatorID: params.id,
            changes: editData
          })
        });
        data = await response.json();
        if (data.error) {
          alert(data.error);
        } else {
          navigate('/Question/Bank/' + question.course + '/' + params.id)
        }
        break;
      case "coding":
        editData = {
          "id": question.id,
          "course": question.course,
          "question": editQuestion,
          "marks": editMarks,
          "creator": question.creator,
          "type": question.type,
          "attempts": editAttempts,
          "tests": tests,
          "functionName": functionName
        }
        response = await fetch(`http://localhost:5005/Question/Details`, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            id: params.questionID,
            creatorID: params.id,
            changes: editData
          })
        });
        data = await response.json();
        if (data.error) {
          alert(data.error);
        } else {
          navigate('/Question/Bank/' + question.course + '/' + params.id)
        }
        break;
    }
  }
  const handleVariableChange = (key, value) => {
    setEditVariables(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const handleAddVariable = () => {
    const newKey = `v${Object.keys(editVariables).length + 1}`;
    setEditVariables(prevState => ({
      ...prevState,
      [newKey]: ''
    }));
  };
   const handleRemoveVariable = (key) => {
    const { [key]: removedVariable, ...restVariables } = editVariables;
    setEditVariables(restVariables);
  };

  const handleAddTest = () => {
    setTests([...tests, ['', '']]);
  };

  const handleRemoveTest = (index) => {
    const updatedTests = [...tests];
    updatedTests.splice(index, 1);
    setTests(updatedTests);
  };

  const renderQuestionContent = (question, type) => {
    switch (type) {
      case 'shortanswer':
        return (
          <>
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
                        id="editQuestion"
                        name="editQuestion"
                        label="Question Text"
                        fullWidth
                        variant="standard"
                        value={editQuestion}
                        onChange={(e) => setEditQuestion(e.target.value)}
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
                        value={editAttempts}
                        onChange={(e) => setEditAttempts(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        id="edit marks"
                        name="edit marks"
                        label="Marks Available"
                        fullWidth
                        variant="standard"
                        value={editMarks}
                        onChange={(e) => setEditMarks(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="editSolution"
                        name="editSolution"
                        label="Solution"
                        fullWidth
                        multiline
                        rows={12} // Adjust the number of rows as needed
                        variant="outlined" // Change the variant to "outlined"
                        value={editSolution}
                        onChange={(e) => setEditSolution(e.target.value)}
                        sx={{
                          width: '130%', // Set the width to 100%
                          height: '300px', // Set the height to 200px
                          padding: '10px'
                        }} // Add border and padding styles
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">Type: {getQuestionTypeLabel(question.type)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">Course: {question.course}</Typography>
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
                <Typography variant="h5">Variables</Typography>
                <div style={{ maxHeight: '700px', overflowY: 'auto', marginBottom: '10px' }}>
                  {Object.entries(editVariables).map(([key, value]) => (
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
          </>
        );
      case 'multiplechoice':
        return (
          <>
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
                        id="editQuestion"
                        name="editQuestion"
                        label="Question Text"
                        fullWidth
                        variant="standard"
                        value={editQuestion}
                        onChange={(e) => setEditQuestion(e.target.value)}
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
                        value={editAttempts}
                        onChange={(e) => setEditAttempts(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        id="edit marks"
                        name="edit marks"
                        label="Marks Available"
                        fullWidth
                        variant="standard"
                        value={editMarks}
                        onChange={(e) => setEditMarks(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="editSolution"
                        name="editSolution"
                        label="Solution"
                        fullWidth
                        multiline
                        rows={12} // Adjust the number of rows as needed
                        variant="outlined" // Change the variant to "outlined"
                        value={editSolution}
                        onChange={(e) => setEditSolution(e.target.value)}
                        sx={{
                          width: '130%', // Set the width to 100%
                          height: '300px', // Set the height to 200px
                          padding: '10px'
                        }} // Add border and padding styles
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">Type: {getQuestionTypeLabel(question.type)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">Course: {question.course}</Typography>
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
                <Typography variant="h5">Variables</Typography>
                <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '10px' }}>
                  {Object.entries(editVariables).map(([key, value]) => (
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
                <Typography variant="h5">Other Answers</Typography>
              <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '10px' }}>
                {/* Display answers except for 'realAnswer' */}
                {question.answers.map((answer, index) => (
                  answer !== 'realAnswer' && (
                    <Paper key={index} style={{ padding: '10px', marginBottom: '10px', border: '1px solid #ddd', position: 'relative' }}>
                      <TextField
                        label={`Answer ${index + 1}`}
                        fullWidth
                        multiline
                        value={answer}
                        onChange={(e) => {
                          const updatedAnswers = [...question.answers];
                          updatedAnswers[index] = e.target.value;
                          setQuestion(prevQuestion => ({
                            ...prevQuestion,
                            answers: updatedAnswers
                          }));
                        }}
                      />
                    </Paper>
                  )
                ))}
              </div>
              </div>
              
            </div>
          </>
        );
      case 'truefalse':
        return (
          <>
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
                        id="editQuestion"
                        name="editQuestion"
                        label="Question Text"
                        fullWidth
                        variant="standard"
                        value={editQuestion}
                        onChange={(e) => setEditQuestion(e.target.value)}
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
                        value={editAttempts}
                        onChange={(e) => setEditAttempts(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        id="edit marks"
                        name="edit marks"
                        label="Marks Available"
                        fullWidth
                        variant="standard"
                        value={editMarks}
                        onChange={(e) => setEditMarks(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="editSolution"
                        name="editSolution"
                        label="Solution"
                        fullWidth
                        multiline
                        rows={12} // Adjust the number of rows as needed
                        variant="outlined" // Change the variant to "outlined"
                        value={editSolution}
                        onChange={(e) => setEditSolution(e.target.value)}
                        sx={{
                          width: '130%', // Set the width to 100%
                          height: '300px', // Set the height to 200px
                          padding: '10px'
                        }} // Add border and padding styles
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">Type: {getQuestionTypeLabel(question.type)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">Course: {question.course}</Typography>
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
                <Typography variant="h5">Variables</Typography>
                <div style={{ maxHeight: '700px', overflowY: 'auto', marginBottom: '10px' }}>
                  {Object.entries(editVariables).map(([key, value]) => (
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
          </>
        );
      case 'coding':
        return (
          <>
          <div style={{ padding: '20px', display: 'flex' }}>
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
                      value={editQuestion}
                      onChange={(e) => setEditQuestion(e.target.value)}
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
                      value={editAttempts}
                      onChange={(e) => setEditAttempts(e.target.value)}
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
                      value={editMarks}
                      onChange={(e) => setEditMarks(e.target.value)}
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
                      onClick={handleEdit}>
                      Save Changes
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
          </>
        );
      default:
        return null;
    }
  }

    return (
      <div style={{ padding: '20px' }}>
      {/* Top left: Back button */}
      <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
      {renderQuestionContent(question, question.type)}
      </div>
    );
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
  export default Question;