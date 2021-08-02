from airflow import DAG
from datetime import datetime, timedelta
from diva_operator import DivaOperator

default_args = {
    'owner': 'airflow',
    'description': 'Text analysis workflow',
    'depend_on_past': False,
    'start_date': datetime(2018, 1, 3),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

with DAG('text', default_args=default_args, schedule_interval=None, catchup=False) as dag:
    profiling_args = {
        "ACTOR_ID": "{{ dag_run.conf['actorId'] }}",
        "RESOURCE_ID": "{{ dag_run.conf['resourceId'] }}",
        "UNIQUE_FINGERPRINT": "{{ dag_run.conf['uniqueFingerprint'] }}",
        "RESOURCE_MANAGEMENT_URL": 'http://resource-management:3000',  # to be removed/rethinked
    }
    extract_text = DivaOperator(
        task_id='extracttext',
        image='ghcr.io/fraunhoferisst/diva/tika-extraction:1.0.0',
        api_version='auto',
        auto_remove=True,
        s3_input_key="{{ dag_run.conf['uniqueFingerprint'] }}",
        environment={
            'MODE': 'TEXT'
        },
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        bucket='file-lake'
    )

    extract_meta = DivaOperator(
        task_id='extractmeta',
        image='ghcr.io/fraunhoferisst/diva/tika-extraction:1.0.0',
        api_version='auto',
        auto_remove=True,
        s3_input_key="{{ dag_run.conf['uniqueFingerprint'] }}",
        environment={
            'MODE': 'META'
        },
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        bucket='file-lake'
    )

    language_guesser = DivaOperator(
        task_id='text-language-guesser',
        image='ghcr.io/fraunhoferisst/diva/text-language-guesser:2.0.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        input_task_id='extracttext',
        bucket='analyze'
    )

    metadata = DivaOperator(
        task_id='text-metadata-extractor',
        image='ghcr.io/fraunhoferisst/diva/text-metadata-extractor:2.0.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        input_task_id='extractmeta',
        bucket='analyze'
    )

    keywords = DivaOperator(
        task_id='text-keyword-extractor',
        image='ghcr.io/fraunhoferisst/diva/text-keyword-extractor:4.1.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        input_task_id='extracttext',
        bucket='analyze'
    )

    stats = DivaOperator(
        task_id='text-statistican',
        image='ghcr.io/fraunhoferisst/diva/text-statistican:2.0.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        input_task_id='extracttext',
        bucket='analyze'
    )

    core_phrase = DivaOperator(
        task_id='text-core-phrase-extractor',
        image='ghcr.io/fraunhoferisst/diva/text-core-phrase-extractor:4.1.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        input_task_id='extracttext',
        bucket='analyze'
    )

    personal_data = DivaOperator(
        task_id='personal_data',
        image='ghcr.io/fraunhoferisst/diva/personal-data-evaluation:2.0.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        input_task_id='extracttext',
        bucket='analyze'
    )

    upload_meta = DivaOperator(
        task_id='upload_meta',
        image='ghcr.io/fraunhoferisst/diva/resource-management-sink:1.0.1',
        api_version='auto',
        auto_remove=True,
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
        image='ghcr.io/fraunhoferisst/diva/resource-management-sink:1.0.1',
        api_version='auto',
        auto_remove=True,
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
        image='ghcr.io/fraunhoferisst/diva/resource-management-sink:1.0.1',
        api_version='auto',
        auto_remove=True,
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
        image='ghcr.io/fraunhoferisst/diva/resource-management-sink:1.0.1',
        api_version='auto',
        auto_remove=True,
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
        image='ghcr.io/fraunhoferisst/diva/resource-management-sink:1.0.1',
        api_version='auto',
        auto_remove=True,
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
        image='ghcr.io/fraunhoferisst/diva/resource-management-sink:1.0.1',
        api_version='auto',
        auto_remove=True,
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
