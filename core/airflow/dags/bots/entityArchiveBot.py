from airflow import DAG
from datetime import datetime
from airflow.providers.docker.operators.docker import DockerOperator
from airflow.models import Variable

default_args = {
    'owner': 'airflow',
    'description': 'Entity Archive Bot',
    'depend_on_past': False,
    'start_date': datetime(2022, 1, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 0
}

with DAG('entity_archive_bot', default_args=default_args, schedule_interval='* * * * *', catchup=False) as dag:
    profiling_args = {
        "MONGODB_URI": Variable.get("mongodb_uri"),
        "ENTITY_MANAGEMENT_URL": Variable.get("entity_management_url"),
    }

    entity_archive_bot_task = DockerOperator(
        task_id='entity-archive-bot',
        image='ghcr.io/fraunhoferisst/diva/entity-archive-bot:0.1.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="core",
        environment={
            **profiling_args
        },
    )

    entity_archive_bot_task
