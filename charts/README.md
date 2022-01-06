# K8s DIVA Helm Chart

We offer a DIVA Helm Chart for easier deployment.
This deployment was tested with a [kind](https://kind.sigs.k8s.io/) cluster.
The following steps were performed under Ubuntu 20.04 LTS.
Other operating systems may differ.

## Install Dependencies

+ [install docker](https://docs.docker.com/engine/install/ubuntu/)

+ [install kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)

+ [install kubectl](https://kubernetes.io/docs/tasks/tools/)

+ [install helm](https://helm.sh/docs/intro/install/)

## Create `kind` Cluster

In the `charts` folder you will find our kind cluster configuration.
Create the cluster using our configuration:

```sh
kind create cluster --name diva --config diva-cluster.yml
```

Set your `kubectl` context according to console output.

## Configure Ubuntu

Your first step is to identify your kind docker containers IP address.

```sh
docker container inspect kind-control-plane --format '{{ .NetworkSettings.Networks.kind IPAddress }}'
```

This IP must be set in your `/etc/hosts` file.
You will need to map every service that should be available from the outside.
We have `ingress` activated for:

+ *web-client* at `diva.local`
+ *keycloak* at `keycloak.local`
+ *kong* at `kong.local`
+ *minio* (alias *lake*) at `minio.local`

For example:

```txt
#k8s/kind
172.19.0.2      diva.local kong.local keycloak.local minio.local
```

You can change these configurations using the `charts/diva/values.yaml`.

## Install DIVA Helm Chart Dependencies

Inside the `charts/diva` folder:

```sh
helm repo add bitnami https://charts.bitnami.com/bitnami
helm dependency update
```

## Install DIVA Helm Chart

Just do (inside the `charts/diva` folder):

```sh
helm install diva .
```
