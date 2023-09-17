# LocalChatGPT 
Local chat bot base on pre-trained models for using with confidential information.


### Requirement
* Python 3.11+
* NodeJs 20.5.1+


### Installation
1) Install nodeJs
2) Install python
3) Clone this project
    ```bash
    git clone https://github.com/rctz/Local-ChatGPT
    ```
4) install required python packages
    ```bash
    pip install -r requirement.txt
    ```
5) Prepare database migrations
    ```python
    python3 manage.py makemigrations
    ```
6) Migrate database
    ```python
    python3 manage.py migrate
    ```
7) Generate static files
    ```python
    python3 manage.py collectstatic
    ```
8) Run server
    ```python
    python3 manage.py runserver
    ```
9) Let talk with GPT model by go to ** http://localhost:8000/chat **