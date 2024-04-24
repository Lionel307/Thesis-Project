import json
from helpers import *
from code_solution import execute_solution
from errors import AccessError, InputError

def create_question_response(questionID, studentID, quizAttemptID, answer, variables):
    """
    creates a student's response to a question in a specific quiz attempt

    """
    with open('database.json', 'r') as file:
        data = json.load(file)
    while True:
        new_id = generate_unique_id()
        if is_unique_id(data, new_id, "questionResponses"):
            break

    # when the student attempts a question, the correct answer is stored in the response object
    question = get_question(1, questionID)
    # variables = get_variables(question['solution'])
    ideal_answer = execute_solution(question['solution'], variables)

    newResponse = {
        "id": new_id,
        "questionID": questionID,
        "quizAttemptID": quizAttemptID,
        "answer": answer,
        "idealAnswer": ideal_answer,
        "studentID": studentID,
        "marked": False,
        "marksGiven": 0
    }
    data["questionResponses"].append(newResponse)

    for attempt in data["quizAttempts"]:
        if attempt["id"] == quizAttemptID:
            attempt["responses"].append(new_id)

    with open('database.json', 'w') as file:
        json.dump(data, file, indent=4)

    return new_id

def create_code_response(questionID, studentID, quizAttemptID, answer):
    """
    creates a student's response to a coding question in a specific quiz attempt

    """
    with open('database.json', 'r') as file:
        data = json.load(file)
    while True:
        new_id = generate_unique_id()
        if is_unique_id(data, new_id, "questionResponses"):
            break
    newResponse = {
        "id": new_id,
        "questionID": questionID,
        "quizAttemptID": quizAttemptID,
        "answer": answer,
        "studentID": studentID,
        "marked": False,
        "marksGiven": 0
    }
    data["questionResponses"].append(newResponse)

    for attempt in data["quizAttempts"]:
        if attempt["id"] == quizAttemptID:
            attempt["responses"].append(new_id)

    with open('database.json', 'w') as file:
        json.dump(data, file, indent=4)

    return new_id

def delete_question_response(id, userID):
    """
    clears a question response (does not delete it from the database)
    Also removes thw marks
    """
    with open('database.json', 'r') as file:
        data = json.load(file)

    found = False

    for response in data["questionResponses"]:
        if response["id"] == id:
            found = True
            # check if user is the student that created the answer or an admin
            if response["studentID"] == userID or check_admin_id(userID):
                # Update answer to an empty string and marksGiven to 0.0
                
                for attempt in data["quizAttempts"]:
                    if id in attempt["responses"]:
                        attempt["score"] -= response["marksGiven"]

                response['answer'] = ''
                response['marksGiven'] = 0.0
                with open('database.json', 'w') as file:
                    json.dump(data, file, indent=4)
            else:
                # AccessError is raised
                raise AccessError("You do not have permission to delete this response.")
    if not found:
        raise InputError("This response does not exist")
    
def edit_question_response(id, userID, changes):
    """
    edits a question response
    """
    with open('database.json', 'r') as file:
        data = json.load(file)
    found = False

    for response in data["questionResponses"]:
        if response["id"] == id:
            found = True
            # check if user is the student that created the answer or an admin
            if response["studentID"] == userID or check_admin_id(userID):
                data["questionResponses"].remove(get_question_response("db", id))
                data["questionResponses"].append(changes)

                with open('database.json', 'w') as file:
                    json.dump(data, file, indent=4)
        
            else:
                # AccessError is raised
                raise AccessError("You do not have permission to delete this response.")
    if not found:
        raise InputError("This response does not exist")
    

def check_response(stuID, questionID, attemptID):
    """
    checks if this student has made a response to this question
    Arugments:
        stuID -- the id of the student
        questionID -- the question ID
        attemptID -- the attempt ID
    """
    attempt = get_quiz_attempt(1, attemptID)
    for response in attempt['responses']:
        res = get_question_response(1, response)
        # this student has a made a repsonse to this question
        if res['questionID'] == questionID and res['studentID'] == stuID:
            return True
    return False

def add_feedback(id, adminID, feedback):
    """"
    adds feedback to a specific response
    Arugments:
        id -- the id of the response
        adminID -- the admin
        feedback -- the feedback
    """
    with open('database.json', 'r') as file:
        data = json.load(file)
    found = False

    for response in data["questionResponses"]:
        if response["id"] == id:
            found = True
            # check if user is the student that created the answer or an admin
            if check_admin_id(adminID):
                response["feedback"] = feedback

                with open('database.json', 'w') as file:
                    json.dump(data, file, indent=4)
        
            else:
                # AccessError is raised
                raise AccessError("You do not have permission to write feedback to this response.")
    if not found:
        raise InputError("This response does not exist")