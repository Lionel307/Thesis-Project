import json
from helpers import *
from errors import *
def create_course(id, title, numStudents):
    """
    Creates a new course
    Arguments:
        id -- the id of the user
        title -- the title of the course
        numStudents -- the max number of students
    Returns:
        the id of the new course
    """
    if check_admin_id(id):
        with open('database.json', 'r') as file:
            data = json.load(file)
        while True:
            new_id = generate_unique_id()
            if is_unique_id(data, new_id, "courses"):
                break

        newCourse = {
            "id":  new_id,
            "title": title,
            "creatorID": id,
            "maxStudents": numStudents,
            "students": []
        }

        data["courses"].append(newCourse)

        with open('database.json', 'w') as file:
            json.dump(data, file, indent=4)
        
        return new_id

def edit_course(courseID, userID, changes):
    """
    edits a course
    """
    with open('database.json', 'r') as file:
        data = json.load(file)
    found = False
    for course in data["courses"]:
        if course["id"] == courseID :
            found = True
            # check if user has permission to edit the course
            if course["creatorID"] == userID:
                data["courses"].remove(get_course(courseID))
                data["courses"].append(changes)
                with open('database.json', 'w') as file:
                    json.dump(data, file, indent=4)
                
            else:
                # AccessError is raised
                raise AccessError("You do not have permission to edit this course.")
    if not found:
        raise KeyError("This course does not exist")
    
def delete_course(courseID, userID):
    """
    deletes a course
    """
    with open('database.json', 'r') as file:
        data = json.load(file)
    
    for course in data['courses']:
        if course["id"] == id:
            # check if user has permission to delete the course
            if course["creatorID"] == userID:
                data["courses"].remove(get_course(courseID))
                with open('database.json', 'w') as file:
                    json.dump(data, file, indent=4)
                
            else:
                # AccessError is raised
                raise AccessError("You do not have permission to delete this course.")
            
def check_admins_courses(zID):
    """
    checks what courses are owned by the admin
    Returns:
        a list of courses
    """
    with open('database.json', 'r') as file:
        data = json.load(file)

    courses = []
    for course in data['courses']:
        if course["creatorID"] == zID:
            courses.append(course)

    return courses

def check_student_courses(zID):
    """
    checks what courses the student is enrolled in.
    Returns:
        a list of courses
    """
    with open('database.json', 'r') as file:
        data = json.load(file)
    courses = []
    for course in data['courses']:
        if zID in course['students']:
            courses.append(course)

    return courses

