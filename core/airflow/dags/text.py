from airflow import DAG
from datetime import datetime, timedelta
from diva_operator import DivaOperator
from diva_multi_operator import DivaMultiOperator

default_args = {
        'owner'                 : 'airflow',
        'description'           : 'Text analysis workflow',
        'depend_on_past'        : False,
        'start_date'            : datetime(2018, 1, 3),
        'email_on_failure'      : False,
        'email_on_retry'        : False,
        'retries'               : 1,
        'retry_delay'           : timedelta(minutes=5)
}

with DAG('text', default_args=default_args, schedule_interval=None, catchup=False) as dag:
        profiling_args = {
                "ACTOR_ID": "{{ dag_run.conf['actorId'] }}",
                "RESOURCE_ID": "{{ dag_run.conf['resourceId'] }}",
                "UNIQUE_FINGERPRINT": "{{ dag_run.conf['uniqueFingerprint'] }}",
                "RESOURCE_MANAGEMENT_URL": 'http://resource-management:3000', # to be removed/rethinked
        }
        extract_text = DivaOperator(
                task_id='extracttext',
                image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/tika-extraction:1.0.0',
                api_version='auto',
                auto_remove=True,
                docker_conn_id='faas_docker',
                s3_input_key="{{ dag_run.conf['uniqueFingerprint'] }}",
                environment={
                 'MODE':'TEXT'
                },
                docker_url="unix://var/run/docker.sock",
                network_mode="diva_workflows",
                bucket='file-lake'
        )

        extract_meta = DivaOperator(
                task_id='extractmeta',
                image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/tika-extraction:1.0.0',
                api_version='auto',
                auto_remove=True,
                docker_conn_id='faas_docker',
                s3_input_key="{{ dag_run.conf['uniqueFingerprint'] }}",
                environment={
                 'MODE':'META'
                },
                docker_url="unix://var/run/docker.sock",
                network_mode="diva_workflows",
                bucket='file-lake'
        )

        language_guesser = DivaOperator(
                task_id='text-language-guesser',
                image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/text-language-guesser:2.0.0',
                api_version='auto',
                auto_remove=True,
                docker_conn_id='faas_docker',
                docker_url="unix://var/run/docker.sock",
                network_mode="diva_workflows",
                input_task_id='extracttext',
                bucket='analyze'
        )

        metadata = DivaOperator(
                task_id='text-metadata-extractor',
                image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/text-metadata-extractor:2.0.0',
                api_version='auto',
                auto_remove=True,
                docker_conn_id='faas_docker',
                docker_url="unix://var/run/docker.sock",
                network_mode="diva_workflows",
                input_task_id='extractmeta',
                bucket='analyze'
        )

        keywords = DivaOperator(
                task_id='text-keyword-extractor',
                image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/text-keyword-extractor:4.1.0',
                api_version='auto',
                auto_remove=True,
                docker_conn_id='faas_docker',
                docker_url="unix://var/run/docker.sock",
                network_mode="diva_workflows",
                input_task_id='extracttext',
                bucket='analyze'
        )

        stats = DivaOperator(
                task_id='text-statistican',
                image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/text-statistican:2.0.0',
                api_version='auto',
                auto_remove=True,
                docker_conn_id='faas_docker',
                docker_url="unix://var/run/docker.sock",
                network_mode="diva_workflows",
                input_task_id='extracttext',
                bucket='analyze'
        )

        core_phrase = DivaOperator(
                task_id='text-core-phrase-extractor',
                image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/text-core-phrase-extractor:4.1.0',
                api_version='auto',
                auto_remove=True,
                docker_conn_id='faas_docker',
                docker_url="unix://var/run/docker.sock",
                network_mode="diva_workflows",
                input_task_id='extracttext',
                bucket='analyze'
        )

        personal_data = DivaOperator(
                task_id='personal_data',
                image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/personal-data-evaluation:2.0.0',
                api_version='auto',
                auto_remove=True,
                docker_conn_id='faas_docker',
                docker_url="unix://var/run/docker.sock",
                network_mode="diva_workflows",
                input_task_id='extracttext',
                bucket='analyze'
        )

        upload_meta = DivaOperator(
                task_id='upload_meta',
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
                input_task_id='text-metadata-extractor',
                bucket='analyze'
        )

        upload_keywords = DivaOperator(
                task_id='upload_keywords',
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
                input_task_id='text-keyword-extractor',
                bucket='analyze'
        )

        upload_core_phrase = DivaOperator(
                task_id='upload_core_phrase',
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
                input_task_id='text-core-phrase-extractor',
                bucket='analyze'
        )

        upload_languages = DivaOperator(
                task_id='upload_languages',
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
                input_task_id='text-language-guesser',
                bucket='analyze'
        )

        upload_stats = DivaOperator(
                task_id='upload_stats',
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
                input_task_id='text-statistican',
                bucket='analyze'
        )

        upload_personal_data = DivaOperator(
                task_id='upload_personal_data',
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
                input_task_id='personal_data',
                bucket='analyze'
        )

        extract_text >> [language_guesser, keywords, stats, core_phrase, personal_data]
        keywords >> upload_keywords
        core_phrase >> upload_core_phrase
        language_guesser >> upload_languages
        stats >> upload_stats
        personal_data >> upload_personal_data
        extract_meta >> metadata >> upload_meta
