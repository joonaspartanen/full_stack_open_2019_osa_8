import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommendations from './components/Recommendations'
import { gql } from 'apollo-boost'
import { useQuery, useMutation, useApolloClient } from 'react-apollo';

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
    author {
      name
    }
    published
    genres
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
    author {
      name
    }
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

const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`
const ALL_GENRES = gql`
{
  allGenres
}
`

const CURRENT_USER = gql`
{
  me {
    username
    favoriteGenre
  }
}`

const App = () => {

  const handleError = (error) => console.log(error)

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const client = useApolloClient()

  const [page, setPage] = useState('authors')
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const genres = useQuery(ALL_GENRES)
  const currentUser = useQuery(CURRENT_USER)
  const [token, setToken] = useState(null)
  const [addBook] = useMutation(ADD_BOOK, {
    onError: handleError,
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }, { query: ALL_GENRES}]
  })
  const [updateBirthYear] = useMutation(SET_BIRTHYEAR, {
    onError: handleError,
    refetchQueries: [{ query: ALL_AUTHORS }]
  })
  const [login] = useMutation(LOGIN, {
    onError: handleError
  })

  console.log('currentUser:', currentUser)

  useEffect(() => {
    const currentUserToken = window.localStorage.getItem('libraryapp-user-token')
    if (currentUserToken) {
      setToken(currentUserToken)
    }
  }, [])

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={() => setPage('recommendations')}>recommendations</button>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={logout}>logout</button>}
      </div>

      <Authors
        show={page === 'authors'}
        result={authors}
        updateBirthYear={updateBirthYear}
        token={token}
      />

      <Books
        show={page === 'books'}
        result={books}
        genresResult={genres}
      />

      <NewBook
        show={page === 'add'}
        addBook={addBook}
        setPage={setPage}
      />

      <Recommendations
        show={page === 'recommendations'}
        result={books}
        currentUserResult={currentUser}
      />

      <Login
        show={page === 'login'}
        login={login}
        setToken={(token) => setToken(token)}
        setPage={setPage}
      />

    </div>
  )
}

export default App