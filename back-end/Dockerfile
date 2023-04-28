# syntax=docker/dockerfile:1

FROM python:3.10-slim-buster

WORKDIR /mlb-stats-game

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .
# os.system(r'python3 -m flask --app .\index.py run --debug')
# CMD ["python3", "-m", "flask", "--app", "index.py", "run", "--debug", "--host=0.0.0.0"]
CMD ["python3", "index.py"]