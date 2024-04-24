
import pytest
from auth import * 
from errors import AccessError
@pytest.fixture
def basic_pytest():
    '''Test that pytest and pylint are working'''
    assert 1 + 1 == 2

# test student login
def test_login_student():
    id = "1"
    password = "password"
    assert login(id, password) == "1"

# test admin login
def test_login_admin():
    id = "12"
    password = "password"
    assert login(id, password) == "12"

# test invalid password
def test_login_incorrect_password():
    id = "12"
    password = "pad"
    with pytest.raises(AccessError):
        login(id, password)

# test invalid zID
def test_login_invalid_id():
    id = "INVALID_ID"
    password = "pad"
    with pytest.raises(AccessError):
        login(id, password)

# test admin user type
def check_admin_login():
    id = "12"
    assert check_user_type(id) == "Admin"

# test student user type
def check_student_login():
    id = "1"
    assert check_user_type(id) == "Student"