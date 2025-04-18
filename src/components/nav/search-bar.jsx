"use client"
import Image from "next/image"

export function SearchBar() {
  return (
    <div className="d-flex justify-content-center w-100 mx-3">
      <form className="d-flex" role="search" style={{ maxWidth: 600, width: "100%" }}>
        <div className="input-group">
          <input type="search" className="form-control" placeholder="Buscar" aria-label="Buscar" />
          <button className="btn btn-outline-secondary" type="submit">
            <Image src="/assets/icons/search.svg" alt="iconoBusqueda" width={20} height={20} />
          </button>
        </div>
      </form>
    </div>
  )
}
