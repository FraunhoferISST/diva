from airflow import DAG
from datetime import datetime
from airflow.providers.docker.operators.docker import DockerOperator
from airflow.models import Variable

default_args = {
    'owner': 'airflow',
    'description': 'Property Forwarder',
    'depend_on_past': False,
    'start_date': datetime(2022, 1, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 0
}

with DAG('property_forwarder', default_args=default_args, schedule_interval=None, catchup=False) as dag:
    profiling_args = {
        "ENTITY_MANAGEMENT_URL": Variable.get("entity_management_url"),
        "ENTITY_ID": "{{ dag_run.conf['entityId'] }}",
        "PATCHED_PROPERTY": "{{ dag_run.conf['patchedProperty'] }}"
    }

    property_forwarder_task = DockerOperator(
        task_id='property-forwarder',
        image='ghcr.io/fraunhoferisst/diva/property-forwarder:0.1.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="core",
        environment={
            **profiling_args
        },
    )

    property_forwarder_task
