from airflow import DAG
from datetime import datetime
from airflow.providers.docker.operators.docker import DockerOperator
from airflow.models import Variable

default_args = {
    'owner': 'airflow',
    'description': 'Destroy Phase Helper',
    'depend_on_past': False,
    'start_date': datetime(2018, 1, 3),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 0
}

with DAG('destroyphase', default_args=default_args, schedule_interval='* * * * *', catchup=False) as dag:
    profiling_args = {
        "MONGODB_URI": Variable.get("mongodb_uri"),
    }

    destroy_phase = DockerOperator(
        task_id='destroy-phase-helper',
        image='destroy-phase-helper:0.0.1',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="core",
        environment={
            **profiling_args
        },
    )

    destroy_phase
