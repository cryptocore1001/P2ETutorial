import React from 'react'
import { truncate } from '../store'
import { toast } from 'react-toastify'
import { acceptInvitation } from '../services/blockchain'

const InvitationList = ({ invitations }) => {
  const handleAcceptance = async (invitation) => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await acceptInvitation(invitation.gameId, invitation.stake)
          .then((tx) => {
            console.log(tx)
            resolve(tx)
          })
          .catch((err) => {
            reject(err)
          })
      }),
      {
        pending: 'Approve transaction...',
        success: 'Invitation accepted successful 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div className="w-3/5 mx-auto my-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Invitations List
      </h2>
      {invitations.map((invitation, i) => (
        <div
          key={i}
          className="bg-white rounded-md shadow-md p-4 mb-4 flex justify-between items-center"
        >
          <div>
            <p className="text-gray-800 font-semibold">
              You've been invited to the "{invitation.title}" game
            </p>
            <p className="text-gray-600 text-sm">
              Account: {truncate(invitation.account, 4, 4, 11)}
            </p>
          </div>

          <div className="space-x-4">
            <button
              onClick={() => handleAcceptance(invitation)}
              className="bg-blue-700 text-white py-2 px-5 rounded-full
            hover:bg-blue-600 duration-200 transition-all"
            >
              Accept
            </button>
            <button
              className="bg-red-700 text-white py-2 px-5 rounded-full
            hover:bg-red-600 duration-200 transition-all"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default InvitationList
