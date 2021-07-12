print('Start #################################################################');

admin = db.getSiblingDB('admin');
admin.auth('root', "${MONGODB_ROOT_PASSWORD}")
try {
    db.createUser({ user: "asset", pwd: "${MONGODB_ASSET_PASSWORD}", roles: [{ role: "readWrite", db: "assetdb" }] })
    db.createUser({ user: "resource", pwd: "${MONGODB_RESOURCE_PASSWORD}", roles: [{ role: "readWrite", db: "resourcedb" }] })
} catch (err) {
    print("user already created");
}
try {
    db.createUser({ user: "user", pwd: "${MONGODB_USER_PASSWORD}", roles: [{ role: "readWrite", db: "userdb" }] })
} catch (err) {
    print("usermangement user already created");
}

print('END #################################################################');