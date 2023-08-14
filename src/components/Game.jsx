import { EmojtCha } from 'emojtcha-react'
import { useState, useEffect } from 'react'
import ChatButton from './ChatButton'
import GameInfo from './GameInfo'
import { toast } from 'react-toastify'
import { recordScore } from '../services/blockchain'
import { useNavigate } from 'react-router-dom'

export default function Game({ game, isPlayed }) {
  const numEmojtChas = game.challenges
  const navigate = useNavigate()

  const [validationStates, setValidationStates] = useState(
    Array(numEmojtChas).fill(false)
  )
  const [revealedIndex, setRevealedIndex] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [timerStarted, setTimerStarted] = useState(false)

  const handleSelect = (index, isSelected) => {
    const newValidationStates = [...validationStates]
    newValidationStates[index] = isSelected
    setValidationStates(newValidationStates)

    if (isSelected && revealedIndex < numEmojtChas - 1) {
      setRevealedIndex(revealedIndex + 1)
    } else if (isSelected && revealedIndex === numEmojtChas - 1) {
      setEndTime(new Date())
    }
  }

  const resetGame = () => {
    setValidationStates(Array(numEmojtChas).fill(false))
    setRevealedIndex(0)
    setStartTime(null)
    setEndTime(null)
    setTimerStarted(false)
  }

  const allCaptchasPassed = validationStates.every((state) => state)

  useEffect(() => {
    if (revealedIndex === 0 && timerStarted) {
      setStartTime(new Date())
    }
  }, [revealedIndex, timerStarted])

  const calculateElapsedTime = () => {
    if (startTime && endTime) {
      const elapsedMilliseconds = endTime - startTime
      const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000)
      return elapsedSeconds
    }
    return 0
  }

  const submitScore = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await recordScore(game.id, calculateElapsedTime())
          .then((tx) => {
            console.log(tx)
            resolve(tx)
            navigate('/mygames')
          })
          .catch((err) => {
            reject(err)
          })
      }),
      {
        pending: 'Approve transaction...',
        success: 'Score submittion successful 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {timerStarted &&
        validationStates.map((isValidationPassed, index) => (
          <div
            key={index}
            className={`${
              index === revealedIndex ? 'block' : 'hidden'
            } p-4 border rounded shadow bg-white`}
          >
            <h1 className="text-xl font-semibold text-center mb-2">
              Emoji {isValidationPassed ? 'passed' : 'not passed'}
            </h1>
            <div className="flex justify-center items-center h-32">
              <EmojtCha
                drawCount={6}
                onSelect={(isSelected) => handleSelect(index, isSelected)}
              />
            </div>
          </div>
        ))}

      {!timerStarted && (
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-x-4 px-5">
          <GameInfo game={game} />
          <div className="flex justify-center items-center space-x-2">
            {Date.now() > game.startDate &&
              Date.now() < game.endDate &&
              game.acceptees >= game.numberOfWinners + 1 &&
              !isPlayed && (
                <button
                  className="bg-blue-700 text-white py-2 px-4 rounded
              hover:bg-blue-600 duration-200 transition-all shadow-md shadow-black"
                  onClick={() => setTimerStarted(true)}
                >
                  Play Game
                </button>
              )}

            <ChatButton gid={game?.id} />
          </div>
        </div>
      )}

      {allCaptchasPassed && (
        <div className="mt-4 p-4 border rounded shadow bg-white">
          {/* <p className="text-lg text-center mb-2">
            Time taken: {calculateElapsedTime()} seconds
          </p> */}
          <div className="flex justify-between items-center space-x-2">
            <button
              className="bg-green-500 text-white py-2 px-4 rounded
              hover:bg-green-700 mt-2 w-full shadow-md shadow-black"
              onClick={submitScore}
            >
              Submit
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded
              hover:bg-red-700 mt-2 w-full shadow-md shadow-black"
              onClick={resetGame}
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
