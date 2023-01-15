from airflow import DAG
from datetime import datetime
from airflow.providers.docker.operators.docker import DockerOperator
from airflow.models import Variable

default_args = {
    'owner': 'airflow',
    'description': 'GDPR Relevancy Forwarder',
    'depend_on_past': False,
    'start_date': datetime(2022, 1, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 0
}

with DAG('gdpr_relevancy_forwarder', default_args=default_args, schedule_interval=None, catchup=False) as dag:
    profiling_args = {
        "MONGODB_URI": Variable.get("mongodb_uri"),
        "NEO4J_URL": Variable.get("neo4j_url"),
        "NEO4J_ROOT_USERNAME": Variable.get("neo4j_root_username"),
        "NEO4J_ROOT_PASSWORD": Variable.get("neo4j_root_password"),
        "ENTITY_MANAGEMENT_URL": Variable.get("entity_management_url"),
        "ENTITY_ID": "{{ dag_run.conf['entityId'] }}",
        "ACTOR_ID": "{{ dag_run.conf['actorId'] }}"
    }

    gdpr_relevancy_forwarder_task = DockerOperator(
        task_id='gdpr-relevancy-forwarder',
        image='ghcr.io/fraunhoferisst/diva/gdpr-relevancy-forwarder:0.1.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="core",
        environment={
            **profiling_args
        },
    )

    gdpr_relevancy_forwarder_task
