FROM ghcr.io/fraunhoferisst/diva/base-python3-nltk:1.0.0
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# copy the dependencies file to the working directory
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# copy the content of the local src directory to the working directory
COPY . .

# command to run on container start
CMD python3 summerizer.py
