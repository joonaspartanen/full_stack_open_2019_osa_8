import React from 'react'

const Recommendations = ({ show, result, currentUserResult }) => {

  const books = result.data.allBooks
  const currentUser = currentUserResult.data.me

  if (!show) {
    return null
  }

  if (result.loading || currentUserResult.loading) {
    return <div>Loading...</div>
  }


  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>Loading...</div>
  }

  const filteredBooks = books.filter(b => b.genres.includes(currentUser.favoriteGenre))

  return (
    <div>
      <h2>Recommendations</h2>
      <p>books in your favorite genre <strong>{currentUser.favoriteGenre}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {filteredBooks.map(b =>
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations