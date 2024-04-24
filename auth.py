import json
from errors import AccessError
from helpers import check_admin_id


def login(zID, password):
    """
    login a user
    """
    with open('database.json', 'r') as file:
        data = json.load(file)

    for user_type in ['students', 'admins']:
        for user in data.get(user_type, []):
            if user['id'] == zID and user['password'] == password:
                return zID

    raise AccessError("Invalid zID or password")

def check_user_type(zID):
    """
    checks the user type
    """
    if check_admin_id(zID):
        return 'Admin'
    else:
        return 'Student'