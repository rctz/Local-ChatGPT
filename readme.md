# Local Chat GPT

Local chat bot base on pre-trained models for using with local confidential data.

### Requirement

- Python 3.11+
- Node.Js 20.5.1+

### Server Installation

1. Install [python](https://www.python.org/downloads/)
2. Clone this project
   ```bash
   git clone https://github.com/rctz/Local-ChatGPT
   ```
3. install required python packages
   ```bash
   pip install -r requirement.txt
   ```
4. Change directory to server
   ```bash
   cd Local-ChatGPT/server/local_gpt_server
   ```
5. Prepare database migrations
   ```python
   python3 manage.py makemigrations
   ```
6. Run server
   ```python
   python3 manage.py runserver
   ```

### Client Installation

1. Install [Node.js](https://nodejs.org/)
2. Change directory to chat_client
   ```bash
   cd Local-ChatGPT/chat_client
   ```
3. install dependencies
   ```bash
   npm install
   ```
4. Run client in development mode
   ```npm
   npm start
   ```
5. Let talk with GPT model by going to ** http://127.0.0.1:3000 **
