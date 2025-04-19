"use client"

export default function GenreSelector({ genres, selectedGenre, onSelectGenre }) {
  return (
    <div className="genre-selector mb-4">
      <div className="d-flex justify-content-center flex-wrap">
        {genres.map((genre) => (
          <button
            key={genre}
            className={`btn m-1 ${selectedGenre === genre ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => onSelectGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}
