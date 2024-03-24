# import sys
# import psycopg2
import re
import fractions
from helpers import get_question, get_variables
import subprocess

timeout_duration = 5


def execute_solution(solution, variables):
    """
    execute the solution and return the answer
    Arguments:
        solution -- a dictionary containing the solution to be executed. Also contains the randomised variables.
    Returns:
        the ideal solution 
    """
    code = ' '
    # replace v* with the variable values
    # check if the solution is a dictionary
    if isinstance(solution, dict):
        my_code = solution["solution"].split(" ") 
        for i, word in enumerate(my_code):
            if re.search("v.", str(word)):
                j = int(re.search("v(\d+)", str(word)).group(1)) - 1
                my_code[i] = re.sub("v(\d+)", str(variables[j]), my_code[i])
        for x in my_code:
            code += str(x) + ' '
        script_name = "script.py"
        with open(script_name, "w") as file:
            file.write(code)
 
        
        #! SHIFT MIGHT NOT BE NECESSARY 
        shift = 4*3

        # Open the file for reading
        with open(script_name, 'r') as file:
            lines = file.readlines()

        file.close()
        # Modify the content by adding spaces or tabs
        shifted_lines = [line[shift:] for line in lines]

        # Open the file for writing (this will overwrite the original file)
        with open(script_name, 'w') as file:
            file.writelines(shifted_lines)
        file.close()
    else:
        # solution has no variables and therefore just a string
        code = solution
        script_name = "script.py"
        with open(script_name, "w") as file:
            file.write(code)
 
    
    # validates the solution works and has no errors
    try: 
        with open(script_name, 'r') as file:
            script = file.read()
        compile(script, script_name, 'exec')
        file.close()
    except SyntaxError:
        raise SyntaxError

    
    # if script takes longer than 5 seconds to execute then raise TimeoutError
    try:
        completed_process = subprocess.run(["python", script_name], stdout=subprocess.PIPE, text=True, timeout = timeout_duration)
        returnCode = completed_process.returncode
        if returnCode == 0:
            answer = completed_process.stdout
            return answer.rstrip('\n')
        else:
            # raise NameError if there is an undeclared variable
            raise NameError
    except subprocess.TimeoutExpired:
        # Handle the timeout error
        raise TimeoutError("Execution time limit exceeded")
    except NameError:

        raise NameError


    
    


def code_solution(answer, tests):
    """
    executes the code of a student's solution
    Arguments:
        tests -- a list containing a list of tests. the order of each list represents the order of the variables and the last index is the answer
        answer -- the student's answer
    Returns:
        fraction -- a float representing the number of tests the student gets correct
    """
    code = ' '
    studentCode = answer.split(" ")
    script_name = "script.py"

    for x in studentCode:
        code += str(x) + ' '
    with open(script_name, "w") as file:
        file.write(code) 

    # if the student's answer has a syntax error then the code doesnt work and should receive zero marks
    try: 
        with open(script_name, 'r') as file:
            script = file.read()
        compile(script, script_name, 'exec')
        file.close()
    except SyntaxError:
        return float(0)
    
    totalCorrect = 0
     
    for test in tests:
        # if script takes longer than 5 seconds to execute then raise TimeoutError
        test_name = "runTests.py"
        code = f"""from script import *

print({test[0]} == {test[1]})"""
        with open(test_name, "w") as file:
            file.write(code)

        try:
            completed_process = subprocess.run(["python", test_name], stdout=subprocess.PIPE, text=True, timeout = timeout_duration)
            
            returnCode = completed_process.returncode

            if returnCode == 0:
                answer = completed_process.stdout
                answer = answer.replace("\n", "")
                if answer == "True":
                    totalCorrect += 1
            else:
                return float(0)
        except subprocess.TimeoutExpired:
            # Handle the timeout error
            totalCorrect = totalCorrect
        
    return round(float(fractions.Fraction(totalCorrect, len(tests))), 2)


# figure out how to test the code for each test and add to totalCorrect if returncode is 0 or if true
def run_tests(functionName, test):
    functionName = functionName.replace("\n", "")
    test_name = "runTests.py"
    code = f"""from script import *

assert {functionName} == """
    with open(test_name, "w") as file:
        file.write(code)




# TODO: when solution is printed, extra newline is added
if __name__ == "__main__":
    solution = {
        "solution": """
            answer = ''
            for i in range(1, v1):
                if i % v2 == 0:
                    answer += 'v3'
                else:
                    answer += str(i)
                answer += "\\n"

            print(answer)
        """,
        "v1": 16,
        "v2": 3,
        "v3": "shampoo"
    }
    answer = """1
2
shampoo
4
5
shampoo
7
8
shampoo
10
11
shampoo
13
14
shampoo
""".rstrip()
    v = get_variables(solution)
    test_answer = execute_solution(solution, v)
    print(answer)
    