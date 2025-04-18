export async function GET() {
    try {
      const response = await fetch("https://intercambialibros-omega.vercel.app/api/generos", {
        cache: "no-store", // Don't cache the response
        headers: {
          "Content-Type": "application/json",
        },
      })
  
      if (!response.ok) {
        return new Response(JSON.stringify({ error: `API responded with status: ${response.status}` }), {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
          },
        })
      }
  
      const data = await response.json()
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      })
    } catch (error) {
      console.error("Error fetching books:", error)
      return new Response(JSON.stringify({ error: "Failed to fetch books from external API" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }
  }