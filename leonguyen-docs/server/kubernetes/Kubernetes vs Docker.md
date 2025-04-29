Core Docker concepts
Docker revolves around two core concepts: containers and images.

A Docker container is an executable software package running in an isolated environment that includes its own operating system, filesystem, virtual network, and namespace, and that bundles an application and its dependencies.

A Docker image, on the other hand, is the template from which containers are created. It includes the base operating system, initial filesystem, application code, tools, libraries, dependencies, and configurations required to be able to create a runnable instance within a container.

### Docker images and Dockerfiles
A Docker image is an immutable, stand-alone, and executable package that contains everything needed to run a piece of software, including the runtime, filesystem, system tools, application's code, libraries, and settings.

An image is composed of a base image, which typically includes a minimal operating system, a runtime environment, and some essential tools required to run software applications, and additional layers that represent modifications and additions made to that base image.

It serves as a template for creating Docker containers.

Both base and custom images are usually stored on and downloaded from servers called Docker registries, like the official Docker Hub registry.
### Dockerfiles
A Dockerfile is a plain text file that contains all the necessary instructions to create a Docker image.

When you build the Docker image using the `docker build` command,
```
FROM ubuntu:latest

RUN apt update
RUN apt install -y nginx

COPY test_html /var/www/html

RUN ln -sf /dev/stdout /var/log/nginx/access.log

EXPOSE 80
CMD /usr/sbin/nginx -g 'daemon off;'
```
### Docker containers
A Docker container is a runnable instance of a Docker image.
### Docker Compose
An overview of Docker Compose files
Docker Compose files are written in the YAML format and are, by default, named compose.yaml.

They usually contain a list of:

- Services: the containers, their configurations, and their relationships.
- Networks: the virtual networks that facilitate the communication between the different services.
- Volumes: the persistent data storages used by the services.
- Configs: the services configuration stored separately from the containers filesystems.
- Secrets: the sensitive services data, such as passwords or tokens.


# Start an overview of Kubernetes
Core Kubernetes concepts
Kubernetes revolves around three core concepts: Pods, Nodes and clusters.

1. ***A Pod*** is the smallest deployable unit of computation within a Node, that runs one or more tightly coupled containers that are designed to share storage and network resources.
2. ***A Node***, also called Worker Node, is an individual server within a cluster that can run multiple Pods, providing the resources and runtime environment for containers.
3. ***A cluster*** is a collection of Nodes that are managed by the control plane and that work together to run containerized applications by providing the entire computing infrastructure.
The Kubernetes control plane
The control plane is the central management component that administers the entire Kubernetes cluster.
It is composed of several components, including:
- The API server, which is responsible for processing RESTful API requests and serving as the gateway to the cluster's internal workings.
- etcd, which is a database used by Kubernetes to store and manage the cluster's configuration data.
- The scheduler, which is responsible for placing Pods onto suitable Nodes within the cluster.
- The controller manager, which regulates the state of the system to ensure it matches the desired configurations specified by users.


Kubernetes Worker Nodes
Kubernetes Pods

Kubernetes Controllers

# Using Docker and Kubernetes

# A real-life scenario: Automating the deployment of an application with Docker and Kubernetes
Step 1: Developing the application
Step 2: Creating a Dockerfile
Step 3: Building the Docker image
Step 4: Testing the Docker image
Step 5: Pushing the Docker image to a registry
Step 6: Setting up a Kubernetes cluster
Step 7: Creating a Kubernetes Deployment and Service configuration
Step 8: Applying the Kubernetes configuration to the cluster
Step 9: Automating the process with CI/CD

 