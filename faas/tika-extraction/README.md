# Tika extraction

A simple service to extract text or meta data from a file with Apache Tika.

## Configuration

Environment variables:

Name | Default | Description
--- | --- | ---
Mode     | "TEXT" | Extract text or meta (as JSON). Values: "TEXT or "META"
INPUT_FILE    |  |  A path to the input file to be analyzed
OUTPUT_FILE  | |  A path to the resulting output file
