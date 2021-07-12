# Airflow

This Airflow version is based on docker-airflow and is extended with docker support, please see the `Dockerfile`.

## Integration in DIVA
When profiling data in DIVA, airflow orchestrates various analysis task to a single analytic workflow, modeled as a DAG.
These workflows are located in `dags`.

![](docs/airflow-diva-integration.svg)

### DivaOperator
You will see that they all use a `DivaOperator`, which is an extended DockerOperator. It allows you to spawn a docker image
as a task (just as the original DockerOperator), but also downloads input data from previous tasks or config and uploads
output data.
Please note that this download/upload is performed by the airflow executor and **not** in the container. The operator
simply mounts the downloaded files in a predefined docker volume `airflow_workflow_inputs` at `/inputs` and expects output files written to the
designated output volume `airflow_workflow_outputs`, which is mounted at `/outputs`.
To tell the analytics image where the input file is located and where to write the output file, the env variables
`INPUT_FILE` and `OUTPUT_FILE` are used. In [all FaaS images](https://gitlab.cc-asp.fraunhofer.de/diva/faas) these variables are required.

##### Input Data
The DivaOperator can download the input file from a previous task, if this task provided the resource id as the output XCOM value.
The operator can then look up this value and use it to download the file from minio.
To do this, you have to specify the previous task's name in `input_task_id`.
You can also directly provide a fixed resource id by using the parameter `s3_input_key`.

##### Example

```
captions = DivaOperator(
    # name of this task
    task_id='captions',
    # image to spawn for analysis
    image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/image-caption-generator:1.0.0',
    
    api_version='auto',
    auto_remove=True,
    
    # docker credentials for pulling custom images. faas_docker allows pulling from Fraunhofer gitlab.
    docker_conn_id='faas_docker',
    
    # download the input data directly from minio. The resource id is read from the config value `input_resource_id` in this case. 
    s3_input_key="{{ dag_run.conf['input_resource_id'] }}",
    
    # optional, additional env variables
    environment={
        'IBM_HOST':'profiling-image-caption-generator-ibm'
    },
    
    # make the output value, e.g. the resulting resource id in minio, available to tasks downstream 
    xcom_push=True,

    docker_url="unix://var/run/docker.sock",
    
    # the docker network to use. required if you want to talk to other services
    network_mode="diva_workflows"
)
```

##### Params

Name | Default | Description
--- | --- | ---
input_task_id | | Optional, id of a previous task that returned a resource id via XCOM that should be used as input.
s3_input_key |  | Optional an id of a resource in minio/s3 that should be used as input.
s3_conn_id | minio | Connection id for airflow. Required for upload/download.
upload_output | True | Uploads data that got written to the output volume. Not required for kafka-sink or other tasks with side effect output.

### Trigger resource profiling
Airflow worklows can be triggered via CLI or via the experimental REST API. The latter is used in DIVA.
The resource management sends a request to airflow to trigger a certain DAG, depending on the mimetype.
In the request body, some information is required to execute our workflows properly.
A Postman Collection is also provided in `docs`.

E.g. POST Request to `http://localhost:8080/api/experimental/dags/text/dag_runs`
```
{
    "conf": {
        # the resource to be analyzed
        "input_resource_id": "73f68882-bee8-4e0b-a31b-aac409f70332",
        
        # user that triggered this request
        "user_id": "urn:uuid:asdsad4d1fcb08-b894-4bdf-b662-0f105d597189",
        
        # this profiling request's id
        "request_id": "urn:uuid:4600ea84-485a-49b3-8f15-85fc5ce2e0f9",
        
        # mimetype of the resource
        "mime_type": "text/csv"
    }
}
```

### Workflow result
At the end of a workflow, the output data probably should be stored in DIVA. In order to prevent breaking the existing
profiling messages system, we used a separate task for each task which has data that should be uploaded.
This extra task is basically a kafka sink, which downloads a resource file from minio and embeds its content to a kafka message.

![](docs/sink.svg)

Which message is used, is controlled by the `SCHEMA_NAME` parameter. 
Please note that the kafka-sink holds all the schemas and therefore is the same docker image for every task.

##### Example

```

upload_personal_data = DivaOperator(
    task_id='upload_personal_data',
    image='registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/kafka-sink:1.5.0',
    api_version='auto',
    auto_remove=True,
    docker_conn_id='faas_docker',
    xcom_push=True,
    # since the data is pushed to kafka, we do not want to upload any output data
    upload_output=False,
    docker_url="unix://var/run/docker.sock",
    
    # the docker network to use. required, because we have to access the kafka broker
    network_mode="diva_workflows",
    
    # add the schema name to the other env variables (which are inside the variable profiling_args)
    environment={
            **{"SCHEMA_NAME": "profiling-personal-data-evaluation-result-50d5dae4-e5bc-45de-87a1-a12125fb1901.json"},
            **profiling_args
    },

    # use the output data from this previous task
    input_task_id='personal_data'
)
```

The kafka message can then be read by other services, e.g. the resource management, that store its content into their databases.


## Debugging

### Trigger a workflow via CLI

1. open a bash shell in the airflow container
2. run `airflow trigger_dag <dag_name>  --conf <conf>`
Example
```
# input_resource_id is the id of the resource in minio
airflow trigger_dag text  --conf '{ "input_resource_id":"276fce15-893b-4f05-8118-716ea924d932",  "user_id": "urn:uuid:asdsad4d1fcb08-b894-4bdf-b662-0f105d597189", "request_id":"urn:uuid:4600ea84-485a-49b3-8f15-85fc5ce2e0f9", "mime_type": "application/pdf" }'
```

##### Multi
airflow trigger_dag multi-test  --conf '{"input_resource_id1":"276fce15-893b-4f05-8118-716ea924d932", "input_resource_id2":"5d6840f6-cc96-4c30-8e69-a1874f9b2e0d"}'