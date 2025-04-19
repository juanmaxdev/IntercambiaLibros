export function generateUniqueId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
  
  export function ensureBookIds(books){
    return books.map((book) => {
      if (!book.id) {
        return { ...book, id: generateUniqueId() }
      }
      return book
    })
  }
  