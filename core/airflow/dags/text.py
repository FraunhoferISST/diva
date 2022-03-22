from airflow import DAG
from datetime import datetime, timedelta
from diva_lake_operator import DivaLakeOperator
from airflow.models import Variable

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
        "ENTITY_ID": "{{ dag_run.conf['entityId'] }}",
        "UNIQUE_FINGERPRINT": "{{ dag_run.conf['uniqueFingerprint'] }}",
        "ENTITY_MANAGEMENT_URL": Variable.get("entity_management_url"),
        "MONGODB_URI": Variable.get("mongodb_uri")
    }
    extract_text = DivaLakeOperator(
        task_id='extracttext',
        image='ghcr.io/fraunhoferisst/diva/tika-extraction:1.0.0',
        api_version='auto',
        auto_remove=True,
        s3_input_key="{{ dag_run.conf['entityId'] }}",
        environment={
            'MODE': 'TEXT'
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

    language_guesser = DivaLakeOperator(
        task_id='text-language-guesser',
        image='ghcr.io/fraunhoferisst/diva/text-language-guesser:2.0.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        input_task_id='extracttext',
        bucket='analyze'
    )

    metadata = DivaLakeOperator(
        task_id='text-metadata-extractor',
        image='ghcr.io/fraunhoferisst/diva/text-metadata-extractor:2.0.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        input_task_id='extractmeta',
        bucket='analyze'
    )

    keywords = DivaLakeOperator(
        task_id='text-keyword-extractor',
        image='ghcr.io/fraunhoferisst/diva/text-keyword-extractor:4.1.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        input_task_id='extracttext',
        bucket='analyze'
    )

    stats = DivaLakeOperator(
        task_id='text-statistican',
        image='ghcr.io/fraunhoferisst/diva/text-statistican:2.0.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        input_task_id='extracttext',
        bucket='analyze'
    )

    core_phrase = DivaLakeOperator(
        task_id='text-core-phrase-extractor',
        image='ghcr.io/fraunhoferisst/diva/text-core-phrase-extractor:4.1.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        input_task_id='extracttext',
        bucket='analyze'
    )

    personal_data = DivaLakeOperator(
        task_id='text-personal-data',
        image='ghcr.io/fraunhoferisst/diva/text-personal-data-evaluation:3.0.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        input_task_id='extracttext',
        bucket='analyze'
    )

    similarity_hash_generator = DivaLakeOperator(
        task_id='text-similarity-hash-generator',
        image='ghcr.io/fraunhoferisst/diva/text-similarity-hash-generator:0.1.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="diva_workflows",
        input_task_id='extracttext',
        bucket='analyze'
    )

    upload_meta = DivaLakeOperator(
        task_id='upload_meta',
        image='ghcr.io/fraunhoferisst/diva/entity-management-sink:1.0.0',
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

    upload_keywords = DivaLakeOperator(
        task_id='upload_keywords',
        image='ghcr.io/fraunhoferisst/diva/entity-management-sink:1.0.0',
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

    upload_core_phrase = DivaLakeOperator(
        task_id='upload_core_phrase',
        image='ghcr.io/fraunhoferisst/diva/entity-management-sink:1.0.0',
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

    upload_languages = DivaLakeOperator(
        task_id='upload_languages',
        image='ghcr.io/fraunhoferisst/diva/entity-management-sink:1.0.0',
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

    upload_stats = DivaLakeOperator(
        task_id='upload_stats',
        image='ghcr.io/fraunhoferisst/diva/entity-management-sink:1.0.0',
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

    upload_personal_data = DivaLakeOperator(
        task_id='upload_personal_data',
        image='ghcr.io/fraunhoferisst/diva/entity-management-sink:1.0.0',
        api_version='auto',
        auto_remove=True,
        upload_output=False,
        docker_url="unix://var/run/docker.sock",
        network_mode="core",
        environment={
            **profiling_args
        },
        input_task_id='text-personal-data',
        bucket='analyze'
    )

    upload_similarity_hash = DivaLakeOperator(
        task_id='upload_similarity_hash',
        image='ghcr.io/fraunhoferisst/diva/entity-management-sink:1.0.0',
        api_version='auto',
        auto_remove=True,
        upload_output=False,
        docker_url="unix://var/run/docker.sock",
        network_mode="core",
        environment={
            **profiling_args
        },
        input_task_id='text-similarity-hash-generator',
        bucket='analyze'
    )

    extract_text >> [language_guesser, keywords, stats, core_phrase, personal_data, similarity_hash_generator]
    keywords >> upload_keywords
    core_phrase >> upload_core_phrase
    language_guesser >> upload_languages
    stats >> upload_stats
    personal_data >> upload_personal_data
    similarity_hash_generator >> upload_similarity_hash
    extract_meta >> metadata >> upload_meta
