FROM node:12-alpine
WORKDIR /usr/app
COPY app/. .
RUN npm install --quiet
CMD ["node","index.js"]

#FROM openjdk:11.0.3-jdk
#RUN apt-get update && apt-get install bash
#RUN mkdir -p /usr/app/
#ENV PROJECT_HOME /usr/app/
#COPY build/libs/demo-0.0.1-SNAPSHOT.jar $PROJECT_HOME/demo-0.0.1-SNAPSHOT.jar
#COPY applicationinsights-agent-3.0.0-PREVIEW.5.jar $PROJECT_HOME/applicationinsights-agent-3.0.0-PREVIEW.5.jar
#COPY ApplicationInsights.json $PROJECT_HOME/ApplicationInsights.json
#WORKDIR $PROJECT_HOME
#CMD ["java","-javaagent:./applicationinsights-agent-3.0.0-PREVIEW.5.jar", "-jar", "./demo-0.0.1-SNAPSHOT.jar"]
