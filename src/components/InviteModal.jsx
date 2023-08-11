import React from 'react'
import { FaTimes } from 'react-icons/fa'
import { setGlobalState, useGlobalState } from '../store'

const InviteModal = () => {
  const [inviteModal] = useGlobalState('inviteModal')

  const closeModal = () => {
    setGlobalState('inviteModal', 'scale-0')
  }
  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${inviteModal}`}
    >
      <div className="bg-white text-black shadow-lg shadow-blue-500 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Invite Player</p>
            <button
              onClick={closeModal}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>

          <form className="flex flex-col justify-center items-start rounded-xl mt-5 mb-5">
            <div className="py-2 w-full border border-[#212D4A] rounded-full flex items-center px-4 mb-3 mt-2">
              <input
                placeholder="Player Account"
                className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm
                border-none focus:outline-none focus:ring-0 py-0"
                name="player"
                type="text"
                required
              />
            </div>

            <button
              type="submit"
              className="text-sm bg-blue-700 rounded-full w-[150px] h-[48px] text-white
              hover:bg-blue-500 transition-colors duration-300"
            >
              Send Invite
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default InviteModal
