FROM apache/airflow:2.3.0
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva

USER root
#RUN useradd airflow
RUN mkdir /wf_inputs
RUN mkdir /wf_outputs
RUN chown -R 1000 /wf_inputs
RUN chown -R 1000 /wf_outputs