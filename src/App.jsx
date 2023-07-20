import Home from "./pages/Home"
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </div>
  )
}

export default App