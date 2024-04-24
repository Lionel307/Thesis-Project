import pytest
from quiz_attempt import *
from helpers import get_quiz_attempt
from errors import *
from quiz import create_quiz, delete_quiz, live_quiz
from question import *
from automarking import *
from question_response import *
# this ID is an invalid ID used for testing purposes
nonExistantID = "invalid id"



@pytest.fixture
def basic_pytest():
    '''Test that pytest and pylint are working'''
    assert 1 + 1 == 2

# test the creation of a quiz attempt
# as the student is answering each question, it should be appened to responses when subtmitted
def test_create_quiz_attempt():

    title = 'live quiz'
    description = "description test"
    creatorID = 12
    questions = [1, 2,3]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    quizID = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed)
    live_quiz(quizID, creatorID)

    studentID = 1
    attemptDate = "date"
    id = create_quiz_attempt(quizID, studentID, attemptDate)
    attempt = get_quiz_attempt(1, id)

    assert attempt == {
        "id": id,
        "quizID": quizID,
        "studentID": studentID,
        "responses": [],
        "score": 0,
        "attemptDate": attemptDate,
        "marked": False
    }

# test the delettion of a quiz attempt by an admin
def test_delete_quiz_attempt():
    title = 'live quiz'
    description = "description test"
    creatorID = 12
    questions = [1, 2,3]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    quizID = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed)
    live_quiz(quizID, creatorID)

    studentID = 1
    attemptDate = "date"
    id = create_quiz_attempt(quizID, studentID, attemptDate)
    adminID = 12
    delete_quiz_attempt(id, adminID)

    attempt = get_quiz_attempt(1, id)
    assert attempt == None

# test the deletion of a quiz attempt by an unauthorised user
def test_delete_quiz_attempt_unauthorised():
    title = 'live quiz'
    description = "description test"
    creatorID = 12
    questions = [1, 2,3]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    quizID = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed)
    live_quiz(quizID, creatorID)

    studentID = 1
    attemptDate = "date"
    id = create_quiz_attempt(quizID, studentID, attemptDate)

    with pytest.raises(AccessError):
        delete_quiz_attempt(id, nonExistantID)

# test new attempt but quiz is not live
def test_quiz_not_live():
    studentID = 1
    attemptDate = "date"

    title = 'not live quiz'
    description = "description test"
    creatorID = 12
    questions = [1, 2,3]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    quizID2 = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed)

    with pytest.raises(QuizError):
        create_quiz_attempt(quizID2, studentID, attemptDate)
    delete_quiz(quizID2, creatorID)

# test that the student cannot make another attempt if the quiz only allows for one
def test_multiple_attempts_not_allowed():
    title = 'live quiz'
    description = "description test"
    creatorID = 12
    questions = [1, 2,3]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    quizID = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed)
    live_quiz(quizID, creatorID)

    studentID = 1
    attemptDate = "date"
    create_quiz_attempt(quizID, studentID, attemptDate)
    with pytest.raises(QuizError):
        create_quiz_attempt(quizID, studentID, attemptDate)

# test the attempt with the highest mark is allocated to the student after multiple attempts
def test_multiple_attempts_highest_mark():
    solution = {
        "solution": """
            print("hello world")
        """
    }
    questionText = "what is output of print('hello world')"
    marks = 10
    creatorID = 12
    attempts = 1
    questionID = create_short_answer_question(solution, questionText, marks, creatorID, attempts)

    # create quiz
    title = 'test marked title'
    description = "description test"
    creatorID = 12
    questions = [questionID]
    numAttempts = 2  
    timeAllowed = "00:00:20"
    quizID = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed)

    live_quiz(quizID, creatorID)

    # create quiz attempt
    studentID = 1
    attemptDate = "date"
    attemptID = create_quiz_attempt(quizID, studentID, attemptDate)

    # create a question response
    stuResponse = ""
    create_question_response(questionID, studentID, attemptID, stuResponse)

    attemptDate = "date"
    attemptID = create_quiz_attempt(quizID, studentID, attemptDate)

    # create a question response
    stuResponse = "hello world"
    create_question_response(questionID, studentID, attemptID, stuResponse)

    automark_quiz(quizID)

    assert get_highest_mark_attempt(studentID, quizID) == attemptID

