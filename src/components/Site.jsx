import React from 'react';

import AddQuiz from '../pages/Add_Quiz';
import AddQuestion from '../pages/Add_Question';
import Coding from '../pages/Coding';
import Course from '../pages/Course';
import DeleteQuestion from '../pages/Delete_Question';
import Edit_Question from '../pages/Edit_Question';
import Edit_Quiz from '../pages/Edit_Quiz';
import Admin_Home from '../pages/Admin_Home';
import Login from '../pages/Login';
import MarkQuiz from '../pages/Marking';
import MultipleChoice from '../pages/Multiple_Choice';
import Navbar from './Navbar';
import NewCourse from '../pages/Add_Course';
import Question from '../pages/Question';
import QuestionBank from '../pages/Question_bank';
import QuizAttempt from '../pages/Quiz_Attempt';
import Quiz from '../pages/Quiz';
import Quizzes from '../pages/Quizzes';
import Quiz_Details from '../pages/Quiz_Details';
import ShortAnswer from '../pages/Short_Answer';
import TrueFalse from '../pages/TrueFalse';

import {
    Routes,
    Route,
} from 'react-router-dom';

function Site () {
    const [token, setToken] = React.useState(null);
    return (
      <div>
        <Navbar />
        <Routes>
          {/* Questions */}
          <Route path="/Question/Details/:quizID/:id" element={<Question />} />
          <Route path="/Question/Edit/:courseName/:id" element={<Edit_Question />} />
          <Route path="/Question/New/:courseName/:id" element={<AddQuestion />} />
          <Route path="/Question/New-Coding/:courseName/:id" element={<Coding />} />
          <Route path="/Question/New-Multi/:courseName/:id" element={<MultipleChoice />} />
          <Route path="/Question/New-TrueFalse/:courseName/:id" element={<TrueFalse />} />
          <Route path="/Question/New-Short/:courseName/:id" element={<ShortAnswer />} />
          <Route path="/Question/Bank/:courseName/:id" element={<QuestionBank />} />
          {/* Quizzes */}
          <Route path="/Mark-Quiz/:quizID/:id" element={<MarkQuiz />} />
          <Route path="/Quiz/New/:courseName/:id" element={<AddQuiz />} />
          <Route path="/Quiz/Details/:quizID/:id" element={<Quiz_Details />} />
          <Route path="/Quiz-Attempt/:quizID/:id" element={<QuizAttempt />} />
          {/* <Route path="/Quiz/Edit/:quizID/:id" element={<Edit_Quiz />} /> */}
          <Route path="/Quizzes/:courseName/:id" element={<Quizzes />} />
          <Route path="/Quiz/Add-Questions/:courseName/:id" element={<Quiz />} />
          {/* Courses */}
          <Route path="/Course/:courseName/:id" element={<Course />} />
          <Route path="/Course/New/:id" element={<NewCourse />} />

          <Route path="/Home/Admin/:id" element={<Admin_Home />} />
          <Route path="/" element={<Login setTokenFn={setToken}/>} />
        </Routes>
      </div>
    );
  }
  
  export default Site;