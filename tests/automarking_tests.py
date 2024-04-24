import pytest
import requests
import fractions
from automarking import automark_quiz
from quiz_attempt import create_quiz_attempt
from question_response import create_question_response, create_code_response
from question import create_short_answer_question, create_coding_question
from quiz import create_quiz, live_quiz
from helpers import get_quiz_attempt, get_question_response

@pytest.fixture
def basic_pytest():
    '''Test that pytest and pylint are working'''
    assert 1 + 1 == 2

# test the automarking feature
# marks a quiz attempt and question response
def test_basic_automark():
    # create a question
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
    numAttempts = 1  
    timeAllowed = "00:00:20"
    quizID = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed)

    live_quiz(quizID, creatorID)

    # create quiz attempt
    studentID = 1
    attemptDate = "date"
    attemptID = create_quiz_attempt(quizID, studentID, attemptDate)

    # create a question response
    stuResponse = "hello world"
    responseID = create_question_response(questionID, studentID, attemptID, stuResponse)

    automark_quiz(quizID)
    attempt = get_quiz_attempt(1, attemptID)
    response = get_question_response(1, responseID)
    
    # checked the quiz has been marked and scored
    assert attempt["marked"] == True
    assert attempt["score"] == 10
    assert response["marked"] == True
    assert response["marksGiven"] == 10


# def long_quiz_automark():
def test_no_marks_automark():
    # create a question
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
    numAttempts = 1  
    timeAllowed = "00:00:20"
    quizID = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed)

    live_quiz(quizID, creatorID)

    # create quiz attempt
    studentID = 1
    attemptDate = "date"
    attemptID = create_quiz_attempt(quizID, studentID, attemptDate)

    # create a question response
    stuResponse = "hello woRLD\n"
    responseID = create_question_response(questionID, studentID, attemptID, stuResponse)

    automark_quiz(quizID)
    attempt = get_quiz_attempt(1, attemptID)
    response = get_question_response(1, responseID)

    # checked the quiz has been marked and scored
    assert attempt["marked"] == True
    assert attempt["score"] == 0
    assert response["marked"] == True
    assert response["marksGiven"] == 0

# test marking multiple students
def test_multiple_students():
    # create a question
    solution = {
        "solution": """
            print("hello world")
        """
    }
    questionText = "what is output of print('hello world')"
    marks = 10
    creatorID = 12
    attempts = 1
    questionID1 = create_short_answer_question(solution, questionText, marks, creatorID, attempts)

    solution = {
        "solution": """
            print("foobar")
        """
    }
    questionText = "what is output of print('foobar')"
    marks = 5
    creatorID = 12
    attempts = 1
    questionID2 = create_short_answer_question(solution, questionText, marks, creatorID, attempts)

    # create quiz
    title = 'multiple students title'
    description = "description test"
    creatorID = 12
    questions = [questionID1, questionID2]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    quizID = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed)

    # start quiz
    live_quiz(quizID, creatorID)

    # create quiz attempt
    studentID1 = 1
    attemptDate1 = "date"
    attemptID1 = create_quiz_attempt(quizID, studentID1, attemptDate1)

    # create a question response
    stuResponse = "hello world"
    responseID1 = create_question_response(questionID1, studentID1, attemptID1, stuResponse)

    stuResponse = "foobar"
    responseID2 = create_question_response(questionID2, studentID1, attemptID1, stuResponse)
    
    # create second quiz attempt
    studentID2 = 2
    attemptDate2 = "date"
    attemptID2 = create_quiz_attempt(quizID, studentID2, attemptDate2)

    # create second question response
    stuResponse = "hello woRLD\n"
    responseID3 = create_question_response(questionID1, studentID2, attemptID2, stuResponse)
    
    stuResponse = "fooba"
    responseID4 = create_question_response(questionID2, studentID2, attemptID2, stuResponse)

    automark_quiz(quizID)

    attempt1 = get_quiz_attempt(1, attemptID1)
    attempt2 = get_quiz_attempt(1, attemptID2)
    response1 = get_question_response(1, responseID1)
    response2 = get_question_response(1, responseID2)
    response3 = get_question_response(1, responseID3)
    response4 = get_question_response(1, responseID4)

    assert attempt1["marked"] == True
    assert attempt2["marked"] == True
    assert attempt1["score"] == 15
    assert attempt2["score"] == 0

    assert response1["marked"] == True
    assert response1["marksGiven"] == 10

    assert response2["marked"] == True
    assert response2["marksGiven"] == 5

    assert response3["marked"] == True
    assert response3["marksGiven"] == 0

    assert response4["marked"] == True
    assert response4["marksGiven"] == 0

# test that automark can mark a student's code
def test_mark_code_question():
    # create question and quiz
    # add question to the quiz
    # create quiz attempt and question response
    # mark quiz
    # test full makrs and partially correct answers 
    tests = [["add_numbers(1, 2)", 3], ["add_numbers(1, -1)", 0], ["add_numbers(10, -5)", 5], ["add_numbers(0, 0)", 0]]
    questionText = "Write a Python function called add_numbers that takes two numbers as input and returns their sum."
    marks = 10
    creatorID = 12
    attempts = 1
    functionName =  """
def add_numbers(a, b):
"""
    questionID = create_coding_question(tests, functionName, questionText, marks, creatorID, attempts)

    # create quiz
    title = 'test marked title'
    description = "description test"
    creatorID = 12
    questions = [questionID]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    quizID = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed)

    live_quiz(quizID, creatorID)

    # create quiz attempt
    studentID = 1
    attemptDate = "date"
    attemptID = create_quiz_attempt(quizID, studentID, attemptDate)

    # create a question response
    stuResponse = """
def add_numbers(a, b):
    return a + b
"""
    responseID = create_code_response(questionID, studentID, attemptID, stuResponse)
    automark_quiz(quizID)
    attempt = get_quiz_attempt(1, attemptID)
    response = get_question_response(1, responseID)

    assert attempt["marked"] == True
    assert attempt["score"] == float(10*fractions.Fraction(len(tests), len(tests)))
    assert response["marked"] == True
    assert response["marksGiven"] == float(10*fractions.Fraction(len(tests), len(tests)))

# test that automark can mark a student's code but there answer is partially correct
def test_mark_partially_correct_code_question():
    tests = [["add_numbers(1, 2)", 3], ["add_numbers(1, -1)", 0], ["add_numbers(10, -5)", 5], ["add_numbers(0, 0)", 0], ["add_numbers(10, -5)", 5], ["add_numbers(10, -5)", 5], ["add_numbers(10, -5)", 5]]
    questionText = "Write a Python function called add_numbers that takes two numbers as input and returns their sum."
    marks = 10
    creatorID = 12
    attempts = 1
    functionName = """
def add_numbers(a, b):
"""
    questionID = create_coding_question(tests, functionName, questionText, marks, creatorID, attempts)
    # create quiz
    title = 'test marked title'
    description = "description test"
    creatorID = 12
    questions = [questionID]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    quizID = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed)

    live_quiz(quizID, creatorID)

    # create quiz attempt
    studentID = 1
    attemptDate = "date"
    attemptID = create_quiz_attempt(quizID, studentID, attemptDate)

    # create a question response
    stuResponse = """
def add_numbers(a, b):
    return 0
"""
    responseID = create_code_response(questionID, studentID, attemptID, stuResponse)
    automark_quiz(quizID)
    attempt = get_quiz_attempt(1, attemptID)
    response = get_question_response(1, responseID)

    assert attempt["marked"] == True
    assert attempt["score"] == round(float(10*fractions.Fraction(2, len(tests))), 1)
    assert response["marked"] == True
    assert response["marksGiven"] == round(float(10*fractions.Fraction(2, len(tests))), 1)