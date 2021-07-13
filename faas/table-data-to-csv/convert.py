import os
from sas7bdat_converter.converter import to_csv
from shutil import copyfile

INPUT_FILE = os.environ['INPUT_FILE']
OUTPUT_FILE = os.environ['OUTPUT_FILE']
MIME_TYPE = os.environ['MIME_TYPE']

def csv_to_csv():
    copyfile(INPUT_FILE, OUTPUT_FILE)
    print("Done!")

def sas7bdat_to_csv():
    temp_output_file = OUTPUT_FILE + ".csv"
    temp_input_file = "input.sas7bdat"

    print("Preparing...")
    # copy and append extension to the file
    copyfile(INPUT_FILE, temp_input_file)

    print("Converting to CSV...")
    to_csv(temp_input_file, temp_output_file)
    print("Converting done!")
    print("Cleaning up ...")
    os.renames(temp_output_file, OUTPUT_FILE)
    os.remove(temp_input_file)
    print("Done!")


if MIME_TYPE == "application/x-sas-data":
    sas7bdat_to_csv()

elif MIME_TYPE == "text/csv":
    csv_to_csv()

else:
  raise Exception("Please provide a file in supported MIMEType format!")
