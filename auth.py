import json
from errors import AccessError
from helpers import check_admin_id
# def login(zID, password):
#     with open('database.json', 'r') as file:
#         data = json.load(file)
#     file.close()
#     for user in data['students']:
#         if user['id'] == zID and user['password'] == password:
#             return True
#     for user in data['admins']:
#         if user['id'] == zID and user['password'] == password:
#             return True
#     return False

def login(zID, password):
    with open('database.json', 'r') as file:
        data = json.load(file)

    for user_type in ['students', 'admins']:
        for user in data.get(user_type, []):
            if user['id'] == zID and user['password'] == password:
                return zID

    raise AccessError("Invalid zID or password")

def check_user_type(zID):
    if check_admin_id(zID):
        return 'Admin'
    else:
        return 'Student'