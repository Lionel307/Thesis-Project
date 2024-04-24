import json
from helpers import generate_unique_id, is_unique_id, check_admin_id, get_question, get_variables
from errors import AccessError, InputError
from code_solution import execute_solution

# validates the solution works and has no errors
def validate_solution(solution):
    """
    checks if solution is valid during the creation of the solution
    """
    variables = get_variables(solution)
    try:
        valid_question = execute_solution(solution, variables)
        if valid_question == "Error":
            raise InputError("Error with the solution")
        return True
    except SyntaxError:
        raise SyntaxError("There is a Syntax Error with the solution.")
    except NameError:
        raise NameError("There is a Name Error with the solution.")
    except TimeoutError:
        raise TimeoutError("There is a Timeout Error with the solution.")

# creates a multiple choice question
def create_multiple_choice_question(solution, questionText, answers, marks, creatorID, attempts, course):
    """
        create a multiple choice question
        Arguements:
            - solution
            - questionText
            - list of answers
            - available marks
            - the id of the creator
            - course name
            - number of attempts
        Returns:
            - the id of the newly created question
        Raises:
        AccessError: if the user is not an admin
        InputError: if a value is missing
    """
    if check_admin_id(creatorID):
        with open('database.json', 'r') as file:
            data = json.load(file)

        while True:
            new_id = generate_unique_id()
            if is_unique_id(data, new_id, "questions"):
                break

        if validate_solution(solution):
            newQuestion = {
                "id": new_id,
                "course": course,
                "solution": solution,
                "question": questionText,
                "marks": marks,
                "creator": creatorID,
                "type": "multiplechoice",
                "answers": answers,
                "attempts": attempts,
            }
            data["questions"].append(newQuestion)

            with open('database.json', 'w') as file:
                json.dump(data, file, indent=4)
    

            return new_id
    else:
        # user is not an admin
        raise AccessError("You do not have permission to create a new question.")


# chreates a short answer question
def create_short_answer_question(solution, questionText, marks, creatorID, attempts, course):
    """
        create a short question
        Arguements:
            - solution
            - questionText
            - available marks
            - the id of the creator
            - course name
            - number of attempts
        Returns:
            - the id of the newly created question
        Raises:
        AccessError: if the user is not an admin
        InputError: if a value is missing
    """
    if check_admin_id(creatorID):
        with open('database.json', 'r') as file:
            data = json.load(file)

        while True:
            new_id = generate_unique_id()
            if is_unique_id(data, new_id, "questions"):
                break

        # checks if the question has a valid solution
        if validate_solution(solution):
            newQuestion = {
                "id": new_id,
                "course": course,
                "solution": solution,
                "question": questionText,
                "marks": marks,
                "creator": creatorID,
                "type": "shortanswer",
                "attempts": attempts,
            }

            data["questions"].append(newQuestion)

            with open('database.json', 'w') as file:
                json.dump(data, file, indent=4)
    

            return new_id
    else:
        # user is not an admin    
        raise AccessError("You do not have permission to create a new question.")
    
    

# creates a true false question
def create_true_false_question(solution, questionText, marks, creatorID, attempts, course):
    """
        creates a true false question
        Arguments:
            - solution
            - questionText
            - available marks
            - the id of the creator
            - course name
            - number of attempts
        Returns:
            - the id of the newly created question
        Raises:
        AccessError: if the user is not an admin
        InputError: if a value is missing
    """
    if check_admin_id(creatorID):

        with open('database.json', 'r') as file:
            data = json.load(file)

        while True:
            new_id = generate_unique_id()
            if is_unique_id(data, new_id, "questions"):
                break


        # checks if the question has a valid solution
        
        if validate_solution(solution):
            newQuestion = {
                "id": new_id,
                "course": course,
                "solution": solution,
                "question": questionText,
                "marks": marks,
                "creator": creatorID,
                "type": "truefalse",
                "attempts": attempts,
            }

            data["questions"].append(newQuestion)

            with open('database.json', 'w') as file:
                json.dump(data, file, indent=4)
    
            
            return new_id
    else:
        # user is not an admin    
        raise AccessError("You do not have permission to create a new question.")
        
# creates a question that students can write code to answer
def create_coding_question(tests, functionName, questionText, marks, creatorID, attempts, course):
    """
        creates a coding question
        Arguments:
            - a list of tests
            - functionName
            - available marks
            - the id of the creator
            - course name
            - number of attempts
        Returns:
            - the id of the newly created question
        Raises:
        AccessError: if the user is not an admin
        InputError: no tests are given
        ValueError: if there is error with the list of tests
    """
    if check_admin_id(creatorID):
        if not tests:
            raise InputError("You have to provide a least one test case to create a new question.")
        if not all(len(lst) == len(tests[0]) for lst in tests):
            raise ValueError("There is an error with the tests you provided")

        with open('database.json', 'r') as file:
            data = json.load(file)

        while True:
            new_id = generate_unique_id()
            if is_unique_id(data, new_id, "questions"):
                break

        newQuestion = {
            "id": new_id,
            "course": course,
            "tests": tests,
            "question": questionText,
            "marks": marks,
            "creator": creatorID,
            "type": "coding",
            "attempts": attempts,
            "functionName": functionName,
        }

        data["questions"].append(newQuestion)

        with open('database.json', 'w') as file:
            json.dump(data, file, indent=4)

        
        return new_id
    else:
        # user is not an admin    
        raise AccessError("You do not have permission to create a new question.")


# edit question
def edit_question(id, creatorID, changes):
    """
        edits a question
        Arguments: 
            - id of the question
            - id of the user that wants to edit the question
            - the edits that need to be made
        Raises:
        AccessError: if the user did not create the question
    """
    with open('database.json', 'r') as file:
        data = json.load(file)

    if changes["type"] == 'coding':
        for question in data["questions"]:
                if question["id"] == id :
                    if question["creator"] == creatorID:
                        data["questions"].remove(get_question("db", id))
                        data["questions"].append(changes)
                        with open('database.json', 'w') as file:
                            json.dump(data, file, indent=4)
                
                    else:
                        # AccessError is raised
                        raise AccessError("You do not have permission to edit this question.")
    else:
        if validate_solution(changes['solution']):
            for question in data["questions"]:
                if question["id"] == id :
                    if question["creator"] == creatorID:
                        data["questions"].remove(get_question("db", id))
                        data["questions"].append(changes)
                        with open('database.json', 'w') as file:
                            json.dump(data, file, indent=4)
                
                    else:
                        # AccessError is raised
                        raise AccessError("You do not have permission to edit this question.")
    
# delete a question
def delete_question(id, creatorID):
    """
        deletes a question
        Arguments: 
            - id of the question
            - id of the user that wants to delete the question
        Raises:
        AccessError: if the user did not create the question
    """

    with open('database.json', 'r') as file:
        data = json.load(file)

    found = False

    for question in data["questions"]:
            # find the question
            if question["id"] == id:
                found = True
                # check is user has permission to delete the question
                if question["creator"] == creatorID:
                    data["questions"].remove(get_question("db", id))
                    #? remove the question for all questions?
                    for quiz in data["quizzes"]:
                        if id in quiz["questions"]:
                            quiz["questions"].remove(id)
                    with open('database.json', 'w') as file:
                        json.dump(data, file, indent=4)
            
                else:
                    # AccessError is raised
                    raise AccessError("You do not have permission to delete this question.")
    if not found:
        raise InputError("This question does not exist")

def add_question(id, quizID, creatorID):
    """
        adds questions to a quiz
        Arguments: 
            - id of the question
            - if of the quiz
            - id of the user that wants to add the question
        Raises:
        AccessError: if the user did not create the quiz
    """
    with open('database.json', 'r') as file:
        data = json.load(file)

    for quiz in data["quizzes"]:
        if quiz["id"] == quizID:
            if quiz["creator"] == creatorID:
                quiz["questions"].extend(id)
                with open('database.json', 'w') as file:
                    json.dump(data, file, indent=4)
        
            else:
                raise AccessError("You do not have permission to add this question this quiz.")
