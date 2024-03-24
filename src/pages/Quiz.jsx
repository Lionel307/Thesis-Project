import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const Quiz = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const response = await fetch(`http://localhost:5005/Quiz/Add-Questions?zID=${params.id}&courseName=${params.courseName}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      setQuestions(data.questions);
    }
  };

  const handleAddQuestion = (question) => {
    const isQuestionSelected = selectedQuestions.some((q) => q.id === question.id);
    if (isQuestionSelected) {
      alert("This question has already been added.");
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const handleRemoveQuestion = (question) => {
    setSelectedQuestions(selectedQuestions.filter((q) => q.id !== question.id));
  };

  const handleCreateQuiz = async () => {
    const quizDataString = localStorage.getItem('quizData');
    const quizData = JSON.parse(quizDataString);
    const selectedQuestionIds = selectedQuestions.map(question => question.id);
    const response = await fetch(`http://localhost:5005/Quiz/Add-Questions`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        title: quizData.newQuizTitle,
        description: quizData.newDescription,
        course: params.courseName,
        creatorID: params.id,
        questions: selectedQuestionIds,
        attemptsAllowed: quizData.attempts,
        timeAllowed: quizData.time
      })
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      navigate('/Quizzes/' + params.courseName + '/' + params.id)
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      {/* Left side */}
      <div style={{ width: '45%', marginRight: '5%' }}>
        <Typography variant="h5">Questions</Typography>
        {questions.length === 0 ? (
          <Typography variant="body1">There are no questions for this course.</Typography>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {questions.map((question) => (
              <Paper key={question.id} style={{ padding: '10px', marginBottom: '10px', border: '1px solid #ddd' }}>
                <Typography variant="body1" gutterBottom>{question.question}</Typography>
                <Typography variant="body2" gutterBottom>Marks: {question.marks}</Typography>
                <Typography variant="body2" gutterBottom>Type: {getQuestionTypeLabel(question.type)}</Typography>
                <Button onClick={() => handleAddQuestion(question)} variant="outlined" color="primary">
                  Add
                </Button>
              </Paper>
            ))}
          </div>
        )}
      </div>

      {/* Right side */}
      <div style={{ width: '45%' }}>
        <Typography variant="h5">Selected Questions</Typography>
        {selectedQuestions.length === 0 ? (
          <Typography variant="body1">No questions selected.</Typography>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {selectedQuestions.map((question) => (
              <Paper key={question.id} style={{ padding: '10px', marginBottom: '10px', border: '1px solid #ddd' }}>
                <Typography variant="body1" gutterBottom>{question.question}</Typography>
                <Typography variant="body2" gutterBottom>Marks: {question.marks}</Typography>
                <Typography variant="body2" gutterBottom>Type: {getQuestionTypeLabel(question.type)}</Typography>
                <Button onClick={() => handleRemoveQuestion(question)} variant="outlined" color="secondary">
                  Remove
                </Button>
              </Paper>
            ))}
          </div>
        )}
      </div>

      {/* Create Quiz button */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleCreateQuiz}>
          Create Quiz
        </Button>
      </div>
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

export default Quiz;
