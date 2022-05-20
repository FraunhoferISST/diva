from airflow import DAG
from datetime import datetime, timedelta
from diva_lake_operator import DivaLakeOperator
from airflow.models import Variable

default_args = {
    'owner': 'airflow',
    'description': 'Image analysis workflow',
    'depend_on_past': False,
    'start_date': datetime(2018, 1, 3),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

with DAG('image', default_args=default_args, schedule_interval=None, catchup=False) as dag:
    profiling_args = {
        "ACTOR_ID": "{{ dag_run.conf['actorId'] }}",
        "ENTITY_ID": "{{ dag_run.conf['entityId'] }}",
        "UNIQUE_FINGERPRINT": "{{ dag_run.conf['uniqueFingerprint'] }}",
        "NODE_ENV": 'development',  # test mode
        "ENTITY_MANAGEMENT_URL": Variable.get("entity_management_url"),
        "MONGODB_URI": Variable.get("mongodb_uri")
    }

    captions = DivaLakeOperator(
        task_id='captions',
        image='ghcr.io/fraunhoferisst/diva/image-caption-generator:2.0.0',
        api_version='auto',
        auto_remove=True,
        s3_input_key="{{ dag_run.conf['entityId'] }}",
        environment={
            'IBM_HOST': 'profiling-image-caption-generator-ibm',
            'IBM_PORT ': 5000
        },
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        bucket='file-lake'
    )

    object_detection = DivaLakeOperator(
        task_id='object_detection',
        image='ghcr.io/fraunhoferisst/diva/image-object-detection:2.0.0',
        api_version='auto',
        auto_remove=True,
        s3_input_key="{{ dag_run.conf['entityId'] }}",
        environment={
            'IBM_HOST': 'profiling-image-object-detection-ibm',
            'IBM_PORT ': 5000
        },
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        bucket='file-lake'
    )

    metadata = DivaLakeOperator(
        task_id='metadata',
        image='ghcr.io/fraunhoferisst/diva/image-metadata-extractor:2.0.0',
        api_version='auto',
        auto_remove=True,
        s3_input_key="{{ dag_run.conf['entityId'] }}",
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        bucket='file-lake'
    )

    sample = DivaLakeOperator(
        task_id='sample',
        image='ghcr.io/fraunhoferisst/diva/image-sample-extractor:3.0.0',
        api_version='auto',
        auto_remove=True,
        s3_input_key="{{ dag_run.conf['entityId'] }}",
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        bucket='file-lake'
    )

    text_extractor = DivaLakeOperator(
        task_id='text_extractor',
        image='ghcr.io/fraunhoferisst/diva/image-text-extractor:3.0.0',
        api_version='auto',
        auto_remove=True,
        s3_input_key="{{ dag_run.conf['entityId'] }}",
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        bucket='file-lake'
    )

    # PATCHES
    upload_metadata = DivaLakeOperator(
        task_id='upload_metadata',
        image='ghcr.io/fraunhoferisst/diva/entity-management-sink:1.0.0',
        api_version='auto',
        auto_remove=True,
        upload_output=False,
        docker_url="unix://var/run/docker.sock",
        network_mode="core",
        environment={
            **profiling_args
        },
        input_task_id='metadata',
        bucket='analyze'
    )

    upload_object = DivaLakeOperator(
        task_id='upload_object',
        image='ghcr.io/fraunhoferisst/diva/entity-management-sink:1.0.0',
        api_version='auto',
        auto_remove=True,
        upload_output=False,
        docker_url="unix://var/run/docker.sock",
        network_mode="core",
        environment={
            **profiling_args
        },
        input_task_id='object_detection',
        bucket='analyze'
    )

    upload_captions = DivaLakeOperator(
        task_id='upload_captions',
        image='ghcr.io/fraunhoferisst/diva/entity-management-sink:1.0.0',
        api_version='auto',
        auto_remove=True,
        upload_output=False,
        docker_url="unix://var/run/docker.sock",
        network_mode="core",
        environment={
            **profiling_args
        },
        input_task_id='captions',
        bucket='analyze'
    )

    upload_sample = DivaLakeOperator(
        task_id='upload_sample',
        image='ghcr.io/fraunhoferisst/diva/entity-management-sink:1.0.0',
        api_version='auto',
        auto_remove=True,
        upload_output=False,
        docker_url="unix://var/run/docker.sock",
        network_mode="core",
        environment={
            **profiling_args
        },
        input_task_id='sample',
        bucket='analyze'
    )

    upload_text = DivaLakeOperator(
        task_id='upload_text',
        image='ghcr.io/fraunhoferisst/diva/entity-management-sink:1.0.0',
        api_version='auto',
        auto_remove=True,
        upload_output=False,
        docker_url="unix://var/run/docker.sock",
        network_mode="core",
        environment={
            **profiling_args
        },
        input_task_id='text_extractor',
        bucket='analyze'
    )

    # Workflow DAG
    object_detection >> upload_object
    text_extractor >> upload_text
    captions >> upload_captions
    sample >> upload_sample
    metadata >> upload_metadata
