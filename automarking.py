# import psycopg2
import json
from code_solution import *
from quiz_attempt import create_quiz_attempt
from question_response import create_question_response, create_code_response
from question import create_short_answer_question, create_coding_question
from quiz import create_quiz, live_quiz
from helpers import *

#! each '1' has to be changed to 'db'
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
            #TODO: test this
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
                response["marksGiven"] = code_solution(answer, tests)*question["marks"]
            else:
                variables = get_variables(question['solution'])
                if execute_solution(question['solution'], variables) == response['answer']:
                    response["marksGiven"] = question["marks"]

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
    totalMarks = 0
    for id in attempt["responses"]:
        response = get_question_response(1, id)
        question = get_question(1, response["questionID"])
        if question['type'] == "coding":
            answer = response["answer"]
            tests = question["tests"]
            marks = code_solution(answer, tests)*question["marks"]
            totalMarks += marks
        else:
            variables = get_variables(question['solution'])
            if execute_solution(question['solution'], variables) == response['answer']:
                
                totalMarks += question["marks"]
    
    return totalMarks

if __name__ == "__main__":
    solution = {
        "solution": """
            print("hello world")
        """
    }
    questionText = "what is output of print('hello world')"
    marks = 10
    creatorID = 12
    attempts = 1
    questionID = create_short_answer_question(solution, questionText, marks, creatorID, attempts)

    # create quiz
    title = 'test marked title'
    description = "description test"
    creatorID = 12
    questions = [questionID]
    numAttempts = 1  
    timeAllowed = "00:00:20"
    quizID = create_quiz(title, description, creatorID, questions, numAttempts, timeAllowed)

    live_quiz(quizID, creatorID)

    # create quiz attempt
    studentID = 1
    attemptDate = "date"
    attemptID = create_quiz_attempt(quizID, studentID, attemptDate)

    # create a question response
    stuResponse = "hello world"
    responseID = create_question_response(questionID, studentID, attemptID, stuResponse)

    automark_quiz(quizID)
    attempt = get_quiz_attempt(1, attemptID)
    response = get_question_response(1, responseID)
    
    # checked the quiz has been marked and scored
    assert attempt["marked"] == True
    assert attempt["score"] == 10
    assert response["marked"] == True
    assert response["marksGiven"] == 10