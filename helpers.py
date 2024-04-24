# Helper functions to grab info from the database
import json
import uuid
import random
import re
import ast

# gets info of a question
def get_question(db, questionID):
    with open("database.json", "r") as file:
        data = json.load(file)["questions"]
    
    for question in data:
        if question["id"] == questionID:
            return question
    return None

# gets info of a quiz
def get_quiz(db, quizID):
    with open("database.json", "r") as file:
        data = json.load(file)["quizzes"]
    
    for quiz in data:
        if quiz["id"] == quizID:
            return quiz
    return None

# gets info of a student
def get_student(db, studentID):
    with open("database.json", "r") as file:
        data = json.load(file)["students"]
    

    for student in data:
        if student["id"] == studentID:
            return student
    return None

# gets info of a quiz attempt
def get_quiz_attempt(db, attemptID):
    with open("database.json", "r") as file:
        data = json.load(file)["quizAttempts"]
    

    for attempt in data:
        if attempt["id"] == attemptID:
            return attempt
    return None

# gets the info of a question response
def get_question_response(db, responseID):
    with open("database.json", "r") as file:
        data = json.load(file)["questionResponses"]
    
    for response in data:
        if response["id"] == responseID:
            return response
    return None
    
# gets all the quizzes belonging to a course
def get_all_quizzes(userID, courseID):
    with open('database.json', 'r') as file:
        data = json.load(file)

    quizzes = []
    for quiz in data["quizzes"]:
        if quiz["creator"] == userID and quiz["course"] == courseID:
            quizzes.append(quiz)
    return quizzes

# gets all the questions belonging to a course
def get_all_questions(userID, courseID):
    with open('database.json', 'r') as file:
        data = json.load(file)

    questions = []
    for question in data["questions"]:
        if question["creator"] == userID and question["course"] == courseID:
            questions.append(question)
    return questions

# gets all the attempts in a quiz
def get_all_quiz_attempts(db, quizID):
    with open("database.json", "r") as file:
        data = json.load(file)["quizAttempts"]
    
    allAttempts = []

    for attempt in data:
        if attempt["quizID"] == quizID:
            allAttempts.append(attempt['id'])
    return allAttempts
    
# gets all the responses in a quiz attempt
def get_all_responses(attemptID):
    with open("database.json", "r") as file:
        data = json.load(file)
    
    allResponses = []

    for response in data["questionResponses"]:
        if response["quizAttemptID"] == attemptID:
            allResponses.append(response['id'])
    return allResponses

# gets the info of a course
def get_course(courseID):
    with open("database.json", "r") as file:
        data = json.load(file)["courses"]

    for course in data:
        if course["id"] == courseID:
            return course
    return None

# Generate a UUID (Universally Unique Identifier)
def generate_unique_id():
    unique_id = str(uuid.uuid4())
    return unique_id

# checks if the id is in the database
def is_unique_id(database, new_id, key):
    ids = [key["id"] for key in database[key]]
    return new_id not in ids

# check if id has authority
def check_admin_id(id):
    with open('database.json', 'r') as file:
        data = json.load(file)
    
    for user in data["admins"]:
        if user["id"] == id:
            return True
        
    return False

# extracts the variables from a solution dictionary
def get_variables(solution):
    v = []
    # check if the solution has variables
    # check the solution's length if more than 1 than it has variables
    if isinstance(solution, dict):
        for key, value in solution.items():
            if key != "solution":
            
                # choose a random variable a provided list of values
                if value.startswith("[") and value.endswith("]"):
                    my_list = ast.literal_eval(value)
                    item = random.choice(my_list)
                    if isinstance(item, str):
                        item =  '"' + item + '"'
                    
                    v.append(item)
                elif type(value) is int:
                    v.append(value)
                elif value is None:
                    raise ValueError("Variable cannot be empty")
                elif "random.randint(" in value:
                    pattern = r"\(\s*(\d+)\s*,\s*(\d+)\s*\)"

                    # Search for the pattern in the string
                    match = re.search(pattern, value)
                    value1, value2 = map(int, match.groups())
                    v.append(random.randint(value1, value2))
                else:
                    v.append(value) 
    return v


def get_quizzes_in_course(courseName):
    with open('database.json', 'r') as file:
        data = json.load(file)
    quizzes = []
    for quiz in data['quizzes']:
        if courseName == quiz['course']:
            quizzes.append(quiz)
    return quizzes

# resets the database to the backup state
def reset_to_backup_db():
    with open('backup.json', 'r') as file:
        # Read the contents of the source file
        data = json.load(file)
    
    with open('database.json', 'w') as file:
        json.dump(data, file, indent=4)
    

if __name__ == '__main__':
    reset_to_backup_db()