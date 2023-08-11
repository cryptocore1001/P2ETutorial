import { Routes, Route } from 'react-router-dom'
import GamePlay from './pages/GamePlay'
import Home from './pages/Home'
import MyGames from './pages/MyGames'
import Invitations from './pages/Invitations'
import { ToastContainer } from 'react-toastify'
import { useEffect } from 'react'
import { checkAuthState } from './services/chat'
import { isWalletConnected } from './services/blockchain'

const App = () => {
  useEffect(() => {
    isWalletConnected()
    // const fetchData = async () => {
    //   await checkAuthState()
    // }

    // fetchData()
  }, [])

  return (
    <div className="bg-gray-100 min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gameplay/:id" element={<GamePlay />} />
        <Route path="/mygames" element={<MyGames />} />
        <Route path="/invitations" element={<Invitations />} />
      </Routes>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}

export default App
