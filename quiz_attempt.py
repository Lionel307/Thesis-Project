import json

from helpers import *
from errors import AccessError, QuizError
from quiz import live_quiz, create_quiz


def create_quiz_attempt(quizID, studentID, date):
    quiz = get_quiz(1, quizID)
    if quiz["isActive"] and check_attempts(studentID, quiz["attemptsAllowed"], quizID):
        with open('database.json', 'r') as file:
            data = json.load(file)
        

        while True:
            new_id = generate_unique_id()
            if is_unique_id(data, new_id, "quizAttempts"):
                break
        newAttempt = {
            "id": new_id,
            "quizID": quizID,
            "studentID": studentID,
            "responses": [],
            "score": 0,
            "attemptDate": date,
            "marked": False,
        }
        data["quizAttempts"].append(newAttempt)

        with open('database.json', 'w') as file:
            json.dump(data, file, indent=4)
        

        return new_id
    else:
        raise QuizError("You cannot attempt this quiz")



def delete_quiz_attempt(id, adminID):
    with open('database.json', 'r') as file:
        data = json.load(file)
    

    found = False

    for attempt in data["quizAttempts"]:
        # check if the attempt exists in database
        if attempt["id"] == id:
            found = True
            # check if user is an administrator
            if check_admin_id(adminID):
                data["quizAttempts"].remove(get_quiz_attempt("db", id))
                responses = get_all_responses(id)
                for response in data["questionResponses"]:
                    if response['id'] in responses:
                        data["questionResponses"].remove(response)
                with open('database.json', 'w') as file:
                    json.dump(data, file, indent=4)
                
            else:
                raise AccessError("You do not have permission to delete this quiz attempt.")

    if not found:
        raise KeyError("This quiz does not exist")     
    

def edit_attempt(id, adminID):
    print("edit quiz attempt after marking")
# checks if the student can attempt the quiz again
def check_attempts(stuID, numAttempts, quizID):
    count = 0
    with open('database.json', 'r') as file:
        data = json.load(file)
    

    for attempt in data["quizAttempts"]:
        if quizID == attempt["quizID"] and attempt["studentID"] == stuID:
            count += 1
    if count < int(numAttempts):
        return True
    else:
        return False
    
# returns the attempt with the highest score
def get_highest_mark_attempt(stuID, quizID):
    mark = 0
    id = " "
    with open('database.json', 'r') as file:
        data = json.load(file)
    

    for attempt in data["quizAttempts"]:
        if quizID == attempt["quizID"] and attempt["studentID"] == stuID:
            if attempt["score"] > mark:
                mark = attempt["score"]
                id = attempt["id"]
    return id
    


if __name__ == "__main__":
    print('test')