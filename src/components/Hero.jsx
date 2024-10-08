import React from 'react'
import { setGlobalState } from '../store'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="h-[89vh]">
      <main className="flex flex-col justify-center items-center h-full">
        <h2 className="text-4xl">
          Welcome to Play2<span className="text-blue-700">Earn</span>, Where Fun
          Meets Fortune!
        </h2>
        <p className="text-center my-4 ">
        Get Ready To Unleash Your Inner Hero And Make Gaming Pay!
        </p>
        <div className="flex space-x-3 my-3">
          <button
            onClick={() => setGlobalState('createModal', 'scale-100')}
            className="bg-blue-700 border-[1px] text-white py-3 px-5 duration-200 transition-all  hover:bg-blue-600"
          >
            Create Game
          </button>
          <Link
            to="/mygames"
            className="border-[1px] border-blue-700 text-blue-700 py-3 px-5 duration-200 transition-all hover:bg-blue-700 hover:text-white"
          >
            My Games
          </Link>
        </div>
      </main>
    </section>
  )
}

export default Hero
