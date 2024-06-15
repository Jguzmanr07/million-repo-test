addEventListener('fetch', event => {
    event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
    const request = event.request;
    const url = new URL(request.url);

    // Verificar si la solicitud es para una imagen
    if (url.pathname.startsWith('/images/')) {
        const imageURL = url.searchParams.get('url');
        const width = parseInt(url.searchParams.get('width')) || 600; // Ancho predeterminado a 200 píxeles

        if (!imageURL) {
            return new Response('Bad Request: Missing image URL', { status: 400 });
        }

        const cacheKey = new Request(imageURL + `?width=${width}`, request);
        const cache = caches.default;

        try {
            let response = await cache.match(cacheKey);

            if (!response) {
                const imageResponse = await fetch(imageURL);

                if (!imageResponse.ok) {
                    return new Response('Failed to fetch image', { status: 502 });
                }

                const image = await imageResponse.blob();

                // Redimensionar la imagen utilizando un servicio externo (https://images.weserv.nl/)
                const resizedImageResponse = await fetch(`https://images.weserv.nl/?url=${encodeURIComponent(imageURL)}&w=${width}`);
                
                if (!resizedImageResponse.ok) {
                    return new Response('Failed to resize image', { status: 502 });
                }

                response = new Response(await resizedImageResponse.blob(), resizedImageResponse.headers);
                response.headers.set('Cache-Control', 'public, max-age=86400');

                // Cache the resized image
                event.waitUntil(cache.put(cacheKey, response.clone()));
            }

            return response;
        } catch (error) {
            return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
        }
    }

    // Manejar solicitudes no relacionadas con imágenes
    return fetch(request);
}
