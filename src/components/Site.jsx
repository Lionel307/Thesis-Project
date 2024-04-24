import React from 'react';

import AddQuiz from '../pages/Add_Quiz';
import AddQuestion from '../pages/Add_Question';
import AdminFeedback from '../pages/Admin_Feedback';
import Admin_Home from '../pages/Admin_Home';
import AttemptDetails from '../pages/Attempt_Details';
import Attempt_Results from '../pages/Attempt_Results';
import Coding from '../pages/Coding';
import Course from '../pages/Course';
import Login from '../pages/Login';
import MarkQuiz from '../pages/Marking';
import MultipleChoice from '../pages/Multiple_Choice';
import Navbar from './Navbar';
import NewCourse from '../pages/Add_Course';
import Question from '../pages/Question';
import QuestionBank from '../pages/Question_bank';
import QuizAttempt from '../pages/Quiz_Attempt';
import Quiz_Details from '../pages/Quiz_Details';
import QuizResults from '../pages/Quiz_Results';
import Quiz from '../pages/Quiz';
import Quizzes from '../pages/Quizzes';
import ResultDetails from '../pages/Student_Attempt_Results';
import ShortAnswer from '../pages/Short_Answer';
import StudentFeedback from '../pages/Student_Feedback';
import Student_Home from '../pages/Student_Home';
import Student_Quizzes from '../pages/Student_Quizzes';
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
          {/* Student */}
          <Route path="/Student/Quizzes/:courseName/:id" element={<Student_Quizzes />} />
          <Route path="/Student/Attempt/Results/:quizID/:id" element={<Attempt_Results />} />
          <Route path="/Student/Feedback/:responseID/:id" element={<StudentFeedback />} />
          <Route path="/Student/Results/:attemptID/:id" element={<ResultDetails />} />
          <Route path="/Quiz/Attempt/:quizID/:attemptID/:id" element={<QuizAttempt />} />

          {/* Questions */}
          <Route path="/Question/Details/:questionID/:id" element={<Question />} />
          <Route path="/Question/New/:courseName/:id" element={<AddQuestion />} />
          <Route path="/Question/New-Coding/:courseName/:id" element={<Coding />} />
          <Route path="/Question/New-Multi/:courseName/:id" element={<MultipleChoice />} />
          <Route path="/Question/New-TrueFalse/:courseName/:id" element={<TrueFalse />} />
          <Route path="/Question/New-Short/:courseName/:id" element={<ShortAnswer />} />
          <Route path="/Question/Bank/:courseName/:id" element={<QuestionBank />} />
          <Route path="/Response/Feedback/:responseID/:id" element={<AdminFeedback />} />
          {/* Quizzes */}
          <Route path="/Mark-Quiz/:quizID/:id" element={<MarkQuiz />} />
          <Route path="/Quiz/New/:courseName/:id" element={<AddQuiz />} />
          <Route path="/Quiz/Details/:quizID/:id" element={<Quiz_Details />} />
          <Route path="/Quiz/Results/:quizID/:id" element={<QuizResults />} />
          <Route path="/Attempt/Details/:attemptID/:id" element={<AttemptDetails />} />
          <Route path="/Quizzes/:courseName/:id" element={<Quizzes />} />
          <Route path="/Quiz/Add-Questions/:courseName/:id" element={<Quiz />} />
          {/* Courses */}
          <Route path="/Course/:courseName/:id" element={<Course />} />
          <Route path="/Course/New/:id" element={<NewCourse />} />

          <Route path="/Home/Admin/:id" element={<Admin_Home />} />
          <Route path="/Home/Student/:id" element={<Student_Home />} />
          <Route path="/" element={<Login setTokenFn={setToken}/>} />
        </Routes>
      </div>
    );
  }
  
  export default Site;