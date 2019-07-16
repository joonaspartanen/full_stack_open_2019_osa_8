import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommendations from './components/Recommendations'
import { gql } from 'apollo-boost'
import { useQuery, useMutation, useSubscription, useApolloClient } from '@apollo/react-hooks'

const BOOK_DETAILS = gql`
fragment BookDetails on Book {
  title
  published
  genres
  author {
    name
  }
}
`

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
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

const ADD_BOOK = gql`
mutation addBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
  addBook(
    title: $title,
    published: $published,
    author: $author,
    genres: $genres
  ) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

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
}
`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
${BOOK_DETAILS}
`

const App = () => {

  const client = useApolloClient()

  const [page, setPage] = useState('authors')
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const genres = useQuery(ALL_GENRES)
  const currentUser = useQuery(CURRENT_USER)
  const [token, setToken] = useState(null)
  console.log('Current user: ', currentUser)

  const handleError = (error) => console.log(error)

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('books')
  }

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map(b => b.title).includes(object.title)
    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      dataInStore.allBooks.push(addedBook)
      client.writeQuery({
        query: ALL_BOOKS,
        data: dataInStore
      })
    }
  }

  const [addBook] = useMutation(ADD_BOOK, {
    onError: handleError,
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }, { query: ALL_GENRES }]
  })

  const [updateBirthYear] = useMutation(SET_BIRTHYEAR, {
    onError: handleError,
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const [login] = useMutation(LOGIN, {
    onError: handleError,
    refetchQueries: [{ query: CURRENT_USER }],
    fetchPolicy: 'no-cache'
  })

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(
        `The book ${subscriptionData.data.bookAdded.title} by ${subscriptionData.data.bookAdded.author.name} was added to the library.`
      )
      updateCacheWith(addedBook)
    }
  })

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