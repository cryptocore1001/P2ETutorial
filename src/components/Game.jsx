import { EmojtCha } from "emojtcha-react";
import { useState, useEffect } from "react";

export default function Game() {
  const numEmojtChas = 5;

  const [validationStates, setValidationStates] = useState(
    Array(numEmojtChas).fill(false)
  );
  const [revealedIndex, setRevealedIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false);

  const handleSelect = (index, isSelected) => {
    const newValidationStates = [...validationStates];
    newValidationStates[index] = isSelected;
    setValidationStates(newValidationStates);

    if (isSelected && revealedIndex < numEmojtChas - 1) {
      setRevealedIndex(revealedIndex + 1);
    } else if (isSelected && revealedIndex === numEmojtChas - 1) {
      setEndTime(new Date());
    }
  };

  const allCaptchasPassed = validationStates.every((state) => state);

  useEffect(() => {
    if (revealedIndex === 0 && timerStarted) {
      setStartTime(new Date());
    }
  }, [revealedIndex, timerStarted]);

  const calculateElapsedTime = () => {
    if (startTime && endTime) {
      const elapsedMilliseconds = endTime - startTime;
      const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
      return elapsedSeconds;
    }
    return 0;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      {validationStates.map((isValidationPassed, index) => (
        <div
          key={index}
          className={`${
            index === revealedIndex ? "block" : "hidden"
          } p-4 border rounded shadow bg-white`}
        >
          <h1 className="text-xl font-semibold text-center mb-2">
            EmojtCha {isValidationPassed ? "passed" : "not passed"}
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
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 my-4"
          onClick={() => setTimerStarted(true)}
        >
          Start Game
        </button>
      )}

      {allCaptchasPassed && (
        <div className="mt-4 p-4 border rounded shadow bg-white">
          <p className="text-lg text-center mb-2">
            Time taken: {calculateElapsedTime()} seconds
          </p>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 mt-2 w-full"
            onClick={() => console.log("Submit clicked!")}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
