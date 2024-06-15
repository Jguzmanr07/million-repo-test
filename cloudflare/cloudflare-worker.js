addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  async function handleRequest(request) {
    let url = new URL(request.url)
    
    // Adjust the parameters below to match your requirements
    let params = url.searchParams
    let width = params.get('width') || 800
    let height = params.get('height') || 600
  
    let response = await fetch(url, {
      cf: {
        image: {
          width: parseInt(width),
          height: parseInt(height),
          fit: 'cover',
        },
        cacheTtlByStatus: {
          "200-299": 86400,
          "404": 1,
          "500-599": 0
        }
      }
    })
  
    return response
  }
  