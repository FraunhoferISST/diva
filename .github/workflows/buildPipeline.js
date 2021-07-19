const fs = require("fs");
const path = require("path");

const nodeTemplate = fs.readFileSync("./templates/publish-node-image.yml", "utf8");
const pythonTemplate = fs.readFileSync("./templates/publish-python-image.yml", "utf8");

const coreServices = fs
    .readdirSync("../../core/services")
    .filter((dir) => dir !== "adapter-services")
    .map((dir) => ({
        name: require(path.join("../../core/services", dir, "package.json")).name,
        path: `core/services/${dir}`,
        type: "node",
    }));

const adapterServices = fs
    .readdirSync("../../core/services/adapter-services")
    .map((dir) => ({
        name: require(path.join(
            "../../core/services/adapter-services",
            dir,
            "package.json"
        )).name,
        path: `core/services/adapter-services/${dir}`,
        type: "node",
    }));

const faasNodeServices = fs
    .readdirSync("../../faas")
    .map((dir) => ({
        dir,
        contents: fs.readdirSync(path.join("../../faas", dir)),
    }))
    .filter(({ contents }) => contents.includes("package.json"))
    .map(({ dir }) => ({
        name: require(path.join("../../faas", dir, "package.json")).name,
        path: `faas/${dir}`,
        type: "node",
    }));

const faasPythonServices = fs
    .readdirSync("../../faas")
    .map((dir) => ({
        dir,
        contents: fs.readdirSync(path.join("../../faas", dir)),
    }))
    .filter(({ contents }) => contents.includes("setup.py"))
    .map(({ dir }) => ({
        name: dir,
        path: `faas/${dir}`,
        type: "python",
    }));

const services = [
    ...coreServices,
    ...faasNodeServices,
    ...faasPythonServices,
    {
        name: "web-client",
        path: "core/web-client",
        type: "node",
    },
];

const buildConfig = (template, service) =>
    fs.writeFileSync(
        `publish-${service.name}-image.yml`,
        template
            .replace(/\+name\+/g, service.name)
            .replace(/\+path\+/g, service.path)
    );

const buildNodeServicePipeline = (service) =>
    buildConfig(nodeTemplate, service);

const buildPythonServicePipeline = (service) =>
    buildConfig(pythonTemplate, service);

for (const service of services) {
    service.type === "node"
        ? buildNodeServicePipeline(service)
        : buildPythonServicePipeline(service);
}