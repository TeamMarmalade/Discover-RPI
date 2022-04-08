# API Documentation

**GET** ```/dorms```:
Status code: 200
Response: A JSON file containing all dorms with their information.

**GET** ```/dorms/:dorm```:
Parameters:
:dorm - The specified dorm.

Status code: 200
Response: A JSON file containing the specified dorm with its information.

Status code: 404
Failed to get the specified dorm (e.g. dorm doesn't exist).

**GET** ```/dorms/:dorm/reviews```:
Parameters:
:dorm - The specified dorm.

Status code: 200
Response: A JSON file containing user reviews for the specified dorm.

Status code: 404
Failed to get reviews for the specified dorm (e.g. dorm doesn't exist).
