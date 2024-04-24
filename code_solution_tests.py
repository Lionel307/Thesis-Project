import pytest
import random
import fractions
from code_solution import execute_solution, code_solution
from errors import InputError
from helpers import get_variables

@pytest.fixture
def basic_pytest():
    '''Test that pytest and pylint are working'''
    assert 1 + 1 == 2

# test execute_solution works with a correct answer
def test_correct_answer(): 
    solution = {
        "solution": """
answer = ''
for i in range(1, v1):
    if i % v2 == 0:
        answer += v3
    else:
        answer += str(i)
    answer += "\\n"

print(answer)
        """,
        "v1": 16,
        "v2": 3,
        "v3": 'shampoo'
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
    assert test_answer == answer

# test that execute_solution raises a SyntaxError when the solution provided has a syntax error
def test_incorrect_syntax(): 
    solution = {
        "solution": """
            answer = ''
            for i in range(, v1):
                if i % v2 == 0:
                    answer += v3
                else:
                    answer += str(i)
                answer += "\\n"

            print(answer)
        """,
        "v1": 16,
        "v2": 3,
        "v3": "'shampoo'"
        }
    v = get_variables(solution)
    
    with pytest.raises(SyntaxError):
        execute_solution(solution, v)

# Test what happens when the solution has a variable with no value
def test_no_variable():
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
        "v1": None,
        "v2": 3,
        "v3": "'shampoo'"
    }

    with pytest.raises(ValueError):
        v = get_variables(solution)

# test the randomization works with execute_solution
def test_randomised_variable():
   
    solution1 = {
        "solution": """
print((v1 + v2) * v3)
        """,
        "v1": "random.randint(1, 100)",
        "v2": "random.randint(1, 100)",
        "v3": [-1, 1]
    }

    solution2 = {
        "solution": """
print((v1 + v2) * v3)
        """,
        "v1": "random.randint(1, 100)",
        "v2": "random.randint(1, 100)",
        "v3": [-1, 1]
    }
    v1 = get_variables(solution1)
    v2 = get_variables(solution2)


    assert execute_solution(solution1, v1) != execute_solution(solution2, v2) 

# test execute_solution selects a random item from a given list of variables
def test_list_variables():
    options = ["apple", "banana", "cherry", "date", "elderberry"]
    solution = {
        "solution": """
print(v1[::-1], end='')
        """,
        "v1": options,
    }
    v = get_variables(solution)

    assert execute_solution(solution, v)[::-1] in options

# test a timeout error is raised when the script takes longer than 5 seconds to execute
def test_runtime_error():
    solution = {
        "solution": """
i = 0
while True:
    i += 1
print(i)
        """,
    }
    v = get_variables(solution)
    with pytest.raises(TimeoutError):
        execute_solution(solution, v)

# def test_case_sensitivity():

# test when an incorrect answer is given
def test_incorrect_answer():  
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
15
"""
    v = get_variables(solution)
    test_answer = execute_solution(solution, v)
    assert test_answer != answer

#TODO
# if the solution has an undeclared variable used in the solution then raise a NameError
def test_name_error_execute_solution():
    solution = {
        "solution": """
answer = ''
for i in range(a, v1):
    if i % v2 == 0:
        answer += v3
    else:
        answer += str(i)
    answer += "\\n"

print(answer)
        """,
        "v1": 16,
        "v2": 3,
        "v3": "shampoo"
        }
    v = get_variables(solution)
    
    with pytest.raises(NameError):
        execute_solution(solution, v)


# test that execute solution works with different libraries such as Math
def test_import_math():
    solution = { 
        "solution": """
import math
radius = v1
area = math.pi * radius ** 2
print(area)
        """,
        "v1": "random.randint(1, 100)",
    }
    v = get_variables(solution)
    assert float(execute_solution(solution, v)) > 0

##################################################################################################################################
##########################################  Execute Solution tests  ##############################################################
##################################################################################################################################

# test the basic functionality of a student's solution using code solution
def test_mark_code_question():
    tests = [["add_numbers(1, 2)", 3], ["add_numbers(1, -1)", 0], ["add_numbers(10, -5)", 5], ["add_numbers(0, 0)", 0]]
    answer = """
def add_numbers(a, b):
    return a + b
"""
    assert code_solution(answer, tests) == float(fractions.Fraction(len(tests), len(tests)))

# test a students partially correct answer
def test_mark_code_question_partially_correct():
    tests = [["add_numbers(1, 2)", 3], ["add_numbers(1, -1)", 0], ["add_numbers(10, -5)", 5], ["add_numbers(0, 0)", 0],  ["add_numbers(10, -5)", 5], ["add_numbers(10, -5)", 5], ["add_numbers(10, -5)", 5]]
    answer = """
def add_numbers(a, b):
    return 0
"""
    assert code_solution(answer, tests) == round(float(fractions.Fraction(2, len(tests))), 2)

# test if a student provides a code that has a syntax error that the system will not provide any marks
def test_invalid_code_solution():
    tests = [["add_numbers(1, 2)", 3], ["add_numbers(1, -1)", 0], ["add_numbers(10, -5)", 5], ["add_numbers(0, 0)", 0]]
    answer = """
def add_numbers(a, b)
    return a + b
"""
    assert code_solution(answer, tests) == float(0)
    
# test that if a program takes too long to complete no marks is awarded
def test_timeout_code_question():
    tests = [["add_numbers(1, 2)", 3], ["add_numbers(1, -1)", 0], ["add_numbers(10, -5)", 5], ["add_numbers(0, 0)", 0]]
    answer = """
def add_numbers(a, b):
    i = 0
    while True:
        i += 1
"""
    assert code_solution(answer, tests) == float(0)

#TODO
# test that if a program takes too long to complete no marks is awarded but some tests are still correct
def test_partial_timeout_code_question():
    tests = [["add_numbers(1, 2)", 3], ["add_numbers(1, -1)", 0], ["add_numbers(10, -5)", 5], ["add_numbers(0, 0)", 0]]
    answer = """
def add_numbers(a, b):
    if a + b == 3: 
        i = 0
        while True:
            i += 1
    else:
        return a + b
"""
    assert code_solution(answer, tests) == float(fractions.Fraction(3, len(tests)))

# if the answer has an undeclared variable used in the solution then no marks is awarded
def test_name_error_code_solution():
    tests = [["add_numbers(1, 2)", 3], ["add_numbers(1, -1)", 0], ["add_numbers(10, -5)", 5], ["add_numbers(0, 0)", 0]]
    answer = """
def add_numbers(a, b):
    return a + c
    """
    
    assert code_solution(answer, tests) == float(0)

def test_multiple_functions():
    tests = [["add_five(1)", 7], ["add_five(-1)", 3], ["add_five(10)", 25], ["add_five(0)", 5]]
    answer = """
def multiply_by_two(number):
    return number * 2

def add_five(number):
    return 5 + multiply_by_two(number)
    """
    assert code_solution(answer, tests) == float(fractions.Fraction(len(tests), len(tests)))

    

def test_int_answers():
    solution = {
        "solution": """
            def int_answers(answer):
                return answer
            print(int_answers(2))
        """,
        "v1": "random.randint(1, 100)",
    }

    v = get_variables(solution)
    assert execute_solution(solution, v) == str(2)


