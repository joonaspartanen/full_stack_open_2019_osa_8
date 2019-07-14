import React, { useState } from 'react'

const Authors = ({ result, show, updateBirthYear }) => {
  const [name, setName] = useState('')
  const [birthYear, setBirthYear] = useState('')

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>Loading...</div>
  }

  const handleBirthYearUpdate = async (e) => {
    e.preventDefault()
    const birthYearInt = parseInt(birthYear, 10)

    await updateBirthYear({
      variables: { name, setBornTo: birthYearInt }
    })

    setName('')
    setBirthYear('')
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>Set birth year</h2>
      <form onSubmit={handleBirthYearUpdate}>
        <div>
          <select onChange={({ target }) => setName(target.value)}>
            {authors.map(a =>
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            )}
          </select>
        </div>
        <div>
          Birth year
          <input
            type='number'
            value={birthYear}
            onChange={({ target }) => setBirthYear(target.value)}
          />
        </div>
        <button type='submit'>Set birth year</button>
      </form>
    </div>
  )
}

export default Authors