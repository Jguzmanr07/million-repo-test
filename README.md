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
    └── namespaces.yaml
├── src
│   └── templates
│       └── index.yaml
│   ├── app.py
│   └── requirements.txt
├── tests
│   ├── test_app.py
│   └── requirements.txt
├── Dockerfile
├── observability-diagram.png
└── README.md
```


## Files and Configurations

- **Dockerfile**: Configuration file to build the Docker image for the Python microservice.

- **Kubernetes Pod (`k8s/k8s-pod.yaml`)**: Kubernetes configuration to deploy the microservice on a Kubernetes cluster.

- **Azure DevOps Pipeline (`.azure-pipelines/azure-pipelines.yml`)**: YAML configuration for the Azure DevOps pipeline, including build, test, and artifact publishing steps.

- **Cloudflare Worker (`cloudflare/cloudflare-worker.js`)**: Cloudflare Worker to resize and cache images based on client requests.

  The Cloudflare Worker handles requests to resize images. The request should include a `url` parameter pointing to the image and optionally a `width` parameter to specify the desired width. If `width` is not specified, a default value of 600 pixels is used.

- **Observability Diagram (`observability-diagram.png`)**: Diagram depicting the observability setup and configuration of the system.

## Configuration

- **Dockerfile**: Update `requirements.txt` and `app.py` as needed for your Python microservice.

- **Kubernetes Pod**: Ensure the `image` property is configured with your Docker repository image and adjust additional resources and configurations as per your requirements.

- **Azure Pipelines**: Modify `trigger` and other steps according to your project structure and CI/CD pipeline requirements.

- **Cloudflare Worker**: Adjust parameters such as width, height, and caching as per your specific requirements for resizing and caching images on Cloudflare.

# Cloudflare Worker para Redimensionar Imágenes

Este Cloudflare Worker está diseñado para redimensionar imágenes dinámicamente y almacenarlas en caché utilizando el servicio de redimensionamiento de imágenes de Weserv. Puedes usar este worker para obtener imágenes redimensionadas simplemente modificando los parámetros de la URL.

## Explanation

### Event Listener

The script begins by adding an event listener for fetch events. When a request comes in, it invokes the `handleRequest` function.

### `handleRequest` Function

1. **Request Processing**:
   ```javascript
   async function handleRequest(event) {
       const request = event.request;
       const url = new URL(request.url);
   
       // Check if the request is for an image
       if (url.pathname.startsWith('/images/')) {
           const imageURL = url.searchParams.get('url');
           const width = parseInt(url.searchParams.get('width')) || 600; // Default width to 600 pixels
   
           // Handle missing image URL
           if (!imageURL) {
               return new Response('Bad Request: Missing image URL', { status: 400 });
           }
   
           // Create a cache key for the image request
           const cacheKey = new Request(imageURL + `?width=${width}`, request);
           const cache = caches.default;
   
           try {
               // Check if the image is cached
               let response = await cache.match(cacheKey);
   
               // If not cached, fetch the original image and resize it
               if (!response) {
                   const imageResponse = await fetch(imageURL);
   
                   if (!imageResponse.ok) {
                       return new Response('Failed to fetch image', { status: 502 });
                   }
   
                   // Resize the image using an external service (https://images.weserv.nl/)
                   const resizedImageResponse = await fetch(`https://images.weserv.nl/?url=${encodeURIComponent(imageURL)}&w=${width}`);
   
                   if (!resizedImageResponse.ok) {
                       return new Response('Failed to resize image', { status: 502 });
                   }
   
                   // Create a response with the resized image
                   response = new Response(await resizedImageResponse.blob(), resizedImageResponse.headers);
                   response.headers.set('Cache-Control', 'public, max-age=86400');
   
                   // Cache the resized image
                   event.waitUntil(cache.put(cacheKey, response.clone()));
               }
   
               return response;
           } catch (error) {
               // Handle internal server errors
               return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
           }
       }
   
       // Handle non-image requests
       return fetch(request);
   }

## Parameters

- `url`: URL of the image to be resized (required).
- `width`: Desired width of the image in pixels (optional, defaults to 600 pixels if not specified).

### Examples

- Original image:

```plaintext
https://cdn.millionandup.com/image-resizing?image=https://maustorageprod.blob.core.windows.net/spinfile/Spin/Data/Estate/IMG/733595ac7750469d92325e641b1e6549.svg?v=945
```

- Get a resized image with width set to 600 pixels:

```plaintext
https://worker-image-resizer.cloudmind.workers.dev/images/?url=https://maustorageprod.blob.core.windows.net/spinfile/Spin/Data/Estate/IMG/733595ac7750469d92325e641b1e6549.svg
```

## Usage

1. Clone the repository to your local environment.
2. Configure and customize each file according to your application's requirements and environment.
3. Deploy configurations and artifacts to their respective platforms (Kubernetes, Azure DevOps, Cloudflare).

## Diagram

![Observability Diagram](observability-diagram.png)
