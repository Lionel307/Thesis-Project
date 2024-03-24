import json
from helpers import *
from errors import *
def create_course(id, title, numStudents):
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
    with open('database.json', 'r') as file:
        data = json.load(file)

    courses = []
    for course in data['courses']:
        if course["creatorID"] == zID:
            courses.append(course)

    return courses

if __name__ == "__main__":
    title = 'delete'
    numStudents = 100
    userID = 12
    id = create_course(userID, title, numStudents)
    delete_course(id, "he")
    print(get_course(id))