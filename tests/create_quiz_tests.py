import pytest
import requests
import json
from quiz import *
from helpers import get_quiz

# this ID is an invalid ID used for testing purposes
nonExistantID = "invalid id"

@pytest.fixture
def basic_pytest():
    '''Test that pytest and pylint are working'''
    assert 1 + 1 == 2

# tests the quiz creation
def test_create_quiz():
    title = '1st title'
    description = "description test"
    creatorID = "12"
    questions = [1, 2,3]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    course = "CourseTest"
    id = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed, course)
    quiz = get_quiz("db", id)
    assert quiz == {
        "id": id, 
        "title": title, 
        "description": description,
        "creator": creatorID,
        "course": course,
        "questions": questions,
        "attemptsAllowed": numAttempts,
        "timeAllowed": timeAllowed,
        "isActive": False,
    }

# tests what happens when the optional description is missing
def test_no_description_quiz():
    title = "1st title"
    description = " "
    creatorID = "12"
    questions = [1, 2,3]
    numAttempts = "12"  
    timeAllowed = "00:00:20"
    course = "CourseTest"
    id = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed, course)
    quiz = get_quiz("db", id)
    assert quiz == {
        "id": id, 
        "title": title, 
        "description": " ",
        "creator": creatorID,
        "course": course,
        "questions": questions,
        "attemptsAllowed": numAttempts,
        "timeAllowed": timeAllowed,
        "isActive": False,
    }

# tests when an unauthorized user creates a new quiz 
def test_invalid_creator_id_quiz():
    title = '1st title'
    description = "description test"
    questions = [1, 2,3]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    course = "test"
    with pytest.raises(AccessError):
        create_quiz(title, description, nonExistantID, questions, numAttempts, timeAllowed, course)
  

# tests the edit quiz function
def test_edit_quiz():
    title = '1st title'
    description = "description test"
    creatorID = "12"
    questions = [1, 2, 3]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    course = "CourseTest"
    id = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed, course)
    changes = {
        "id": id,
        "title": 'new title',
        "description": "new description",
        "creator": creatorID,
        "course": course,
        "questions": [1, 2],
        "attemptsAllowed": 1,
        "timeAllowed": "00:00:20",
        "isActive": False
    }
    edit_quiz(id, creatorID, changes)
    edited_quiz = get_quiz("db", id)
    assert edited_quiz == {
        "id": id,
        "title": 'new title',
        "description": "new description",
        "creator": creatorID,
        "course": course,
        "questions": [1, 2],
        "attemptsAllowed": 1,
        "timeAllowed": "00:00:20",
        "isActive": False
    }



# tests what happens when an unathorized user tries to edit a quiz
def test_edit_quiz_not_creator():
    title = '1st title'
    description = "description test"
    creatorID = "12"
    questions = [1, 2,3]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    course = "CourseTest"
    id = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed, course)
    changes = {
        "id": id,
        "title": 'new title',
        "description": "new description",
        "creator": creatorID,
        "course": course,
        "questions": [],
        "attemptsAllowed": 1,
        "timeAllowed": "00:00:20",
        "isActive": False
    }

    with pytest.raises(AccessError):
        edit_quiz(id, nonExistantID, changes)

# test what happens when editing a quiz does not exist
def test_edit_missing_quiz():
    title = '1st title'
    description = "description test"
    creatorID = "12"
    questions = [1, 2,3]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    course = "CourseTest"
    id = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed, course)
    changes = {
        "id": id,
        "title": 'new title',
        "description": "new description",
        "creator": creatorID,
        "course": course,
        "questions": [],
        "attemptsAllowed": 1,
        "timeAllowed": "00:00:20",
        "isActive": False
    }
    with pytest.raises(KeyError):
        edit_quiz(nonExistantID, creatorID, changes)

# test the deletion of a quiz
def test_delete_quiz():
    title = 'delete title'
    description = "description test"
    creatorID = "12"
    questions = [1, 2,3]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    course = "CourseTest"
    id = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed, course)
    delete_quiz(id, creatorID)
    assert get_quiz("db", id) == None

# tests what happens when an unathorized user tries to delete a quiz
def test_delete_quiz_access_error():
    title = '1st title'
    description = "description test"
    creatorID = "12"
    questions = [1, 2,3]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    course = "CourseTest"
    id = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed, course)
    with pytest.raises(AccessError):
        delete_quiz(id, nonExistantID)

# test making a quiz live
def test_live_quiz():
    title = 'live title'
    description = "live description test"
    creatorID = "12"
    questions = [1, 2,3]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    course = "CourseTest"
    id = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed, course)
    live_quiz(id, creatorID)
    quiz = get_quiz("db", id)
    assert quiz == {
        "id": id, 
        "title": title, 
        "description": description,
        "creator": creatorID,
        "course": course,
        "questions": questions,
        "attemptsAllowed": numAttempts,
        "timeAllowed": timeAllowed,
        "isActive": True,
    }
    
# test what happens when a quiz that is already live goes live
def test_start_already_live_quiz():
    title = '1st title'
    description = "description test"
    creatorID = "12"
    questions = [1, 2,3]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    course = "CourseTest"
    id = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed, course)
    live_quiz(id, creatorID)

    with pytest.raises(QuizError):
        live_quiz(id, creatorID)

# test that the quiz ends after the time is up
def test_quiz_ends():
    title = 'timed quiz'
    description = "description test"
    creatorID = "12"
    questions = [1, 2,3]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    course = "CourseTest"
    id = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed, course)
    live_quiz(id, creatorID)

    quiz = get_quiz("db", id)
    assert quiz["isActive"] == False
# test if a user can add a question created by a different user
