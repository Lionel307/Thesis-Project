from flask import Flask, request, jsonify
from flask_cors import CORS
from auth import *
from automarking import *
from course import *
from question import *
from question_response import *
from quiz import *
from quiz_attempt import *
import config
import json

app = Flask(__name__)
CORS(app)
# login the user
@app.route('/', methods=['POST'])
def login_api():
    try:
        data = request.json
        zID = data.get('zID')
        password = data.get('password')
        userID = login(zID, password)
        user = check_user_type(zID)
        return {'zID': userID, 'user': user}
    except(AccessError) as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    
###############################################################
################### Course Functions ##########################
###############################################################

# create a new course
@app.route('/Course/New', methods=['POST'])
def create_course_api():
    data = request.json

    try:
        new_course_id = create_course(data['id'], data['title'], data['numStudents'])
        return jsonify({'success': True, 'message': 'Course created successfully', 'course_id': new_course_id}), 201
    except (AccessError, KeyError) as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# edit a course details
@app.route('/Course/Edit', methods=['PUT'])
def edit_course_api():
    try:
        data = request.json
        course_id = data.get('course_id')
        user_id = data.get('user_id')
        changes = data.get('changes')

        edit_course(course_id, user_id, changes)
        return jsonify({'success': True, 'message': 'Course edited successfully'}), 200
    except (AccessError, KeyError) as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# removes a course
@app.route('/Course', methods=['DELETE'])
def delete_course_api():
    try:
        data = request.json
        course_id = data.get('course_id')
        user_id = data.get('user_id')

        delete_course(course_id, user_id)
        return jsonify({'success': True, 'message': 'Course deleted successfully'}), 200
    except (AccessError, KeyError) as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# gets all the courses the admin has access to
@app.route('/Home/Admin', methods=['GET'])
def check_admins_courses_api():
    zID = request.args.get('zID')
    if not zID:
        return jsonify({'error': 'zID parameter is missing'}), 400

    try:
        courses = check_admins_courses(zID)
        return jsonify({'courses': courses}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# gets all the courses the admin has access to
@app.route('/Home/Student', methods=['GET'])
def check_students_courses_api():
    zID = request.args.get('zID')
    if not zID:
        return jsonify({'error': 'zID parameter is missing'}), 400

    try:
        courses = check_student_courses(zID)
        return jsonify({'courses': courses}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

###############################################################
################### Quiz Functions ############################
###############################################################

# creates a new quiz after adding questions
@app.route('/Quiz/Add-Questions', methods=['POST'])
def create_quiz_api():
    data = request.json
    try:
        new_id = create_quiz(data['title'], data['description'], data['creatorID'], data['questions'], data['attemptsAllowed'], data['timeAllowed'], data['course'])
        return jsonify({'quizID': new_id}), 201
    except (AccessError) as e:
        return jsonify({'error': str(e)}), 400

# deletes a quiz
@app.route('/Quizzes', methods=['DELETE'])
def delete_quiz_api():
    data = request.json
    try:
        delete_quiz(data['id'], data['creatorID'])
        return jsonify({'message': 'Quiz deleted successfully'}), 200
    except (AccessError) as e:
        return jsonify({'error': str(e)}), 400

# edit a quiz
@app.route('/Quiz/Details', methods=['PUT'])
def edit_quiz_api():
    data = request.json
    try:
        edit_quiz(data['id'], data['creatorID'], data['changes'])
        return jsonify({'message': 'Quiz edited successfully'}), 200
    except (AccessError, KeyError) as e:
        return jsonify({'error': str(e)}), 400

# starts a quiz
@app.route('/Quizzes', methods=['PUT'])
def live_quiz_api():
    data = request.json
    try:
        live_quiz(data['id'], data['creatorID'])
        return jsonify({'message': 'Quiz is now live'}), 200
    except (AccessError, QuizError) as e:
        return jsonify({'error': str(e)}), 400

# get all the quizzes the user owns
@app.route('/Quizzes', methods=['GET'])
def check_admins_quizzes_api():
    courseName = request.args.get('courseName')
    zID = request.args.get('zID')
    if not courseName or not zID:
        return jsonify({'error': 'a parameter is missing'}), 400
    
    try:
        quizzes = get_all_quizzes(zID, courseName)
        return jsonify({'quizzes': quizzes}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# get all the quizzes the user owns
@app.route('/Student/Quizzes', methods=['GET'])
def check_student_quizzes_api():
    courseName = request.args.get('courseName')
    if not courseName:
        return jsonify({'error': 'a parameter is missing'}), 400
    
    try:
        quizzes = get_quizzes_in_course(courseName)
        return jsonify({'quizzes': quizzes}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# displays what questions are available in the course
@app.route('/Quiz/Add-Questions', methods=['GET'])
def add_questions_to_quiz_api():
    courseName = request.args.get('courseName')
    zID = request.args.get('zID')
    if not courseName or not zID:
        return jsonify({'error': 'a parameter is missing'}), 400
    try:
        questions = get_all_questions(zID, courseName)
        return jsonify({'questions': questions}), 200
    except AccessError as e:
        return jsonify({'error': str(e)}), 500
    
# get all the quiz details
@app.route('/Quiz/Details', methods=['GET'])
def get_quiz_api():
    quizID = request.args.get('quizID')
    userID = request.args.get('zID')

    if not quizID:
        return jsonify({'error': 'a parameter is missing'}), 400
    try:
        quiz = get_quiz(1, quizID)
        numAttempts = len(get_all_quiz_attempts(1, quizID))
        questions = []
        questionBank = []
        for id in quiz['questions']:
            question = get_question(1, id)
            questions.append(question)
        allQuestions = get_all_questions(userID, quiz['course'])
        for question in allQuestions:
            if question['id'] not in quiz['questions']:
                questionBank.append(question)
        return jsonify({'quiz': quiz, 'questions': questions, 'numAttempts': numAttempts, 'questionBank': questionBank}), 200
    except AccessError as e:
        return jsonify({'error': str(e)}), 500
    

###############################################################
################### Question Functions ########################
###############################################################

# API for the creation of a multiple choice question
@app.route('/Question/New-Multi', methods=['POST'])
def create_multiple_choice_question_api():
    data = request.json
    try:
        id = create_multiple_choice_question(data['solution'], data['questionText'], data['answers'], data['marks'], data['creatorID'], data['attempts'], data['course'])
        return jsonify({"id": id}), 200
    except (AccessError, InputError) as e:
        return jsonify({'error': str(e)}), 400

# API for the creation of a short answer question
@app.route('/Question/New-Short', methods=['POST'])
def create_short_answer_question_api():
    data = request.json
    try:
        id = create_short_answer_question(data['solution'], data['questionText'], data['marks'], data['creatorID'], data['attempts'], data['course'])
        return jsonify({"id": id}), 200
    except (AccessError, InputError, SyntaxError, NameError, TimeoutError) as e:
       return jsonify({'error': str(e)}), 400

# API for the creation of a true/false question
@app.route('/Question/New-TrueFalse', methods=['POST'])
def create_true_false_question_api():
    data = request.json
    try:
        id = create_true_false_question(data['solution'], data['questionText'], data['marks'], data['creatorID'], data['attempts'], data['course'])
        return jsonify({"id": id}), 200
    except (AccessError, InputError) as e:
       return jsonify({'error': str(e)}), 400

# API for the creation of a coding question
@app.route('/Question/New-Coding', methods=['POST'])
def create_coding_question_api():
    data = request.json
    try:
        id = create_coding_question(data['tests'], data['functionName'], data['questionText'], data['marks'], data['creatorID'], data['attempts'], data['course'])
        return jsonify({"id": id}), 200
    except (AccessError, InputError, ValueError) as e:
        return jsonify({'error': str(e)}), 400

# API for editing a question
@app.route('/Question/Details', methods=['PUT'])
def edit_question_api():
    data = request.json
    try:
        edit_question(data['id'], data['creatorID'], data['changes'])
        return jsonify({'message': 'Question edited successfully'}), 200
    except (AccessError, InputError, SyntaxError) as e:
        return jsonify({'error': str(e)}), 400

@app.route('/Question/Bank', methods=['DELETE'])
def delete_question_api():
    data = request.json
    try:
        delete_question(data['id'], data['creatorID'])
        return jsonify({'message': 'Question deleted successfully'}), 200
    except (AccessError, InputError) as e:
        return jsonify({'error': str(e)}), 400

@app.route('/Question/Add', methods=['POST'])
def add_question_api():
    data = request.json
    try:
        add_question(data['questions'], data['quizID'], data['creatorID'])
        return '', 204
    except (AccessError, InputError) as e:
        return jsonify({'error': str(e)}), 400

@app.route('/Question/Details', methods=['GET'])
def get_question_api():
    questionID = request.args.get('questionID')
    zID = request.args.get('zID')
    if not questionID or not zID:
        return jsonify({'error': 'a parameter is missing'}), 400
    
    try:
        question = get_question(zID, questionID)
        return jsonify({'question': question}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    
@app.route('/Question/Bank', methods=['GET'])
def check_admins_questions_api():
    courseName = request.args.get('courseName')
    zID = request.args.get('zID')
    if not courseName or not zID:
        return jsonify({'error': 'a parameter is missing'}), 400
    
    try:
        questions = get_all_questions(zID, courseName)
        return jsonify({'questions': questions}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

###############################################################
################ Question Response Functions ##################
###############################################################
    
@app.route('/Quiz/Attempt', methods=['POST'])
def create_question_response_api():
    data = request.json
    try:
        if (data['type'] == 'coding'):
            response_id = create_code_response(data['questionID'], data['studentID'], data['quizAttemptID'], data['answer'])
        else:
            response_id = create_question_response(data['questionID'], data['studentID'], data['quizAttemptID'], data['answer'], data['variables'])
        return jsonify({"id": response_id}), 200
    except (AccessError, InputError) as e:
        return str(e), 400


@app.route('/Attempt/Details', methods=['PUT'])
def delete_question_response_api():
    data = request.json
    try:
        delete_question_response(data['id'], data['userID'])
        return jsonify({'message': 'Response deleted successfully'}), 200
    except (AccessError, InputError) as e:
        return str(e), 400
    
@app.route('/Response/Feedback', methods=['PUT'])
def add_feedback_response_api():
    data = request.json
    try:
        add_feedback(data['id'], data['userID'], data['feedback'])
        return jsonify({'message': 'Feedback added successfully'}), 200
    except (AccessError, InputError) as e:
        return str(e), 400
    
@app.route('/Response/Feedback', methods=['GET'])
def get_response_api():
    responseID = request.args.get('responseID')
    try:
        response = get_question_response(1, responseID)
        question = get_question(1, response['questionID'])
        return jsonify({'response': response, 'question': question}), 200
    except (AccessError, InputError) as e:
        return str(e), 400


###############################################################
################ Quiz Attempts Functions ######################
###############################################################

# API endpoint to create a new quiz attempt
@app.route('/Student/Quizzes', methods=['POST'])
def create_quiz_attempt_api():
    data = request.get_json()
    try:
        quizID = data['quizID']
        studentID = data['studentID']
        date = data['date']
        new_attempt_id = create_quiz_attempt(quizID, studentID, date)
        return jsonify({'quiz_attempt_id': new_attempt_id}), 200
    except (QuizError) as e:
        return jsonify({'error': str(e)}), 400

# API endpoint to delete a quiz attempt
@app.route('/Quiz/Results', methods=['DELETE'])
def delete_quiz_attempt_api():
    data = request.get_json()
    try:
        attempt_id = data['attemptID']
        adminID = data['adminID']
        delete_quiz_attempt(attempt_id, adminID)
        return jsonify({'message': 'Quiz attempt deleted successfully'}), 200
    except (AccessError) as e:
        return jsonify({'error': str(e)}), 400

# API endpoint to get the attempt ID with the highest score for a student in a quiz
@app.route('/quiz_attempt/highest_mark', methods=['GET'])
def get_highest_mark_attempt_api():
    studentID = request.args.get('studentID')
    quizID = request.args.get('quizID')
    try:
        highest_mark_attempt_id = get_highest_mark_attempt(studentID, quizID)
        return jsonify({'highest_mark_attempt_id': highest_mark_attempt_id}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# API endpoint to get all the questions in a quiz
@app.route('/Quiz/Attempt', methods=['GET'])
def get_questions_in_quiz_api():
    quizID = request.args.get('quizID')
    try:
        quiz = get_quiz(1, quizID)
        questions = []
        for id in quiz['questions']:
            question = get_question(1, id)
            questions.append(question)
        return jsonify({'questions': questions}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

###############################################################
################# Automarking Functions #######################
###############################################################

# API endpoint to automark a quiz
@app.route('/Quiz/Details', methods=['POST'])
def automark_quiz_api():
    data = request.get_json()
    try:
        automark_quiz(data['quizID'])
        return jsonify({'message': 'Quiz automarked successfully'}), 200
    except Exception as e:

        return jsonify({'error': str(e)}), 400
    
###############################################################
############### Quiz Results Functions ########################
###############################################################

# allows admin to view all marked attempts in a quiz
@app.route('/Quiz/Results', methods=['GET'])
def get_attempts_in_quiz_api():
    quizID = request.args.get('quizID')
    quiz = get_quiz(1, quizID)
    try:
        attemptIDs = get_all_quiz_attempts(1, quizID)
        attempts = []
        for id in attemptIDs:
            attempt = get_quiz_attempt(1, id)
            if attempt['marked']:
                attempts.append(attempt)
        return jsonify({'attempts': attempts, 'quiz': quiz}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
# allows admin to view a marked attempt
@app.route('/Attempt/Details', methods=['GET'])
def view_attempt_api():
    attemptID = request.args.get('attemptID')
    try:
        attempt = get_quiz_attempt(1, attemptID)
        quiz = get_quiz(1, attempt['quizID'])
        totalMarks = 0
        for question in quiz['questions']:
            questionInfo = get_question(1, question)
            totalMarks += int(questionInfo['marks'])
        responses = []
        questions = []
        for id in attempt['responses']:
            response = get_question_response(1, id)
            question = get_question(1, response['questionID'])
            responses.append(response)
            questions.append(question["marks"])
        return jsonify({'attempt': attempt, 'responses': responses, 'marks': questions, 'totalMarks': totalMarks}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

###############################################################
############### Student Results Functions #####################
###############################################################

# allow students to view their marked attempts
@app.route('/Student/Attempt/Results', methods=['GET'])
def get_student_attempts_in_quiz_api():
    quizID = request.args.get('quizID')
    studentID = request.args.get('stuID')
    quiz = get_quiz(1, quizID)
    try:
        attemptIDs = get_all_quiz_attempts(1, quizID)
        attempts = []
        for id in attemptIDs:
            attempt = get_quiz_attempt(1, id)
            if attempt['marked'] and attempt['studentID'] == studentID:
                attempts.append(attempt)
        return jsonify({'attempts': attempts, 'quiz': quiz}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# allow students to view a marked attempt
@app.route('/Student/Results', methods=['GET'])
def student_view_attempt_api():
    attemptID = request.args.get('attemptID')
    try:
        attempt = get_quiz_attempt(1, attemptID)
        quiz = get_quiz(1, attempt['quizID'])
        totalMarks = 0
        for question in quiz['questions']:
            questionInfo = get_question(1, question)
            totalMarks += int(questionInfo['marks'])
        responses = []
        questions = []
        for id in attempt['responses']:
            response = get_question_response(1, id)
            question = get_question(1, response['questionID'])
            responses.append(response)
            questions.append(question["marks"])
        return jsonify({'attempt': attempt, 'responses': responses, 'marks': questions, 'totalMarks': totalMarks}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# allow students to view a marked response
@app.route('/Student/Feedback', methods=['GET'])
def student_view_response_api():
    responseID = request.args.get('responseID')
    try:
        response = get_question_response(1, responseID)
        question = get_question(1, response['questionID'])
        return jsonify({'response': response, 'question': question}), 200
    except (AccessError, InputError) as e:
        return str(e), 400

if __name__ == "__main__":
    app.run(debug=True,port=config.PORT)