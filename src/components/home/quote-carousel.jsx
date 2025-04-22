"use client"
import { useState, useEffect } from "react"

const quotes = [
  {
    text: "Un lector vive mil vidas antes de morir. Quien nunca lee vive solo una.",
    author: "George R.R. Martin",
  },
  {
    text: "Siempre imaginé que el Paraíso sería algún tipo de biblioteca.",
    author: "Jorge Luis Borges",
  },
  {
    text: "Leer es soñar con los ojos abiertos.",
    author: "Anónimo",
  },
  {
    text: "Los libros son espejos: sólo se ve en ellos lo que uno ya lleva dentro.",
    author: "Carlos Ruiz Zafón",
  },
  {
    text: "La lectura es a la mente lo que el ejercicio es al cuerpo.",
    author: "Joseph Addison",
  },
  {
    text: "Un libro debe ser el hacha que rompa el mar helado dentro de nosotros.",
    author: "Franz Kafka",
  },
  {
    text: "No hay amigo tan leal como un libro.",
    author: "Ernest Hemingway",
  },
  {
    text: "Quien lee mucho y anda mucho, ve mucho y sabe mucho.",
    author: "Miguel de Cervantes",
  },
  {
    text: "Los libros son las abejas que llevan el polen de una inteligencia a otra.",
    author: "James Russell Lowell",
  },
  {
    text: "Leer nos da un lugar al que ir cuando tenemos que quedarnos donde estamos.",
    author: "Mason Cooley",
  },
]

export default function QuoteCarousel() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [fadeState, setFadeState] = useState("fade-in")

  useEffect(() => {
    const interval = setInterval(() => {
      // Iniciar desvanecimiento
      setFadeState("fade-out")

      // Cambiar la cita después de que se complete la animación de desvanecimiento
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length)
        setFadeState("fade-in")
      }, 800) // Tiempo de la animación de desvanecimiento
    }, 10000) // Cambiar cada 10 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`quote-content ${fadeState}`}>
      <p>{quotes[currentQuoteIndex].text}</p>
      <span>- {quotes[currentQuoteIndex].author}</span>
    </div>
  )
}
