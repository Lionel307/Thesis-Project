import json
import datetime
from helpers import generate_unique_id, is_unique_id, check_admin_id, get_quiz
from errors import AccessError, InputError, QuizError

# creates a new quiz
def create_quiz(title, description, creatorID, questions, attemptsAllowed, timeAllowed, course):
    """
        create a new quiz
    """
    if check_admin_id(creatorID):
        with open('database.json', 'r') as file:
            data = json.load(file)
        
        while True:
            new_id = generate_unique_id()
            if is_unique_id(data, new_id, "quizzes"):
                break
            
        newQuiz = {
            "id": new_id,
            "title": title,
            "description": description,
            "creator": creatorID,
            "course": course,
            "questions": questions,
            "attemptsAllowed": attemptsAllowed,
            "timeAllowed": timeAllowed,
            "isActive": False
        }
        data["quizzes"].append(newQuiz)

        with open('database.json', 'w') as file:
            json.dump(data, file, indent=4)
        

        return new_id
    else:
        # user is not an admin  
        raise AccessError("You do not have permission to create a new quiz.")
   

    
# detletes a quiz
def delete_quiz(id, creatorID):
    """
        deletes a quiz
        Arguments: 
            - id of the quiz
            - id of the user that wants to delete the quiz
        Raises:
        AccessError: if the user did not create the quiz
    """
    with open('database.json', 'r') as file:
        data = json.load(file)
    

    for quiz in data['quizzes']:
        # find the quiz
        if quiz["id"] == id:
            # check if user has permission to delete the quiz
            if quiz["creator"] == creatorID:
                data["quizzes"].remove(get_quiz("db", id))
                with open('database.json', 'w') as file:
                    json.dump(data, file, indent=4)
                
            else:
                # AccessError is raised
                raise AccessError("You do not have permission to delete this quiz.")

    

# edit a quiz
def edit_quiz(id, creatorID, changes):
    """
        edits a quiz
        Arguments: 
            - id of the quiz
            - id of the user that wants to edit the quiz
            - the edits that need to be made
        Raises:
        AccessError: if the user did not create the quiz
    """
    with open('database.json', 'r') as file:
        data = json.load(file)
    
    found = False
    for quiz in data["quizzes"]:
        # find the quiz
        if quiz["id"] == id :
            found = True
            # check if user has permission to edit the quiz
            if quiz["creator"] == creatorID:
                data["quizzes"].remove(get_quiz("db", id))
                data["quizzes"].append(changes)
                with open('database.json', 'w') as file:
                    json.dump(data, file, indent=4)
                
            else:
                # AccessError is raised
                raise AccessError("You do not have permission to edit this quiz.")
    if not found:
        raise KeyError("This quiz does not exist")

# Start a quiz so students can attempt it
def live_quiz(id, creatorID):
    """
        Starts a quiz
        Arguments: 
            - id of the quiz
            - id of the user that wants to start the quiz
        Raises:
        QuizError: if the quiz is already live
        AccessError: if the user did not create the quiz
    """
    with open('database.json', 'r') as file:
        data = json.load(file)
    
    for quiz in data["quizzes"]:
        # find the quiz
        if quiz["id"] == id :
            # check if user owns the quiz
            if quiz["creator"] == creatorID:
                # check if quiz is already live
                if quiz["isActive"] == False:
                    quiz["isActive"] = True

                    with open('database.json', 'w') as file:
                        json.dump(data, file, indent=4)
                    
                else:
                    raise QuizError("This quiz is already live")
            else:
                # AccessError is raised
                raise AccessError("You do not own this quiz")

def end_quiz(quizID):
    """
        Ends a quiz which should happen after the time specified is reached (needs to be completed)
        Should be called in live quiz
        Arguments: 
            - id of the quiz
       
    """
    with open('database.json', 'r') as file:
        data = json.load(file)
    
    for quiz in data["quizzes"]:
        # find the quiz
        if quiz["id"] == quizID :
            quiz["isActive"] = False

            with open('database.json', 'w') as file:
                json.dump(data, file, indent=4)

