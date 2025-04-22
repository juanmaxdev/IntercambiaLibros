"use client"
import Link from "next/link"

const categories = [
  { name: "Novela", icon: "bi-book" },
  { name: "Ciencia Ficción", icon: "bi-rocket-takeoff" },
  { name: "Fantasía", icon: "bi-stars" },
  { name: "Romántica", icon: "bi-heart" },
  { name: "Histórico", icon: "bi-clock-history" },
  { name: "Autoayuda", icon: "bi-lightbulb" },
  { name: "Biografía", icon: "bi-person" },
  { name: "Poesía", icon: "bi-chat-quote" },
]

export default function FeaturedCategories() {
  return (
    <section className="featured-categories py-5">
      <div className="container">
        <h2 className="text-center mb-4 section-title">Explora por categorías</h2>
        <div className="row g-3 justify-content-center">
          {categories.map((category, index) => (
            <div key={index} className="col-6 col-md-3 col-lg-3">
              <Link
                href={`/libros/generos?genre=${encodeURIComponent(category.name)}`}
                className="text-decoration-none"
              >
                <div className="category-card text-center p-3 h-100 d-flex flex-column justify-content-center align-items-center">
                  <div className="category-icon mb-2">
                    <i className={`bi ${category.icon}`}></i>
                  </div>
                  <h3 className="category-name mb-0">{category.name}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
