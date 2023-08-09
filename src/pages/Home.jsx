import {useRef} from 'react'
import { GameXplorer, Header, Hero } from '../components'
import ReCAPTCHA from "react-google-recaptcha";

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
      <div>
        <ReCAPTCHA
          ref={recaptcha}
          sitekey="6Lci3IwnAAAAAPajgxaoCfikFgyUgA3SUsecjoMc"
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default Home
