from airflow import DAG
from datetime import datetime, timedelta
from airflow.providers.docker.operators.docker import DockerOperator
from airflow.models import Variable

default_args = {
    'owner': 'airflow',
    'description': 'GitHub analysis workflow',
    'depend_on_past': False,
    'start_date': datetime(2023, 1, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

with DAG('github', default_args=default_args, schedule_interval=None, catchup=False) as dag:
    profiling_args = {
        "ENTITY_MANAGEMENT_URL": Variable.get("entity_management_url"),
        "ENTITY_ID": "{{ dag_run.conf['entityId'] }}",
        "ACTOR_ID": "{{ dag_run.conf['actorId'] }}"
    }
    github_metadata_extractor_task = DockerOperator(
        task_id='github-metadata-extractor',
        image='ghcr.io/fraunhoferisst/diva/github-metadata-extractor:0.1.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="core",
        environment={
            **profiling_args
        },
    )

    github_metadata_extractor_task
