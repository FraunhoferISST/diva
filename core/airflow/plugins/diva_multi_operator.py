import os
import json
import tempfile
import logging
import time
import uuid

from airflow.operators.docker_operator import DockerOperator
from airflow.hooks.S3_hook import S3Hook

from tempfile import NamedTemporaryFile, TemporaryDirectory

class DivaMultiOperator(DockerOperator):
    template_fields = ['s3_input_keys']

    def loadInputsFromXCom(self, input_ids, context):
        values = []
        for input_id in input_ids:
            values.append(self.xcom_pull(task_ids=input_id, context=context))
        return values

    def __init__(
        self, 
        input_task_ids=[],
        s3_input_keys=[],
        s3_conn_id='minio',
        *args,
        **kwargs):

        super().__init__(*args, **kwargs)
        self.input_task_ids = input_task_ids
        self.s3_conn_id = s3_conn_id
        self.s3_input_keys = s3_input_keys


    def execute(self, context):
        id = str(uuid.uuid4())
        # pass input logic goes here
        inputs = self.s3_input_keys + self.loadInputsFromXCom(self.input_task_ids, context)
        logging.info(inputs)
        s3_hook = S3Hook(self.s3_conn_id)
        file_handles = []
        for input in inputs:
            input_handle = NamedTemporaryFile(mode="wb", dir="/wf_input/"+id, delete=True)
            source_s3_key_object = s3_hook.get_key(input, "analyze")
            source_s3_key_object.download_fileobj(Fileobj=input_handle)
            input_handle.flush()
            file_handles.append(input_handle)
        
        # setup output logic goes here
        self.environment['INPUT_DIR'] = "/input/"+id+"/"
        outputFilename = str(uuid.uuid4())
        self.environment['OUTPUT_FILE'] = "/output/" + outputFilename
        logging.info("input/")
        
        # appending volume
        outVolume = "{}:{}:rw".format("airflow_workflow_outputs", "/output")
        inVolume = "{}:{}:ro".format("airflow_workflow_inputs", "/input")
        self.volumes.append(outVolume)
        self.volumes.append(inVolume)
        
        # run the container
        super().execute(context)
        time.sleep(2)

        # close temp files
        for file_handle in file_handles:
            file_handle.close()

        outputFile = "/wf_output/{}".format(outputFilename)
        s3_hook.load_file(
            filename=outputFile,
            key=outputFilename,
            bucket_name="analyze",
            replace=True
        )
        os.remove(outputFile)
        return outputFilename
    
 
