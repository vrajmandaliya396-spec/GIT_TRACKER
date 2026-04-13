import React, { useState, useEffect } from 'react'

const themes = [
  { name: 'slate', icon: '🔘', color: '#3b82f6' },
  { name: 'dark', icon: '🌙', color: '#1e293b' },
  { name: 'midnight', icon: '🌌', color: '#6366f1' },
  { name: 'cyberpunk', icon: '🤖', color: '#ff007f' },
  { name: 'emerald', icon: '🌿', color: '#10b981' },
]

const App = () => {
  const [username, setUsername] = useState('')
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'slate')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleSearch = async () => {
    if (!username) return;

    setLoading(true);
    setError(null);
    setUserData(null);

    try {
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
    <div className='min-h-screen flex flex-col items-center px-4 py-8 max-w-4xl mx-auto'>
      {/* Theme Controller */}
      <div className="glass-card flex gap-4 p-2 rounded-2xl mb-12 animate-in fade-in slide-in-from-top duration-700">
        {themes.map((t) => (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            className={`theme-btn ${theme === t.name ? 'ring-2 ring-[var(--primary)]' : ''}`}
            title={t.name}
          >
            <span className="text-xl">{t.icon}</span>
          </button>
        ))}
      </div>

      <header className="text-center mb-12 animate-in fade-in zoom-in duration-500">
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
          Git<span className="text-[var(--primary)]">Tracker</span>
        </h1>
        <p className="text-lg opacity-60">Discover the pulse of GitHub developers</p>
      </header>

      {/* Search Section */}
      <div className="w-full max-w-2xl flex flex-col md:flex-row gap-4 mb-16 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder='Enter GitHub username...'
            className='input-field w-full text-lg'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
            🔎
          </div>
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className='primary-btn'
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </span>
          ) : (
            'Generate Report'
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass-card mb-8 p-4 rounded-xl border-red-500/30 text-red-500 animate-in fade-in zoom-in">
          <span className="mr-2">⚠️</span> {error}
        </div>
      )}

      {/* Profile Result */}
      {userData && (
        <div className="glass-card w-full rounded-3xl p-8 flex flex-col md:flex-row gap-10 items-center md:items-start animate-in fade-in slide-in-from-bottom duration-1000">
          <div className="relative group">
            <div className="absolute -inset-1 bg-[var(--primary)] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src={userData.avatar_url} 
              alt={userData.login} 
              className="relative w-40 h-40 rounded-full object-cover border-4 border-[var(--glass)] shadow-2xl" 
            />
            <div className="absolute -bottom-2 -right-2 bg-[var(--primary)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              @{userData.login}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl font-bold mb-2">{userData.name || userData.login}</h2>
            <p className="text-lg opacity-70 mb-6 italic">"{userData.bio || 'This developer prefers to keep their bio a mystery.'}"</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div className="glass-card p-4 rounded-2xl flex flex-col items-center md:items-start">
                <span className="text-xs uppercase tracking-wider opacity-50 mb-1">Followers</span>
                <span className="text-2xl font-black">{userData.followers.toLocaleString()}</span>
              </div>
              <div className="glass-card p-4 rounded-2xl flex flex-col items-center md:items-start">
                <span className="text-xs uppercase tracking-wider opacity-50 mb-1">Following</span>
                <span className="text-2xl font-black">{userData.following.toLocaleString()}</span>
              </div>
              <div className="glass-card p-4 rounded-2xl flex flex-col items-center md:items-start">
                <span className="text-xs uppercase tracking-wider opacity-50 mb-1">Public Repos</span>
                <span className="text-2xl font-black">{userData.public_repos.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {userData.location && (
                <div className="glass-card px-4 py-2 rounded-full text-sm flex items-center gap-2">
                  📍 {userData.location}
                </div>
              )}
              {userData.company && (
                <div className="glass-card px-4 py-2 rounded-full text-sm flex items-center gap-2">
                  🏢 {userData.company}
                </div>
              )}
              {userData.blog && (
                <a 
                  href={userData.blog.startsWith('http') ? userData.blog : `https://${userData.blog}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass-card px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-[var(--primary)] hover:text-white transition-colors"
                >
                  🔗 Website
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
