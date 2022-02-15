from airflow import DAG
from datetime import datetime
from airflow.providers.docker.operators.docker import DockerOperator

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
        "DIVA_MONGO_URL": 'http://resource-management:3000',  # to be removed/rethinked
    }

    destroy_phase = DockerOperator(
        task_id='destroy-phase-helper',
        image='destroy-phase-helper:0.0.1',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="core"
    )

    destroy_phase
