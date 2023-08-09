import React from 'react'
import { Header, Hero } from '../components'
import CreateGame from '../components/CreateGame'

const Home = () => {
  const recaptcha = useRef(null)

  function onChange(value) {
    console.log("Captcha value:", value);
  }

  return (
    <div>
      <Header />
      <Hero />
      <CreateGame />
    </div>
  )
}

export default Home
