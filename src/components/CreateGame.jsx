import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { setGlobalState, useGlobalState } from '../store'

const CreateGame = () => {
  const [createModal] = useGlobalState('createModal')

  const [game, setGame] = useState({
    title: '',
    participants: '',
    winners: '',
    challenges: '',
    starts: '',
    ends: '',
    description: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setGame((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const closeModal = () => {
    setGlobalState('createModal', 'scale-0')
    setGame({
      title: '',
      participants: '',
      winners: '',
      challenges: '',
      starts: '',
      ends: '',
      description: '',
    })
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${createModal}`}
    >
      <div className="bg-white text-black shadow-lg shadow-blue-500 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Create Game</p>
            <button
              onClick={closeModal}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>

          <form className="flex flex-col justify-center items-start rounded-xl mt-5 mb-5">
            <label className="text-[12px]">Title</label>
            <div className="py-4 w-full border border-[#212D4A] rounded-full flex items-center px-4 mb-3 mt-2">
              <input
                placeholder="Title"
                className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm"
                name="title"
                value={game.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center w-full space-x-2 my-3">
              <div className='w-full'>
                <label className="text-[12px]">Participants</label>
                <div className="py-4 w-full border border-[#212D4A] rounded-full flex items-center px-4">
                  <input
                    placeholder="E.g 9"
                    className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm"
                    name="participants"
                    value={game.participants}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className='w-full'>
                <label className="text-[12px]">Number of Winners</label>
                <div className="py-4 w-full border border-[#212D4A] rounded-full flex items-center px-4">
                  <input
                    placeholder="E.g 2"
                    className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm"
                    name="winners"
                    value={game.winners}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className='w-full'>
                <label className="text-[12px]">Number of challenges</label>
                <div className="py-4 w-full border border-[#212D4A] rounded-full flex items-center px-4">
                  <input
                    placeholder="E.g 2"
                    className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm"
                    name="challenges"
                    value={game.winners}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <label className="text-[12px]">Starts On</label>
            <div className="py-4 w-full border border-[#212D4A] rounded-full flex items-center px-4 mb-3 mt-2">
              <input
                placeholder="Start Date"
                className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm"
                name="winners"
                value={game.starts}
                onChange={handleChange}
                required
              />
            </div>
            <label className="text-[12px]">Ends On</label>
            <div className="py-4 w-full border border-[#212D4A] rounded-full flex items-center px-4 mb-3 mt-2">
              <input
                placeholder="End Date"
                className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm"
                name="winners"
                value={game.ends}
                onChange={handleChange}
                required
              />
            </div>

            <label className="text-[12px]">Description</label>

            <textarea
              placeholder="What is this game about?"
              className="h-[80px] w-full bg-transparent border border-[#212D4A] rounded-xl py-3 px-3
              focus:outline-none focus:ring-0 resize-none
              placeholder-[#3D3857] text-sm"
              name="description"
              value={game.description}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="text-sm bg-blue-700 rounded-full w-[150px] h-[48px] text-white
              mt-5 hover:bg-blue-500 transition-colors duration-300"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateGame
