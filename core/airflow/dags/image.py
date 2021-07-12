from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from datetime import datetime, timedelta
from airflow.operators.docker_operator import DockerOperator
from diva_operator import DivaOperator


default_args = {
        'owner'                 : 'airflow',
        'description'           : 'Image analysis workflow',
        'depend_on_past'        : False,
        'start_date'            : datetime(2018, 1, 3),
        'email_on_failure'      : False,
        'email_on_retry'        : False,
        'retries'               : 1,
        'retry_delay'           : timedelta(minutes=5)
}

with DAG('image', default_args=default_args, schedule_interval=None, catchup=False) as dag:
        profiling_args = {
                "ACTOR_ID": "{{ dag_run.conf['actorId'] }}",
                "RESOURCE_ID": "{{ dag_run.conf['resourceId'] }}",
                "UNIQUE_FINGERPRINT": "{{ dag_run.conf['uniqueFingerprint'] }}",
                "RESOURCE_MANAGEMENT_URL": 'http://resource-management:3000', # to be removed/rethinked
                "NODE_ENV": 'development' # test mode
        }

        captions = DivaOperator(
                task_id='captions',
                image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/image-caption-generator:2.0.0',
                api_version='auto',
                auto_remove=True,
                docker_conn_id='faas_docker',
                s3_input_key="{{ dag_run.conf['uniqueFingerprint'] }}",
                environment={
                 'IBM_HOST':'profiling-image-caption-generator-ibm',
                 'IBM_PORT ': 5000
                },
                docker_url="unix://var/run/docker.sock",
                network_mode="diva_workflows",
                bucket='file-lake'
        )

        object_detection = DivaOperator(
                task_id='object_detection',
                image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/image-object-detection:2.0.0',
                api_version='auto',
                auto_remove=True,
                docker_conn_id='faas_docker',
                s3_input_key="{{ dag_run.conf['uniqueFingerprint'] }}",
                environment={
                 'IBM_HOST':'profiling-image-object-detection-ibm',
                 'IBM_PORT ': 5000
                },
                docker_url="unix://var/run/docker.sock",
                network_mode="diva_workflows",
                bucket='file-lake'
        )


        metadata = DivaOperator(
                task_id='metadata',
                image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/image-metadata-extractor:2.0.0',
                api_version='auto',
                auto_remove=True,
                docker_conn_id='faas_docker',
                s3_input_key="{{ dag_run.conf['uniqueFingerprint'] }}",
                docker_url="unix://var/run/docker.sock",
                network_mode="diva_workflows",
                bucket='file-lake'
        )

        sample = DivaOperator(
                task_id='sample',
                image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/image-sample-extractor:3.0.0',
                api_version='auto',
                auto_remove=True,
                docker_conn_id='faas_docker',
                s3_input_key="{{ dag_run.conf['uniqueFingerprint'] }}",
                docker_url="unix://var/run/docker.sock",
                network_mode="diva_workflows",
                bucket='file-lake'
        )


        text_extractor = DivaOperator(
                task_id='text_extractor',
                image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/image-text-extractor:3.0.0',
                api_version='auto',
                auto_remove=True,
                docker_conn_id='faas_docker',
                s3_input_key="{{ dag_run.conf['uniqueFingerprint'] }}",
                docker_url="unix://var/run/docker.sock",
                network_mode="diva_workflows",
                bucket='file-lake'
        )


        # PATCHES
        upload_metadata = DivaOperator(
                task_id='upload_metadata',
                image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/resource-management-sink:1.0.1',
                api_version='auto',
                auto_remove=True,
                docker_conn_id='faas_docker',
                upload_output=False,
                docker_url="unix://var/run/docker.sock",
                network_mode="core",
                environment={
                        **profiling_args
                },
                input_task_id='metadata',
                bucket='analyze'
        )

        upload_object = DivaOperator(
                task_id='upload_object',
                image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/resource-management-sink:1.0.1',
                api_version='auto',
                auto_remove=True,
                docker_conn_id='faas_docker',
                upload_output=False,
                docker_url="unix://var/run/docker.sock",
                network_mode="core",
                environment={
                        **profiling_args
                },
                input_task_id='object_detection',
                bucket='analyze'
        )

        upload_captions = DivaOperator(
                task_id='upload_captions',
                image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/resource-management-sink:1.0.1',
                api_version='auto',
                auto_remove=True,
                docker_conn_id='faas_docker',
                upload_output=False,
                docker_url="unix://var/run/docker.sock",
                network_mode="core",
                environment={
                        **profiling_args
                },
                input_task_id='captions',
                bucket='analyze'
        )

        upload_sample = DivaOperator(
                task_id='upload_sample',
                image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/resource-management-sink:1.0.1',
                api_version='auto',
                auto_remove=True,
                docker_conn_id='faas_docker',
                upload_output=False,
                docker_url="unix://var/run/docker.sock",
                network_mode="core",
                environment={
                        **profiling_args
                },
                input_task_id='sample',
                bucket='analyze'
        )

        upload_text = DivaOperator(
                task_id='upload_text',
                image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/resource-management-sink:1.0.1',
                api_version='auto',
                auto_remove=True,
                docker_conn_id='faas_docker',
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
