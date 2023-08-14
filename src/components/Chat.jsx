import React, { useEffect, useState } from 'react'
import Identicon from 'react-identicons'
import { FaTimes } from 'react-icons/fa'
import { setGlobalState, truncate, useGlobalState } from '../store'
import { useParams } from 'react-router-dom'
import { getMessages, listenForMessage, sendMessage } from '../services/chat'

const Chat = () => {
  const [connectedAccount] = useGlobalState("connectedAccount");
  const [chatModal] = useGlobalState("chatModal");
  const [messages] = useGlobalState("messages");
  const [message, setMessage] = useState("");
  const { id } = useParams();

  const onSendMessage = async (e) => {
    e.preventDefault();
    if (!message) return;

    await sendMessage(`guid_${id}`, message).then((msg) => {
      setGlobalState("messages", (prevState) => [...prevState, msg]);
      console.log(msg);
      setMessage("");
      scrollToEnd();
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await getMessages(`guid_${id}`).then((msgs) => {
        setGlobalState('messages', msgs)
        scrollToEnd()
      })

      await listenForMessage(`guid_${id}`).then((msg) => {
        setGlobalState('messages', (prevState) => [...prevState, msg])
        scrollToEnd()
      })
    }

    fetchData()
  }, [])

  const scrollToEnd = () => {
    const elmnt = document.getElementById("messages-container");
    elmnt.scrollTop = elmnt.scrollHeight;
  };

  const closeModal = () => {
    setGlobalState("chatModal", "scale-0");
    setMessage("");
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${chatModal}`}
    >
      <div className="bg-white text-black shadow-lg shadow-blue-500 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Chat</p>
            <button
              onClick={closeModal}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex flex-col">
            <div
              id="messages-container"
              className="flex flex-col justify-center items-start rounded-xl my-5 pt-5 max-h-[20rem] overflow-y-auto"
            >
              {messages.length < 1 && <p>No Chat yet...</p>}
              {messages.map((msg, i) => (
                <Message
                  text={msg.text}
                  owner={msg.sender.uid}
                  time={Number(msg.sentAt + "000")}
                  you={connectedAccount == msg.sender.uid}
                  key={i}
                />
              ))}
            </div>

            <form onSubmit={onSendMessage} className="h-[4rem] w-full mt-4">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="h-full w-full p-5 focus:outline-none focus:ring-0 rounded-md
              placeholder-gray-400 bg-transparent border border-gray-400"
                placeholder="Leave a message..."
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const Message = ({ text, time, owner, you }) => {
  return (
    <div className="flex justify-between items-end space-x-4 px-6 mb-4 w-full">
      <div className="flex justify-start items-center">
        <Identicon
          className="w-12 h-12 rounded-full object-cover mr-4 shadow-md bg-gray-400"
          string={owner}
          size={30}
        />

        <div>
          <h3 className="text-md font-bold">
            {you ? '@You' : truncate(owner, 4, 4, 11)}
          </h3>
          <p className="flex flex-col text-gray-500 text-xs font-semibold">
            {text}
          </p>
        </div>
      </div>

      <span className="text-xs">{new Date(time).toLocaleString()}</span>
    </div>
  )
}

export default Chat
