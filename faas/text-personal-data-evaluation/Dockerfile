FROM python:3.9-slim-buster
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .
RUN ls

CMD ["python3", "profiling.py"]
