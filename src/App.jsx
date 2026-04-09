import React, { useState } from 'react'

const App = () => {
  const [username, setUsername] = useState('')
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    if (!username) return;

    setLoading(true);
    setError(null);
    setUserData(null);

    try {
      // Example using GitHub API since this is a "Git Tracker"
      const response = await fetch(`https://api.github.com/users/${username}`)

      if (!response.ok) {
        throw new Error('User not found')
      }

      const data = await response.json()
      setUserData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-4 justify-center items-center h-screen'>
      <div className='gap-2 flex justify-center items-center'>
        <input
          type="text"
          placeholder='Enter your username'
          className='border border-gray-300 rounded-md p-2'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className='bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-blue-300'
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Result Display Area */}
      {error && <p className="text-red-500">{error}</p>}

      {userData && (
        <div className="border border-gray-200 p-4 rounded-md shadow-md flex flex-col items-center">
          <img src={userData.avatar_url} alt={userData.login} className="w-24 h-24 rounded-full mb-4" />
          <h2 className="text-xl font-bold">{userData.name || userData.login}</h2>
          <p className="text-gray-600">{userData.bio}</p>
          <div className="flex gap-4 mt-4">
            <span><strong>{userData.followers}</strong> Followers</span>
            <span><strong>{userData.following}</strong> Following</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
