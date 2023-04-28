# syntax=docker/dockerfile:1

FROM python:3.10-slim-buster

WORKDIR /mlb-stats-game

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

# Development 
# CMD ["python3", "-m", "flask", "--app", "index.py", "run", "--debug", "--host=0.0.0.0"]

# Production
CMD ["python3", "index.py"]