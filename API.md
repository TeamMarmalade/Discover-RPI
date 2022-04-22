# API Documentation

**GET** ```/dorms```:
Status code: 200
Response: A JSON object containing all dorms with their information.

**GET** ```/dorms/:dorm```:
Parameters:
:dorm - The specified dorm.

Status code: 200
Response: A JSON object containing the specified dorm with its information.

Status code: 404
Failed to get the specified dorm (e.g. dorm doesn't exist).

**GET** ```/dorms/:dorm/reviews```:
Parameters:
:dorm - The specified dorm.

Status code: 200
Response: A JSON object array containing user reviews for the specified dorm.

Status code: 404
Failed to get reviews for the specified dorm (e.g. dorm doesn't exist).

**POST** ```/dorms/:dorm/reviews```:
Parameters:
:dorm - The specified dorm.

Status code: 200
Response: Adds user review to specified dorm based on the body parameters and returns confirmation in JSON object

Status code: 500
Server error

Status code: 400
User already has made a review for specified dorm

**GET** ```/dorms/:dorm/reviews/:user```:
Parameters:
:dorm - The specified dorm.
:user - The specified user

Status code: 200
Response: A JSON object containing the user's reviews for the specified dorm.

Status code: 404
Failed to get review for the specified dorm (e.g. dorm doesn't exist).

**PUT** ```/dorms/:dorm/reviews/:user```:
Parameters:
:dorm - The specified dorm.

Status code: 200
Response: Updates user review to specified dorm based on the body parameters and returns confirmation in JSON object

Status code: 500
Server error

Status code: 404
User review not found for specified dorm

**DELETE** ```/dorms/:dorm/reviews```:
Parameters:
:dorm - The specified dorm.

Status code: 200
Response: Remove all reviews of the specified dorm and returns confirmation in JSON object

Status code: 500
Server error

Status code: 404
Failed to get review for the specified dorm

**DELETE** ```/dorms/:dorm/reviews/:user```:
Parameters:
:dorm - The specified dorm.
:user - The specified user

Status code: 200
Response: Remove the specified user's review of the specified dorm and returns confirmation in JSON object

Status code: 500
Server error

Status code: 404
Failed to get review for the specified dorm