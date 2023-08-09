import {useRef} from 'react'
import { GameXplorer, Header, Hero } from '../components'

const Home = () => {
  const recaptcha = useRef(null)

  function onChange(value) {
    console.log("Captcha value:", value);
  }

  return (
    <div>
      <Header />
      <Hero />
      <GameXplorer />
    </div>
  );
}

export default Home
