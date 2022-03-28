from airflow import DAG
from datetime import datetime
from airflow.providers.docker.operators.docker import DockerOperator
from airflow.models import Variable

default_args = {
    'owner': 'airflow',
    'description': 'Similarity Network Bot',
    'depend_on_past': False,
    'start_date': datetime(2022, 1, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 0
}

with DAG('similarity_network_bot', default_args=default_args, schedule_interval='* * * * *', max_active_runs=1, catchup=False) as dag:
    profiling_args = {
        "MONGODB_URI": Variable.get("mongodb_uri"),
        "DATANETWORK_ASSISTANT_URL": Variable.get("datanetwork_assistant_url")
    }

    similarity_network_keywords_bot_task = DockerOperator(
        task_id='similarity-network-keywords-bot',
        image='ghcr.io/fraunhoferisst/diva/similarity-network-bot:0.1.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="core",
        environment={
            **profiling_args,
            "HASH_FIELD": "keywordsSimilarityHash",
            "EDGE_TYPE": "keywordsSimilarity",
            "THRESHOLD": "100"
        },
    )

    similarity_network_text_content_bot_task = DockerOperator(
        task_id='similarity-network-text-content-bot',
        image='ghcr.io/fraunhoferisst/diva/similarity-network-bot:0.1.0',
        api_version='auto',
        auto_remove=True,
        docker_url="unix://var/run/docker.sock",
        network_mode="core",
        environment={
            **profiling_args,
            "HASH_FIELD": "textContentSimilarityHash",
            "EDGE_TYPE": "textContentSimilarity",
            "THRESHOLD": "40"
        },
    )

    similarity_network_keywords_bot_task
    similarity_network_text_content_bot_task
