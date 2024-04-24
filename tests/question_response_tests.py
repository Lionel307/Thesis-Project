import pytest
from errors import InputError
from helpers import get_question_response, get_quiz_attempt
from question_response import *
from question import create_coding_question, create_short_answer_question
from quiz import create_quiz, live_quiz
from quiz_attempt import create_quiz_attempt
from errors import *

# this ID is an invalid ID used for testing purposes
nonExistantID = "invalid id"

@pytest.fixture
def basic_pytest():
    '''Test that pytest and pylint are working'''
    assert 1 + 1 == 2

@pytest.fixture
def create_data():
    solution = 'print("hello world")'
    questionText = "what is output of print('hello world')"
    marks = 10
    creatorID = "12"
    attempts = 1
    course = "courseTest"

    questionID = create_short_answer_question(solution, questionText, marks, creatorID, attempts, course)
    print(questionID)
    title = '1st title'
    description = "description test"
    creatorID = "12"
    questions = [questionID]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    course = "CourseTest"

    quizID = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed, course)
    live_quiz(quizID, creatorID)
    studentID = "1"
    attemptDate = "date"
    attemptID = create_quiz_attempt(quizID, studentID, attemptDate)

    return [questionID, attemptID]

# test the creation of a response to a question by a student
def test_create_question_response(create_data):
    studentID = "1"

    stuResponse = "response"
    idealAnswer = "hello world"
    variables = []
    id = create_question_response(create_data[0], studentID, create_data[1], stuResponse, variables)

    response = get_question_response(1, id)

    assert response == {
        "id": id,
        "questionID": create_data[0],
        "quizAttemptID": create_data[1],
        "answer": stuResponse,
        "idealAnswer": idealAnswer,
        "studentID": studentID,
        "marked": False,
        "marksGiven": 0
    }

# check that the response has been placed in the correct quiz attempt
def test_response_in_attempt(create_data):
    studentID = "1"
    
    stuResponse = "response"
    variables = []
    
    id = create_question_response(create_data[0], studentID, create_data[1], stuResponse, variables)

    quiz = get_quiz_attempt(1, create_data[1])

    assert id in quiz["responses"]

# test that the student can edit a response after submiting before ending the quiz
def test_edit_question_response(create_data):
    studentID = "1"
    
    stuResponse = "response"
    idealAnswer = "hello world"
    variables = []

    id = create_question_response(create_data[0], studentID, create_data[1], stuResponse, variables)

    changes = {
        "id": id,
        "questionID": create_data[0],
        "quizAttemptID": create_data[1],
        "answer": "response has changed",
        "idealAnswer": idealAnswer,
        "studentID": studentID,
        "marked": False,
        "marksGiven": 0
    }

    edit_question_response(id, studentID, changes)

    response = get_question_response(1, id)

    assert response == {
        "id": id,
        "questionID": create_data[0],
        "quizAttemptID": create_data[1],
        "answer": "response has changed",
        "idealAnswer": idealAnswer,
        "studentID": studentID,
        "marked": False,
        "marksGiven": 0
    }

#? double check
# test that a response can be deleted by an admin
def test_delete_question_response(create_data):
    studentID = "1"
    stuResponse = "response"
    variables = []

    id = create_question_response(create_data[0], studentID, create_data[1], stuResponse, variables)
    delete_question_response(id, studentID)

    response = get_question_response(1, id)

    assert response['answer'] == ''
    if response['marked']:
        assert response['marksGiven'] == 0.0

# test the creation of a student response to a coding question
def test_create_coding_question_response():
    tests = [(1, 2, 3), (-1, 1, 0), (10, -5, 5), (0, 0, 0)]
    questionText = "Write a Python function called add_numbers that takes two numbers as input and returns their sum."
    marks = 10
    creatorID = 12
    attempts = 1
    functionName = "add_numbers(v1, v2)"
    questionID = create_coding_question(tests, functionName, questionText, marks, creatorID, attempts)

    studentID = 1
    quizAttemptID = 1
    stuResponse = """
def add_numbers(a, b):
    return a + b
"""
    id = create_code_response(studentID, questionID, quizAttemptID, stuResponse)

    response = get_question_response(1, id)
    assert response == {
        "id": id,
        "questionID": questionID,
        "quizAttemptID": quizAttemptID,
        "answer": stuResponse,
        "studentID": studentID,
        "marked": False,
        "marksGiven": 0
    }