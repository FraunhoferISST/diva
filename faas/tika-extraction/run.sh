#!/bin/sh

if [[ "$MODE" = "TEXT" ]];
then
  OPTION="-t"
  echo "extract text mode"
else
  OPTION="-j"
  echo "extract meta mode"
fi

java -jar tika-app.jar ${OPTION} ${INPUT_FILE} 2>/dev/null > ${OUTPUT_FILE}