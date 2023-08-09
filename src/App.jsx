import { Routes, Route } from 'react-router-dom'
import GamePlay from "./pages/GamePlay"
import Home from "./pages/Home"
import MyGames from "./pages/MyGames"

const App = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/gameplay/:id' element={<GamePlay/>}/>
        <Route path='/mygames' element={<MyGames/>}/>
      </Routes>
    </div>
  )
}

export default App