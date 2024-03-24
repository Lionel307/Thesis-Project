import pytest
import json

from question import *
from helpers import get_question, get_quiz
from quiz import create_quiz, delete_quiz

# this ID is an invalid ID used for testing purposes
nonExistantID = "invalid id"

@pytest.fixture
def basic_pytest():
    '''Test that pytest and pylint are working'''
    assert 1 + 1 == 2

# test the creation of a short answer question
def test_create_short_answer_question():
    solution = 'print("hello world")'
    questionText = "what is output of print('hello world')"
    marks = 10
    creatorID = "12"
    attempts = 1
    course = "courseTest"
    id = create_short_answer_question(solution, questionText, marks, creatorID, attempts, course)

    question = get_question(1, id)

    assert question == {
        "id": id,
        "course": course,
        "solution": solution,
        "question": questionText,
        "marks": marks,
        "creator": creatorID,
        "type": "shortanswer",
        "attempts": attempts
    }

# test the creation of a multiple choice question
def test_create_multiple_choice_question():
    solution = 'print("hello world")'
    questionText = "Question"
    answers = ["a", "b", "c", "d"]
    marks = 10
    creatorID = "12"
    attempts = 1
    course = "courseTest"

    id = create_multiple_choice_question(solution, questionText, answers, marks, creatorID, attempts, course)

    question = get_question(1, id)

    assert question == {
        "id": id,
        "course": course,
        "solution": solution,
        "question": questionText,
        "marks": marks,
        "creator": creatorID,
        "type": "multiplechoice",
        "answers": answers,
        "attempts": attempts
    }

# test the creation of a true/false question
def test_create_true_false_question():
    solution = {"solution": 
                """
            print(v1 == v1)
                """,
                "v1": 1
                }
    questionText = "what does v1 == v1 return"
    marks = 10
    creatorID = "12"
    attempts = 1
    course = "courseTest"

    id = create_true_false_question(solution, questionText, marks, creatorID, attempts, course)

    question = get_question(1, id)

    assert question == {
        "id": id,
        "course": course,
        "solution": solution,
        "question": questionText,
        "marks": marks,
        "type": "truefalse",
        "attempts": attempts
    }

# raise a name error if the solution has an undeclared variable
def test_create_question_NameError():
    solution = {
        "solution": """
            answer = ''
            for i in range(a, v1):
                if i % v2 == 0:
                    answer += v3
                else:
                    answer += str(i)
                answer += "\\n"

            print(answer)
        """,
        "v1": 16,
        "v2": 3,
        "v3": "shampoo"
        }
    questionText = "what is output of print('hello world')"
    marks = 10
    creatorID = "12"
    attempts = 1
    course = "courseTest"

    with pytest.raises(NameError):
        id = create_short_answer_question(solution, questionText, marks, creatorID, attempts, course)

# raise a syntax error if the solution has a syntax error
def test_create_question_SyntaxError():
    solution = 'print("hello world"'
    questionText = "what is output of print('hello world')"
    marks = 10
    creatorID = "12"
    attempts = 1
    course = "courseTest"

    with pytest.raises(SyntaxError):
        id = create_short_answer_question(solution, questionText, marks, creatorID, attempts, course)

# test a timeout error is raised when the script takes longer than 5 seconds to execute
def test_create_question_TimeOutError():
    solution = """
i = 0
while True:
    i += 1
print(i)
"""
    questionText = "what is output of print('hello world')"
    marks = 10
    creatorID = "12"
    attempts = 1
    course = "courseTest"

    with pytest.raises(TimeoutError):
        id = create_short_answer_question(solution, questionText, marks, creatorID, attempts, course)

# test the creation of a coding question
def test_create_coding_question():
    tests = [["add_numbers(1, 2)", 3], ["add_numbers(1, -1)", 0], ["add_numbers(10, -5)", 5], ["add_numbers(0, 0)", 0]]
    questionText = "Write a Python function called add_numbers that takes two numbers as input and returns their sum."
    marks = 10
    creatorID = "12"
    attempts = 1
    functionName =  """
def add_numbers(a, b):
"""
    course = "courseTest"

    id = create_coding_question(tests, functionName, questionText, marks, creatorID, attempts, course)

    question = get_question(1, id)

    assert question == {
        "id": id,
        "course": course,
        "tests": tests,
        "question": questionText,
        "marks": marks,
        "creator": creatorID,
        "type": "coding",
        "attempts": attempts,
        "functionName": functionName,
    }

# test the creation of a coding question with no tests
def test_create_coding_question_no_tests():
    tests = []
    questionText = "Write a Python function called add_numbers that takes two numbers as input and returns their sum."
    marks = 10
    creatorID = "12"
    attempts = 1
    functionName =  """
def add_numbers(a, b):
"""
    course = "courseTest"

    with pytest.raises(InputError):
        id = create_coding_question(tests, functionName, questionText, marks, creatorID, attempts, course)

# # when a question is created make sure the tests are valid
# #TODO
# def test_create_coding_question_invalid_function_name():
#     tests = [["add_numbers(1, 2", 3], ["add_numbers(1, -1)", 0], ["add_numbers(10, -5)", 5], ["add_numbers(0, 0)", 0]]

# #TODO change this test
# # test the creation of a coding question with invalid tests
# def test_create_coding_question_invalid_tests():
#     tests = [[1, 2, 3, 4], [-1, 1, 0], [10, -5, 5], [0, 0, 0]]
#     questionText = "Write a Python function called add_numbers that takes two numbers as input and returns their sum."
#     marks = 10
#     creatorID = "12"
#     attempts = 1
#     functionName =  """
# def add_numbers(a, b):
# """
#     with pytest.raises(ValueError):
#         id = create_coding_question(tests, functionName, questionText, marks, creatorID, attempts)


# test the deletion of a question
def test_delete_question():
    solution = 'print("hello world")'
    questionText = "Question to be deleted"
    marks = 10
    attempts = 1
    creatorID = "12"
    course = "courseTest"

    id = create_short_answer_question(solution, questionText, marks, creatorID, attempts, course)
    delete_question(id, creatorID)
    assert get_question(1, id) == None

# test when an authorised user deletes a question
def test_delete_question_unauthorised():
    solution = 'print("hello world")'
    questionText = "Question to delete but cannot be deleted"
    marks = 10
    creatorID = "12"
    attempts = 1
    course = "courseTest"

    id = create_short_answer_question(solution, questionText, marks, creatorID, attempts, course)
    with pytest.raises(AccessError):
        delete_question(id, nonExistantID)

# test editing a question
def test_edit_question():
    solution = 'print("hello world")'
    questionText = "Question"
    marks = 10
    creatorID = "12"
    attempts = 1
    course = "courseTest"

    id = create_short_answer_question(solution, questionText, marks, creatorID, attempts, course)
    changes = {
        "id": id,
        "course": course,
        "solution": 'print("world hello")',
        "question": "new Question",
        "marks": marks,
        "creator": creatorID,
        "type": "shortanswer",
        "attempts": attempts
    }
    edit_question(id, creatorID, changes)
    assert get_question(1, id) == changes

# test when an authorised user edits a question
def test_edit_question_unauthorized():
    solution = 'print("hello world")'
    questionText = "Question"
    marks = 10
    creatorID = "12"
    attempts = 1
    course = "courseTest"

    id = create_short_answer_question(solution, questionText, marks, creatorID, attempts, course)
    changes = {
        "id": id,
        "course": course,
        "solution": 'print("world hello")',
        "question": "new Question",
        "marks": marks,
        "creator": creatorID,
        "type": "shortanswer",
        "attempts": attempts
    }
    with pytest.raises(AccessError):
        edit_question(id, nonExistantID, changes)

# delete question should remove all questions from all quizzes
def test_delete_question_from_quizzes():
    solution = 'print("hello world")'
    questionText = "Question to be deleted"
    marks = 10
    quizOwnerID = "12"
    attempts = 1
    course = "courseTest"

    questionID = create_short_answer_question(solution, questionText, marks, quizOwnerID, attempts, course)

    title = 'dummy test'
    description = "foobar"
    questions = []
    numAttempts = 1  
    timeAllowed = "00:00:20"
    quizID1 = create_quiz(title, description, quizOwnerID, questions, numAttempts, timeAllowed, course)

    title = 'dummy test'
    description = "foobar"
    questions = []
    numAttempts = 1  
    timeAllowed = "00:00:20"
    quizID2 = create_quiz(title, description, quizOwnerID, questions, numAttempts, timeAllowed, course)

    delete_question(questionID, quizOwnerID)
    quiz1 = get_quiz(1, quizID1)
    quiz2 = get_quiz(1, quizID2)

    # clean up the database
    delete_quiz(quizID1, quizOwnerID)
    delete_quiz(quizID2, quizOwnerID)

    # check the question has been removed from both quizzes
    assert questionID not in quiz1["questions"]
    assert questionID not in quiz2["questions"]
    
# test adding a question to a quiz
def test_add_question():
    solution = 'print("hello world")'
    questionText = "Question to be added"
    marks = 10
    quizOwnerID = "12"
    attempts = 1
    course = "courseTest"

    questionID = create_short_answer_question(solution, questionText, marks, quizOwnerID, attempts, course)

    title = 'dummy test'
    description = "foobar"
    questions = []
    numAttempts = 1  
    timeAllowed = "00:00:20"
    quizID = create_quiz(title, description, quizOwnerID, questions, numAttempts, timeAllowed, course)

    questionList  = [questionID]

    add_question(questionList, quizID, quizOwnerID)
    quiz = get_quiz(1, quizID)
    for id in questionList:
        assert id in quiz["questions"]

# test adding a question to a quiz
def test_add_multiple_question():
    solution = 'print("hello world")'
    questionText = "Question to be added"
    marks = 10
    quizOwnerID = "12"
    attempts = 1
    course = "courseTest"

    questionID = create_short_answer_question(solution, questionText, marks, quizOwnerID, attempts, course)
    
    solution = 'print("hello world")'
    questionText = "another Question to be added"
    marks = 10
    quizOwnerID = "12"
    attempts = 1
    course = "courseTest"

    questionID2 = create_short_answer_question(solution, questionText, marks, quizOwnerID, attempts, course)
    
    title = 'dummy test'
    description = "foobar"
    questions = []
    numAttempts = 1  
    timeAllowed = "00:00:20"
    quizID = create_quiz(title, description, quizOwnerID, questions, numAttempts, timeAllowed, course)

    questionList  = [questionID, questionID2]

    add_question(questionList, quizID, quizOwnerID)
    quiz = get_quiz(1, quizID)
    for id in questionList:
        assert id in quiz["questions"]

# test when an authorised user adds a question to a quiz
def test_add_question_unauthorised():
    solution = 'print("hello world")'
    questionText = "Question to be added"
    marks = 10
    quizOwnerID = "12"
    attempts = 1
    course = "courseTest"

    questionID = create_short_answer_question(solution, questionText, marks, quizOwnerID, attempts, course)

    title = 'dummy test'
    description = "foobar"
    questions = []
    numAttempts = 1  
    timeAllowed = "00:00:20"
    quizID = create_quiz(title, description, quizOwnerID, questions, numAttempts, timeAllowed, course)

    # clean up database
    # delete_quiz(quizID, quizOwnerID)
    with pytest.raises(AccessError):
        add_question(questionID, quizID, nonExistantID)

#TODO
# test that an InputError is raised when a value is missing
def test_missing_value():
    solution = ''
    questionText = "Question to be added"
    marks = 10
    quizOwnerID = "12"
    attempts = 1
    course = "courseTest"

    with pytest.raises(InputError):
        create_short_answer_question(solution, questionText, marks, quizOwnerID, attempts, course)