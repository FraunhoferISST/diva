import os
import pymongo
import pybktree
import collections
import requests

SERVICE_ID = "service:uuid:f144b46a-6dfe-4dac-8fbc-611622e57394"
MONGO_URL = os.getenv('MONGO_URL', "mongodb://admin:admin@localhost:27017/")
DB_NAME = os.getenv('DB_NAME', "divaDb")
COLLECTION_NAME = os.getenv('COLLECTION_NAME', "entities")

DATA_NETWORK_ASSISTANT_URL = os.getenv('DATA_NETWORK_ASSISTANT_URL', "http://localhost:3012")

# connect to mongodb
myclient = pymongo.MongoClient(MONGO_URL)
mydb = myclient[DB_NAME]
mycol = mydb[COLLECTION_NAME]

# build up datastructure for BK Tree
Dataset = collections.namedtuple('Dataset', 'hash id')
workingdata = []

for entity in mycol.find({"keywordsSimilarityHash": {"$exists": True }},{ "_id": 0, "id": 1, "keywordsSimilarityHash": 1 }):
    workingdata.append(Dataset(int(entity["keywordsSimilarityHash"], 16), entity["id"]))

def item_distance(x, y):
    return pybktree.hamming_distance(x.hash, y.hash)

keywordsSimHashTree = pybktree.BKTree(item_distance, workingdata)

for w in workingdata:
    payload = {"from": w[1], "bidirectional": "true", "edgeTypes": "keywordsSimilarity"}
    r = requests.get(DATA_NETWORK_ASSISTANT_URL + "/edges", params=payload, headers={"x-actorid": SERVICE_ID})
    data = r.json()
    print(w[1])
    print(data["collection"])

    #similarDatasets = keywordsSimHashTree.find(w, 100)
    #for s in similarDatasets:
    #    print(w[1])
    #    print(s[1][1])
    #    print(str(s[0]))


# 1. GET keywordsSimilarity Kanten
# 2. Prüfe welche Kanten ich löschen kann -> DELETE
# 3. Prüfe welche existierenden Kanten ich updaten muss -> PATCH
# 4. Prüfe welche nicht existierenden Kanten angelegt werden müssen -> POST


# Content Hash und Keyword Hash nacheinander? 