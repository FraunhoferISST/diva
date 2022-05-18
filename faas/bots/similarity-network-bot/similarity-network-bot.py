import os
import pymongo
import pybktree
import collections
import requests
import time

# env and fixed variables
MONGODB_URI = os.getenv('MONGODB_URI', "mongodb://admin:admin@localhost:27017/")
DB_NAME = os.getenv('DB_NAME', "divaDb")
COLLECTION_NAME = os.getenv('COLLECTION_NAME', "entities")
ENTITY_MANAGEMENT_URL = os.getenv(
    'ENTITY_MANAGEMENT_URL', "http://localhost:3000")
SERVICE_ID = "service:uuid:f144b46a-6dfe-4dac-8fbc-611622e57394"
HEADERS = {"x-diva": str({"actorId": SERVICE_ID})}

HASH_FIELD = os.getenv('HASH_FIELD', "keywordsSimilarityHash")
EDGE_TYPE = os.getenv('EDGE_TYPE', "keywordsSimilarity")
THRESHOLD = int(os.getenv('THRESHOLD', "100"))

Dataset = collections.namedtuple('Dataset', 'hash id')


# build BK Tree with a list of datasets
def build_bk_tree(dataset_list):
    def item_distance(x, y):
        return pybktree.hamming_distance(x.hash, y.hash)

    return pybktree.BKTree(item_distance, dataset_list)


def delete_outdated_similarity_edges(entity_id, similar_fingerprints):
    # get existing similarity edges for current entity
    payload = {"from": entity_id, "bidirectional": "true",
               "edgeTypes": EDGE_TYPE}
    res = requests.get(ENTITY_MANAGEMENT_URL + "/edges",
                       params=payload, headers=HEADERS).json()

    # Delete existing edges if there is no similarity anymore
    for edge in res["collection"]:
        exists = False
        for s in similar_fingerprints:
            if s[1][1] == edge["to"]["entityId"]:
                exists = True
                break
        if exists:
            break

        requests.delete(ENTITY_MANAGEMENT_URL + "/edges/" +
                        edge["properties"]["id"], headers=HEADERS)


def upsert_similarity_edges(entity_id, similar_fingerprints):
    # get existing similarity edges for current entity
    payload = {"from": entity_id, "bidirectional": "true",
               "edgeTypes": EDGE_TYPE}
    res = requests.get(ENTITY_MANAGEMENT_URL + "/edges",
                       params=payload, headers=HEADERS).json()

    for fingerprint in similar_fingerprints:
        if entity_id == fingerprint[1][1]:
            continue

        exists = False
        needs_update = False
        edge_id = ""

        for e in res["collection"]:
            if fingerprint[1][1] == e["from"]["entityId"]:
                exists = True
                if fingerprint[0] != e["properties"]["score"]:
                    needs_update = True
                    edge_id = e["properties"]["id"]
                break

        # if edge does not exist and nodes are not the same, POST
        if not exists and entity_id != fingerprint[1][1]:
            requests.post(ENTITY_MANAGEMENT_URL + "/edges", json={
                "from": entity_id,
                "to": fingerprint[1][1],
                "edgeType": EDGE_TYPE,
                "properties": {
                    "score": fingerprint[0]
                }
            }, headers=HEADERS)

        # if edge exists and needs update, PATCH
        if exists and needs_update:
            requests.patch(ENTITY_MANAGEMENT_URL + "/edges/" + edge_id, json={
                "score": fingerprint[0]
            }, headers=HEADERS)


def process(entities, similarity_hash_tree):
    for entity in entities:
        similar_fingerprints = similarity_hash_tree.find(entity, THRESHOLD)
        delete_outdated_similarity_edges(entity[1], similar_fingerprints)
        upsert_similarity_edges(entity[1], similar_fingerprints)


# connect to mongodb
myclient = pymongo.MongoClient(MONGODB_URI)
mydb = myclient[DB_NAME]
mycol = mydb[COLLECTION_NAME]

# build up datastructure and bk tree
print("🏗️  Constructing bk tree structure for " + HASH_FIELD + "...")
start_time_bk_tree = time.time()
working_data = []
for entity in mycol.find({HASH_FIELD: {"$exists": True}}, {"_id": 0, "id": 1, HASH_FIELD: 1}):
    working_data.append(
        Dataset(int(entity[HASH_FIELD], 16), entity["id"]))
similarity_hash_tree = build_bk_tree(working_data)
end_time_bk_tree = time.time()
print('🕓 It took {:5.3f}s to build bk tree structure'.format(end_time_bk_tree - start_time_bk_tree))

print("🔍 Search and process similarities...")
start_time_process = time.time()
process(working_data, similarity_hash_tree)
end_time_process = time.time()
print('🕓 It took {:5.3f}s to search and process similarities'.format(end_time_process - start_time_process))
