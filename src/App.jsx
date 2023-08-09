import GamePlay from "./pages/GamePlay"
import Home from "./pages/Home"
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/gameplay' element={<GamePlay/>}/>
      </Routes>
    </div>
  )
}

export default App