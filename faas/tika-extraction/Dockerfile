FROM openjdk:15-jdk-alpine
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva

ENV MODE=TEXT


COPY tika-app-1.24.jar /tika-app.jar
COPY run.sh /run.sh

CMD /run.sh