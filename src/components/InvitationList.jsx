import React from 'react'
import { toast } from 'react-toastify'
import { acceptInvitation, rejectInvitation } from '../services/blockchain'
import { Link } from 'react-router-dom'

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

  const handleRejection = async (invitation) => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await rejectInvitation(invitation.gameId)
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
        success: 'Invitation rejected successful 👌',
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
            <p
              className={`font-semibold ${
                invitation.responded && !invitation.accepted
                  ? 'line-through italic text-gray-600'
                  : 'text-gray-800'
              }`}
            >
              {invitation.accepted ? (
                <span>
                  "{invitation.title}" game is yours to play
                </span>
              ) : (
                <span>
                  You've been invited to the "{invitation.title}" game
                </span>
              )}
            </p>
          </div>

          {!invitation.responded && (
            <div className="space-x-4">
              <button
                onClick={() => handleAcceptance(invitation)}
                className="bg-blue-700 text-white py-2 px-5 rounded-full
              hover:bg-blue-600 duration-200 transition-all"
              >
                Accept
              </button>
              <button
                onClick={() => handleRejection(invitation)}
                className="bg-red-700 text-white py-2 px-5 rounded-full
              hover:bg-red-600 duration-200 transition-all"
              >
                Reject
              </button>
            </div>
          )}

          {invitation.accepted && (
            <Link
              to={'/gameplay/' + invitation.gameId}
              className="bg-blue-700 text-white py-2 px-5 rounded-full
            hover:bg-blue-600 duration-200 transition-all"
            >
              Play Game
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

export default InvitationList