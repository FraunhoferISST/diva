FROM python:3.8-slim
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva

RUN apt-get update && apt-get clean
RUN apt install -y tesseract-ocr
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy the dependencies file to the working directory
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# copy the content of the local src directory to the working directory
COPY . .

# command to run on container start
CMD python3 image-ocr.py