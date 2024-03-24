import pytest

from course import *
from errors import *
from helpers import get_course

nonExistantID = "invalid id"

@pytest.fixture
def basic_pytest():
    '''Test that pytest and pylint are working'''
    assert 1 + 1 == 2

def test_create_course():
    title = 'COMP1511'
    numStudents = 100
    userID = 12
    id = create_course(userID, title, numStudents)
    assert get_course(id) == {
        "id": id,
        "title": title,
        "creatorID": userID,
        "maxStudents": numStudents,
        "students": []
    }

def test_edit_course():
    title = 'COMP1511'
    numStudents = 100
    userID = 12
    id = create_course(userID, title, numStudents)

    changes = {
        "id": id,
        "title": "new title",
        "creatorID": userID,
        "maxStudents": 19,
        "students": []
    }
    edit_course(id, userID, changes)
    assert get_course(id) == changes

def test_edit_course_not_admin():
    title = 'COMP1511'
    numStudents = 100
    userID = 12
    id = create_course(userID, title, numStudents)

    changes = {
        "id": id,
        "title": "new title",
        "creatorID": userID,
        "maxStudents": 19,
        "students": []
    }
    with pytest.raises(AccessError):
        edit_course(id, nonExistantID, changes)

def test_delete_course():
    title = 'delete'
    numStudents = 100
    userID = 12
    id = create_course(userID, title, numStudents)
    
    delete_course(id, userID)

    assert get_course(id) == None
    
def test_delete_course_not_admin():
    title = 'COMP1511'
    numStudents = 100
    userID = 12
    id = create_course(userID, title, numStudents)

    with pytest.raises(AccessError):
        delete_course(id, nonExistantID)