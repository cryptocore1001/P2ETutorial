import React from 'react'
import { Link } from 'react-router-dom'
import { connectWallet } from '../services/blockchain'
import { truncate, useGlobalState } from '../store'

const Header = () => {
  const [connectedAccount] = useGlobalState('connectedAccount')

  return (
    <header className="bg-white shadow-sm shadow-gray-300 p-2">
      <main className="w-11/12 mx-auto p-2 flex justify-between items-center flex-wrap">
        <Link to={'/'} className="text-2xl mb-2">
          Play2<span className="text-blue-700">Earn</span>
        </Link>
        <div className="flex justify-end items-center space-x-2 md:space-x-4 mt-2 md:mt-0">
          <Link to={'/mygames'} className="text-md">
            My Games
          </Link>
          <Link to={'/invitations'} className="text-md">
            Invitations
          </Link>
          {connectedAccount ? (
              <button className="bg-blue-700 text-white py-2 px-5 rounded-full hover:bg-blue-600 duration-200 transition-all">
                {truncate(connectedAccount,4,4,11)}
              </button>
            ) : (
              <button className="bg-blue-700 text-white py-2 px-5 rounded-full hover:bg-blue-600 duration-200 transition-all"
              onClick={connectWallet}>
                Connect Wallet
              </button>
            )}
        </div>
      </main>
    </header>
  );
}

export default Header
