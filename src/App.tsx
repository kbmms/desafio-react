import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';


import Home from './pages/Home'
import Single from './pages/Single'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/:title/:imdbID" Component={Single} />
      </Routes>
    </Router>
  )
}

export default App
