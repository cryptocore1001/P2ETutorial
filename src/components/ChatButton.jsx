import React from 'react'
import { MdOutlineChat } from 'react-icons/md'
import { FiLogIn } from 'react-icons/fi'
import { HiLogin } from 'react-icons/hi'
import { FiUsers } from 'react-icons/fi'
import { AiFillLock } from 'react-icons/ai'
import { Menu } from '@headlessui/react'
import { toast } from 'react-toastify'
import {
  logOutWithCometChat,
  loginWithCometChat,
  signUpWithCometChat,
} from '../services/chat'
import { setGlobalState, useGlobalState } from '../store'

const ChatButton = () => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [currentUser] = useGlobalState('currentUser')

  const handleSignUp = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await signUpWithCometChat(connectedAccount)
          .then((user) => resolve(user))
          .catch((error) => {
            alert(JSON.stringify(error))
            reject(error)
          })
      }),
      {
        pending: 'Signning up...',
        success: 'Signed up successfully, please login 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const handleLogin = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await loginWithCometChat(connectedAccount)
          .then((user) => {
            setGlobalState('currentUser', user)
            resolve(user)
          })
          .catch((error) => {
            alert(JSON.stringify(error))
            reject(error)
          })
      }),
      {
        pending: 'Logging...',
        success: 'Logged in successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const handleLogout = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await logOutWithCometChat()
          .then(() => {
            setGlobalState('currentUser', null)
            resolve()
          })
          .catch((error) => {
            alert(JSON.stringify(error))
            reject(error)
          })
      }),
      {
        pending: 'Leaving...',
        success: 'Logged out successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <Menu className="relative" as="div">
      <Menu.Button
        className="bg-white text-blue-700 py-2 px-4 rounded flex justify-start items-center space-x-1
      hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md shadow-black"
        as="button"
      >
        <MdOutlineChat size={20} /> <span>Chat</span>
      </Menu.Button>

      <Menu.Items
        className="absolute right-0 bottom-14 mt-2 w-56 origin-top-right
          divide-y divide-gray-100 rounded-md bg-white shadow-lg shadow-black
          ing-1 ring-black ring-opacity-5 focus:outline-none"
      >
        {!currentUser ? (
          <>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`flex justify-start items-center space-x-1 ${
                    active ? 'bg-gray-200 text-black' : 'text-blue-500'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={handleSignUp}
                >
                  <AiFillLock size={17} />
                  <span>Sign Up</span>
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`flex justify-start items-center space-x-1 ${
                    active ? 'bg-gray-200 text-black' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={handleLogin}
                >
                  <FiLogIn size={17} />
                  <span>Login</span>
                </button>
              )}
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`flex justify-start items-center space-x-1 ${
                    active ? 'bg-gray-200 text-black' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={() => setGlobalState('chatModal', 'scale-100')}
                >
                  <FiUsers size={17} />
                  <span>Recent Chats</span>
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`flex justify-start items-center space-x-1 ${
                    active ? 'bg-gray-200 text-black' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={handleLogout}
                >
                  <HiLogin size={17} />
                  <span>Logout</span>
                </button>
              )}
            </Menu.Item>
          </>
        )}
      </Menu.Items>
    </Menu>
  )
}

export default ChatButton
