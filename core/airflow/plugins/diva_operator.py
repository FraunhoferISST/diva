import os
import json
import tempfile
import logging
import time
import uuid

from airflow.providers.docker.operators.docker import DockerOperator
from airflow.hooks.S3_hook import S3Hook

from tempfile import NamedTemporaryFile, TemporaryDirectory
import os
import pwd
import requests

class DivaOperator(DockerOperator):
    # in these fields you can use template expressions, e.g. "{{ dag_run.conf['input_resource_id'] }}"
    template_fields = ['s3_input_key', 'environment']

    def __init__(
        self, 
        input_task_id='',
        s3_input_key='',
        s3_conn_id='minio',
        upload_output=True,
        bucket='file-lake',
        *args,
        **kwargs):

        super().__init__(*args, **kwargs)
        self.input_task_id = input_task_id
        self.s3_conn_id = s3_conn_id
        self.s3_input_key = s3_input_key
        self.upload_output = upload_output
        self.bucket = bucket

    def execute(self, context):
        # download a file by resource id from minio if set or from given previous task
        input = self.s3_input_key or self.xcom_pull(task_ids=self.input_task_id, context=context)
        s3_hook = S3Hook(self.s3_conn_id)

        # create a temp file for input data. it gets cleaned up automatically
        # wf_input is a predefined name declared in docker-compose.airflow.yml
        with NamedTemporaryFile(mode="wb", dir="/wf_inputs", delete=True) as f_source:

            # Download input
            logging.info("Downloading input")
            logging.info(input)
            source_s3_key_object = s3_hook.get_key(input, self.bucket)
            source_s3_key_object.download_fileobj(Fileobj=f_source)
            f_source.flush()
            logging.info(f_source.name)
            logging.info("Input downloaded")
            
            # setup input/output env vars
            self.environment['INPUT_FILE'] = "/input/" + os.path.basename(f_source.name)

            outputFilename = str(uuid.uuid4())
            self.environment['OUTPUT_FILE'] = "/output/" + outputFilename


            # setup input/output volumes
            # airflow_workflow_outputs is a predefined name declared in docker-compose.airflow.yml
            outVolume = "{}:{}:rw".format("airflow_workflow_outputs", "/output")
            inVolume = "{}:{}:ro".format("airflow_workflow_inputs", "/input")
            self.volumes.append(outVolume)
            self.volumes.append(inVolume)

            # run the container
            logging.info("Create container")
            client = self._get_cli()
            response = client._get(client._url('/images/json'), params={"filters": json.dumps({"reference": [self.image]})})
            result = client._result(response, True)
            if not result:
                self.force_pull = True
            super().execute(context)
            if not result:
                self.force_pull = False
            logging.info("Container finished")

            # Upload output if set
            if self.upload_output:
                logging.info("Uploading output")
                outputFile = "/wf_outputs/{}".format(outputFilename)
                s3_hook.load_file(
                    filename=outputFile,
                    key=outputFilename,
                    bucket_name="analyze",
                    replace=True
                )
                logging.info("Output uploaded")
                os.remove(outputFile)
                return outputFilename

 
