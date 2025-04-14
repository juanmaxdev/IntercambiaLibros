export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const width = searchParams.get("width") || 200
    const height = searchParams.get("height") || 300
  
    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#f0f0f0" />
        <text x="50%" y="50%" font-family="Arial" font-size="20" fill="#999" text-anchor="middle" dominant-baseline="middle">No Image</text>
      </svg>
    `
  
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  }
  