from airflow import DAG
from datetime import datetime, timedelta
from diva_lake_operator import DivaLakeOperator
from airflow.models import Variable

default_args = {
    'owner': 'airflow',
    'description': 'Tabledata analysis workflow',
    'depend_on_past': False,
    'start_date': datetime(2018, 1, 3),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

with DAG('tabledata', default_args=default_args, schedule_interval=None, catchup=False) as dag:
    profiling_args = {
        "ACTOR_ID": "{{ dag_run.conf['actorId'] }}",
        "ENTITY_ID": "{{ dag_run.conf['entityId'] }}",
        "UNIQUE_FINGERPRINT": "{{ dag_run.conf['uniqueFingerprint'] }}",
        "MIME_TYPE": "{{ dag_run.conf['mimeType'] }}",
        "NODE_ENV": 'development',  # test mode,
        "ENTITY_MANAGEMENT_URL": Variable.get("entity_management_url"),
        "MONGODB_URI": Variable.get("mongodb_uri")
    }

    # converter task
    convert = DivaLakeOperator(
        task_id='convert',
        image='ghcr.io/fraunhoferisst/diva/table-data-to-csv:1.0.0',
        api_version='auto',
        auto_remove=True,
        s3_input_key="{{ dag_run.conf['entityId'] }}",
        environment={
            'MIME_TYPE': profiling_args['MIME_TYPE']
        },
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        bucket='file-lake'
    )

    extract_meta = DivaLakeOperator(
        task_id='extractmeta',
        image='ghcr.io/fraunhoferisst/diva/tika-extraction:1.0.0',
        api_version='auto',
        auto_remove=True,
        s3_input_key="{{ dag_run.conf['entityId'] }}",
        environment={
            'MODE': 'META'
        },
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        bucket='file-lake'
    )

    transform_meta = DivaLakeOperator(
        task_id='transform_meta',
        image='ghcr.io/fraunhoferisst/diva/table-data-metadata-extractor:3.0.0',
        api_version='auto',
        auto_remove=True,
        environment={},
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        input_task_id='extractmeta',
        bucket='analyze'
    )

    sample = DivaLakeOperator(
        task_id='sample',
        image='ghcr.io/fraunhoferisst/diva/table-data-sample-extractor:3.0.0',
        api_version='auto',
        auto_remove=True,
        environment={},
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        input_task_id='convert',
        bucket='analyze'
    )

    stats = DivaLakeOperator(
        task_id='stats',
        image='ghcr.io/fraunhoferisst/diva/table-data-column-statistican:3.0.0',
        api_version='auto',
        auto_remove=True,
        environment={},
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        input_task_id='convert',
        bucket='analyze'
    )

    schema = DivaLakeOperator(
        task_id='schema',
        image='ghcr.io/fraunhoferisst/diva/table-data-schema-extractor:2.0.0',
        api_version='auto',
        auto_remove=True,
        environment={},
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        input_task_id='convert',
        bucket='analyze'
    )

    # PATCHES
    upload_meta = DivaLakeOperator(
        task_id='upload_meta',
        image='ghcr.io/fraunhoferisst/diva/entity-management-sink:1.1.0',
        api_version='auto',
        auto_remove=True,
        upload_output=False,
        docker_url="unix://var/run/docker.sock",
        network_mode="core",
        environment={
            **profiling_args
        },
        input_task_id='transform_meta',
        bucket='analyze'
    )

    upload_sample = DivaLakeOperator(
        task_id='upload_sample',
        image='ghcr.io/fraunhoferisst/diva/entity-management-sink:1.1.0',
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

    upload_stats = DivaLakeOperator(
        task_id='upload_stats',
        image='ghcr.io/fraunhoferisst/diva/entity-management-sink:1.1.0',
        api_version='auto',
        auto_remove=True,
        upload_output=False,
        docker_url="unix://var/run/docker.sock",
        network_mode="core",
        environment={
            **profiling_args
        },
        input_task_id='stats',
        bucket='analyze'
    )

    upload_schema = DivaLakeOperator(
        task_id='upload_schema',
        image='ghcr.io/fraunhoferisst/diva/entity-management-sink:1.1.0',
        api_version='auto',
        auto_remove=True,
        upload_output=False,
        docker_url="unix://var/run/docker.sock",
        network_mode="core",
        environment={
            **profiling_args
        },
        input_task_id='schema',
        bucket='analyze'
    )

    stats >> upload_stats
    schema >> upload_schema
    sample >> upload_sample

    extract_meta >> transform_meta >> upload_meta
    convert >> [stats, schema, sample]

    # if MIME_TYPE sas7bdat -> convert
    # if csv -> ohne convert
