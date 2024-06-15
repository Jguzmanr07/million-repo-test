# DevOps For Million Company

## structure

```
/
├── .azure-pipelines
│   └── azure-pipelines.yml
├── cloudflare
│   └── cloudflare-worker.js
├── k8s
│   └── k8s-pod.yaml
├── src
│   ├── app.py
│   └── requirements.txt
├── tests
│   ├── test_app.py
│   └── requirements.txt
├── Dockerfile
├── observability-diagram.png
└── README.md
```

## Files

- `Dockerfile`: Docker configuration for the Python microservice.
- `k8s/k8s-pod.yaml`: Kubernetes configuration for deploying the microservice.
- `.azure-pipelines/azure-pipelines.yml`: Azure DevOps pipeline configuration.
- `cloudflare/cloudflare-worker.js`: Cloudflare Worker for resizing and caching images.
- `observability-diagram.png`: Diagram showing the observability setup.

## Configuration

- **Dockerfile**: Update `requirements.txt` and `app.py` as needed.
- **K8s Pod**: Ensure `image` is set to your Docker repository image.
- **Azure Pipelines**: Modify `trigger` and other steps according to your project structure.
- **Cloudflare Worker**: Adjust width, height, and caching parameters as necessary.

## Usage

1. Clone the repository.
2. Follow the instructions in each configuration file to set up your environment.
3. Deploy the configurations to their respective platforms (Kubernetes, Azure DevOps, Cloudflare).

## Diagram

![Observability Diagram](observability-diagram.png)
