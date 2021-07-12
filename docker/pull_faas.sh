#!/bin/sh

echo "Pulling FaaS ..."
echo "\n"
docker pull registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/text-keyword-extractor:4.0.0
docker pull registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/text-metadata-extractor:2.0.0
docker pull registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/text-core-phrase-extractor:4.0.0
docker pull registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/text-language-guesser:2.0.0
docker pull registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/text-statistican:2.0.0

docker pull registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/table-data-to-csv:1.0.0
docker pull registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/tika-extraction:1.0.0
docker pull registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/table-data-metadata-extractor:3.0.0
docker pull registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/table-data-sample-extractor:3.0.0
docker pull registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/table-data-column-statistican:3.0.0
docker pull registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/table-data-schema-extractor:2.0.0

docker pull registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/image-caption-generator:2.0.0
docker pull registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/image-object-detection:2.0.0
docker pull registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/image-metadata-extractor:2.0.0
docker pull registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/image-sample-extractor:3.0.0
docker pull registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/image-text-extractor:3.0.0

docker pull registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/personal-data-evaluation:2.0.0
docker pull registry.gitlab.cc-asp.fraunhofer.de:4567/diva/faas/resource-management-sink:1.0.0
