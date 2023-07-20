import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="shadow-sm p-2">
      <main className="w-11/12 mx-auto p-2 flex justify-between items-center ">
        <Link to={"/"} className="text-2xl">
          Play2<span className="text-blue-700">Earn</span>
        </Link>
        <div>
          <button className="bg-blue-700 text-white py-2 px-5 rounded-full hover:bg-blue-600 duration-200 transition-all">
            Connect Wallet
          </button>
        </div>
      </main>
    </header>
  );
}

export default Header
