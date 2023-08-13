import React from 'react'
<<<<<<< HEAD
import { truncate } from '../store'
import { acceptInvitation, rejectInvitation } from '../services/blockchain';
=======
import { toast } from 'react-toastify'
import { acceptInvitation, rejectInvitation } from '../services/blockchain'
import { Link } from 'react-router-dom'
>>>>>>> 2806dc2bd0bd541e183c02a0bcf10305f9ee020f

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
<<<<<<< HEAD
      {invitations.length > 0 ? (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Invitations List
          </h2>
          {invitations.map((invitation, index) => (
            <div
              key={index}
              className="bg-white rounded-md shadow-md p-4 mb-4 flex justify-between items-center"
            >
              <div>
                <p className="text-gray-800 font-semibold">
                  {invitation.title}
                </p>
                <p className="text-gray-600 text-sm">
                  Account: {truncate(invitation.account, 4, 4, 11)}
                </p>
              </div>

              <div className="space-x-4">
                <button className="bg-blue-700 text-white py-2 px-5 rounded-full hover:bg-blue-600 duration-200 transition-all">
                  Accept
                </button>
                <button className="bg-red-700 text-white py-2 px-5 rounded-full hover:bg-red-600 duration-200 transition-all">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <h4 className="text-lg font-semibold text-black">No invitations yet</h4>
      )}
=======
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
>>>>>>> 2806dc2bd0bd541e183c02a0bcf10305f9ee020f
    </div>
  );
}

export default InvitationList
