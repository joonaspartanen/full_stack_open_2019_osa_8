import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from 'react-apollo';

const ALL_AUTHORS = gql`
{
  allAuthors {
    name
    born
    bookCount
  }
}
`

const ALL_BOOKS = gql`
{
  allBooks {
    title
    author
    published
  }
}
`

const ADD_BOOK = gql`
mutation addBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
  addBook(
    title: $title,
    published: $published,
    author: $author,
    genres: $genres
  ) {
    title
    author
  }
}`

const SET_BIRTHYEAR = gql`
mutation editAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
    born
  }
}
`

const App = () => {

  const handleError = (error) => console.log(error)

  const [page, setPage] = useState('authors')
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const [addBook] = useMutation(ADD_BOOK, {
    onError: handleError,
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }]
  })
  const [updateBirthYear] = useMutation(SET_BIRTHYEAR, {
    onError: handleError,
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors
        show={page === 'authors'}
        result={authors}
        updateBirthYear={updateBirthYear}
      />

      <Books
        show={page === 'books'}
        result={books}
      />

      <NewBook
        show={page === 'add'}
        addBook={addBook}
      />

    </div>
  )
}

export default App