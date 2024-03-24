import pytest
from errors import InputError
from helpers import get_question_response, get_quiz_attempt
from question_response import *
from question import create_coding_question
from automarking import automark_quiz
from errors import *

# this ID is an invalid ID used for testing purposes
nonExistantID = "invalid id"

@pytest.fixture
def basic_pytest():
    '''Test that pytest and pylint are working'''
    assert 1 + 1 == 2

# test the creation of a response to a question by a student
def test_create_question_response():
    studentID = 1
    questionID = 1
    quizAttemptID = 1
    stuResponse = "response"
    idealAnswer = "hello world\n"
    id = create_question_response(studentID, questionID, quizAttemptID, stuResponse)

    response = get_question_response(1, id)

    assert response == {
        "id": id,
        "questionID": questionID,
        "quizAttemptID": quizAttemptID,
        "answer": stuResponse,
        "idealAnswer": idealAnswer,
        "studentID": studentID,
        "marked": False,
        "marksGiven": 0
    }

# check that the response has been placed in the correct quiz attempt
def test_response_in_attempt():
    studentID = 1
    questionID = "c31a4d65-2a89-481a-9e24-4df3a8fceb51"
    quizAttemptID = 1
    stuResponse = "response"
    id = create_question_response(studentID, questionID, quizAttemptID, stuResponse)

    quiz = get_quiz_attempt(1, quizAttemptID)

    assert id in quiz["responses"]

# test that the student can edit a response after submiting before ending the quiz
def test_edit_question_response():
    studentID = 1
    questionID = 1
    quizAttemptID = 1
    stuResponse = "response"
    idealAnswer = "hello world\n"

    id = create_question_response(studentID, questionID, quizAttemptID, stuResponse)

    changes = {
        "id": id,
        "questionID": questionID,
        "quizAttemptID": quizAttemptID,
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
        "questionID": questionID,
        "quizAttemptID": quizAttemptID,
        "answer": "response has changed",
        "idealAnswer": idealAnswer,
        "studentID": studentID,
        "marked": False,
        "marksGiven": 0
    }

#? double check
# test that a response can be deleted by an admin
def test_delete_question_response():
    studentID = 1
    questionID = 1
    quizAttemptID = 1
    stuResponse = "response"
    id = create_question_response(studentID, questionID, quizAttemptID, stuResponse)
    delete_question_response(id, studentID)

    response = get_question_response(1, id)

    assert response == None

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
    questionID = 1
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