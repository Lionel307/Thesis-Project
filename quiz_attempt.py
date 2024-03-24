import json

from helpers import generate_unique_id, is_unique_id, get_quiz, check_admin_id, get_quiz_attempt
from errors import AccessError, QuizError
from quiz import live_quiz, create_quiz


def create_quiz_attempt(quizID, studentID, date):
    quiz = get_quiz(1, quizID)
    if quiz["isActive"] and check_attempts(studentID, quiz["attemptsAllowed"], quizID):
        with open('database.json', 'r') as file:
            data = json.load(file)
        file.close()

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
        file.close()

        return new_id
    else:
        raise QuizError("You cannot attempt this quiz")



def delete_quiz_attempt(id, adminID):
    with open('database.json', 'r') as file:
        data = json.load(file)
    file.close()

    found = False

    for attempt in data["quizAttempts"]:
        # check if the attempt exists in database
        if attempt["id"] == id:
            found = True
            # check if user is an administrator
            if check_admin_id(adminID):
                data["quizAttempts"].remove(get_quiz_attempt("db", id))
                with open('database.json', 'w') as file:
                        json.dump(data, file, indent=4)
                file.close()
            else:
                raise AccessError("You do not have permission to delete this quiz attempt.")

    if not found:
        raise KeyError("This quiz does not exist")     
    
# checks if the student can attempt the quiz again
def check_attempts(stuID, numAttempts, quizID):
    count = 0
    with open('database.json', 'r') as file:
        data = json.load(file)
    file.close()

    for attempt in data["quizAttempts"]:
        if quizID == attempt["quizID"] and attempt["studentID"] == stuID:
            count += 1
    if count < numAttempts:
        return True
    else:
        return False
    
# returns the attempt with the highest score
def get_highest_mark_attempt(stuID, quizID):
    mark = 0
    id = " "
    with open('database.json', 'r') as file:
        data = json.load(file)
    file.close()

    for attempt in data["quizAttempts"]:
        if quizID == attempt["quizID"] and attempt["studentID"] == stuID:
            if attempt["score"] > mark:
                mark = attempt["score"]
                id = attempt["id"]
    return id
    


if __name__ == "__main__":
    print('test')