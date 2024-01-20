@echo off
echo Starting server...
cd "%~dp0"
cd env\Scripts
call activate
cd /d "%~dp0"
cd server\local_gpt_server
python manage.py runserver
pause