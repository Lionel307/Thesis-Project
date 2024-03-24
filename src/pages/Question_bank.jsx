import React from 'react';
import { Button } from '@mui/material';
import {
  useNavigate,
} from 'react-router-dom';
// import AddIcon from '@mui/icons-material/Add';

const QuestionBank = () => {
  const navigate = useNavigate();

  const goAddQuestion = () => {
    navigate('/Question/New/courseName/' + 'token')
  }

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          style={{
            borderRadius: '50%',
            width: '100px',
            height: '100px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          }}
          onClick={() => goAddQuestion() }
        >
          {/* <AddIcon /> */}
        </Button>
    </div>
  );
}
  
  export default QuestionBank;