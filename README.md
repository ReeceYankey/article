# ByteBox Recipe App

## Installation

Tested on Python 3.10.9

1. (Optional) Set up virtual environment for Python

    `cd backend` 

    Create the virtual environment with `virtualenv venv`

    Then activate it:\
    On Linux: `source venv/bin/activate`\
    On Windows using Command Prompt: `path\to\venv\Scripts\activate.bat`\
    On Windows using PowerShell: `path\to\venv\Scripts\Activate.ps1`

2. Install python dependencies
 
```
pip install flask python-dotenv pymongo flask-jwt-extended click

```
3. Nodejs and dependencies

```
apt install npm
npm install yarn
yarn install
```
4. Mongodb

```
apt install mongodb
```
It runs as a service by default on linux. You can enable or disable it using `systemctl enable mongodb` or `systemctl disable mongodb`. You can check its status using `systemctl status mongodb`.

You can also run it as daemon in the commandline using `mongod`


## Usage
1. run `mongod` in a terminal
1. Open another terminal and navigate to the project
1. `cd backend`
2. `source venv/bin/activate` (If you're using a virtual environment)
3. `python -m flask run` to launch the backend
4. Open another terminal and navigate to the project
6. `npm start`
7. Navigate to "http://localhost:3000" in your web browser
