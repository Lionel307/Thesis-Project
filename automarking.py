import json
from code_solution import *
from helpers import *

def automark_quiz(quizID):
    """
    marks all the students' attempts on the quiz
    Arguments:
    quizID -- the quiz's ID
    
    """
    with open('database.json', 'r') as file:
        data = json.load(file)

    quizAttempt = get_all_quiz_attempts(1, quizID) 
    for attempt in data["quizAttempts"]:
        # update the score of the quiz attempt

        if attempt["id"] in quizAttempt:
            if not attempt["marked"]:
                attempt["score"] = automark_attempt(attempt)
                # update attempt as marked
                attempt["marked"] = True

    # update each question in the attempt as marked and assign the score
    for response in data["questionResponses"]: 
        if response["quizAttemptID"] in quizAttempt:
            question = get_question(1, response["questionID"])
            response["marked"] = True
            
            if question['type'] == "coding":
                answer = response["answer"]
                tests = question["tests"]
                response["marksGiven"] = code_solution(answer, tests)*float(question["marks"])
            else:
                # variables = get_variables(question['solution'])
                if response['idealAnswer'] == response['answer']:
                    response["marksGiven"] = float(question["marks"])

    with open('database.json', 'w') as file:
        json.dump(data, file, indent=4)

def automark_attempt(attempt):
    """
    for each question:
        use the code_solution function to check if the student's answer is correct
        add the student's marks to the totalMarks variable
    Arguments:
        attempt -- the attempt of the quiz
    Returns:
        totalMarks -- the student's total marks
    """
    totalMarks = 0.0
    for id in attempt["responses"]:
        response = get_question_response(1, id)
        question = get_question(1, response["questionID"])
        if question['type'] == "coding":
            answer = response["answer"]
            tests = question["tests"]
            marks = code_solution(answer, tests)*float(question["marks"])
            totalMarks += marks

        else:
            variables = get_variables(question['solution'])
            if response['idealAnswer'] == response['answer']:
                print('here')
                totalMarks += float(question["marks"])
    
    return totalMarks
