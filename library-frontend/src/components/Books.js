import React, { useState } from 'react'

const Books = ({ result, show, genresResult }) => {

  const [filter, setFilter] = useState('')

  if (!show) {
    return null
  }

  if (result.loading || genresResult.loading) {
    return <div>Loading...</div>
  }

  const genres = genresResult.data.allGenres

  const filteredBooks = filter.length === 0
    ? result.data.allBooks
    : result.data.allBooks.filter(b => b.genres.includes(filter))

  return (
    <div>
      <h2>Books</h2>
      {filter.length !== 0 && <p>in genre <strong>{filter}</strong></p>}
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
      <h2>Genres</h2>
      <select onChange={({ target }) => {
        console.log(target.value)
        setFilter(target.value)
      }}
      >
        <option value=''>All</option>
        {genres.map(g =>
          <option key={g} value={g}>
            {g}
          </option>
        )}
      </select>
    </div>
  )
}

export default Books