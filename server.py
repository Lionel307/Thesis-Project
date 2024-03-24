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
    try:
        data = request.json
        id = data.get('id')
        title = data.get('title')
        numStudents = data.get('numStudents')

        new_course_id = create_course(id, title, numStudents)
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
@app.route('/Quizzes/Details', methods=['PUT'])
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

    if not quizID:
        return jsonify({'error': 'a parameter is missing'}), 400
    try:
        quiz = get_quiz(1, quizID)
        numAttempts = len(get_all_quiz_attempts(1, quizID))
        questions = []
        for id in quiz['questions']:
            question = get_question(1, id)
            questions.append(question)
        return jsonify({'quiz': quiz, 'questions': questions, 'numAttempts': numAttempts}), 200
    except AccessError as e:
        return jsonify({'error': str(e)}), 500
    

###############################################################
################### Question Functions ########################
###############################################################
@app.route('/Question/Multiple-choice', methods=['POST'])
def create_multiple_choice_question_api():
    data = request.json
    try:
        id = create_multiple_choice_question(data['solution'], data['questionText'], data['answers'], data['marks'], data['creatorID'], data['attempts'], data['course'])
        return jsonify({"id": id}), 200
    except (AccessError, InputError) as e:
        return jsonify({'error': str(e)}), 400

@app.route('/Question/Short-answer', methods=['POST'])
def create_short_answer_question_api():
    data = request.json
    try:
        id = create_short_answer_question(data['solution'], data['questionText'], data['marks'], data['creatorID'], data['attempts'], data['course'])
        return jsonify({"id": id}), 200
    except (AccessError, InputError) as e:
       return jsonify({'error': str(e)}), 400

@app.route('/Question/True-False', methods=['POST'])
def create_true_false_question_api():
    data = request.json
    try:
        id = create_true_false_question(data['solution'], data['questionText'], data['marks'], data['creatorID'], data['attempts'], data['course'])
        return jsonify({"id": id}), 200
    except (AccessError, InputError) as e:
       return jsonify({'error': str(e)}), 400

@app.route('/Question/Coding', methods=['POST'])
def create_coding_question_api():
    data = request.json
    try:
        id = create_coding_question(data['tests'], data['functionName'], data['questionText'], data['marks'], data['creatorID'], data['attempts'], data['course'])
        return jsonify({"id": id}), 200
    except (AccessError, InputError, ValueError) as e:
        return jsonify({'error': str(e)}), 400

@app.route('/Question/Edit', methods=['PUT'])
def edit_question_api():
    data = request.json
    try:
        edit_question(data['id'], data['creatorID'], data['changes'])
        return '', 204
    except (AccessError, InputError) as e:
        return jsonify({'error': str(e)}), 400

@app.route('/Question/Details', methods=['DELETE'])
def delete_question_api():
    data = request.json
    try:
        delete_question(data['id'], data['creatorID'])
        return '', 204
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
        return jsonify({'courses': questions}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

###############################################################
################ Question Response Functions ##################
###############################################################
    
@app.route('/Question/Response', methods=['POST'])
def create_question_response_api():
    data = request.json
    try:
        response_id = create_question_response(data['quesitonID'], data['studentID'], data['quizAttemptID'], data['answer'])
        return jsonify({"id": response_id}), 200
    except (AccessError, InputError) as e:
        return str(e), 400

@app.route('/Question/Response/Coding', methods=['POST'])
def create_code_response_api():
    data = request.json
    try:
        response_id = create_code_response(data['quesitonID'], data['studentID'], data['quizAttemptID'], data['answer'])
        return jsonify({"id": response_id}), 200
    except (AccessError, InputError) as e:
        return str(e), 400

@app.route('/Question/Response/Delete', methods=['DELETE'])
def delete_question_response_api():
    data = request.json
    try:
        delete_question_response(data['id'], data['userID'])
        return '', 204
    except (AccessError, InputError) as e:
        return str(e), 400

@app.route('/edit_question_response', methods=['PUT'])
def edit_question_response_api():
    data = request.json
    try:
        edit_question_response(data['id'], data['userID'], data['changes'])
        return '', 204
    except (AccessError, InputError) as e:
        return str(e), 400

###############################################################
################ Quiz Attempts Functions ######################
###############################################################

# API endpoint to create a new quiz attempt
@app.route('/Quiz/Attempt', methods=['POST'])
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
@app.route('/Quiz/Attempt/Delete', methods=['DELETE'])
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


###############################################################
################# Automarking Functions #######################
###############################################################

# API endpoint to automark a quiz
@app.route('/Quiz/Details', methods=['POST'])
def automark_quiz_api():
    data = request.get_json()
    try:
        quizID = data['quizID']
        automark_quiz(quizID)
        return jsonify({'message': 'Quiz automarked successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
###############################################################
############### Code Solution Functions #######################
###############################################################

if __name__ == "__main__":
    app.run(debug=True,port=config.PORT)