import { useState, useEffect, useRef } from "react";
import "./SchulteTable.css";
import { RxExit } from "react-icons/rx";
import Button from "react-bootstrap/Button";
import { NavLink } from "react-router-dom";
import { FaHistory } from "react-icons/fa";
import { IoHomeSharp } from "react-icons/io5";

const LEVELS = [
  { size: 3, time: 20, cellWidth: 90, cellHeight: 85 },
  { size: 4, time: 60, cellWidth: 68, cellHeight: 70 },
  { size: 5, time: 80, cellWidth: 53, cellHeight: 53 },
  { size: 6, time: 120, cellWidth: 43, cellHeight: 40 },
];

const generateNumbers = (size) => {
  const numbers = Array.from({ length: size * size }, (_, i) => i + 1);
  return shuffleArray(numbers);
};

const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const SchulteTable = () => {
  const [level, setLevel] = useState(0);
  const [size, setSize] = useState(LEVELS[0].size);
  const [time, setTime] = useState(LEVELS[0].time);
  const [cellWidth, setCellWidth] = useState(LEVELS[0].cellWidth);
  const [cellHeight, setCellHeight] = useState(LEVELS[0].cellHeight);
  const [numbers, setNumbers] = useState(generateNumbers(LEVELS[0].size));
  const [expectedNumber, setExpectedNumber] = useState(1);
  const [points, setPoints] = useState(0);
  const [clickedNumbers, setClickedNumbers] = useState(new Set());
  const [isGameOver, setIsGameOver] = useState(false);
  const [sessionResult, setSessionResult] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const reverseTimerRef = useRef(null);

  useEffect(() => {
    if (time > 0 && !isGameOver && isGameStarted) {
      reverseTimerRef.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(reverseTimerRef.current);
    } else if (time === 0) {
      handleFailure();
    }
  }, [time, isGameOver, isGameStarted]);

  useEffect(() => {
    if (sessionResult !== null) {
      updateHistory();
    }
  }, [sessionResult]);

  const handleClick = (number) => {
    if (number === expectedNumber) {
      setClickedNumbers((prev) => new Set(prev).add(number));
      setNumbers((prevNumbers) => shuffleArray(prevNumbers));
      setExpectedNumber(expectedNumber + 1);

      if (expectedNumber === size * size) {
        handleSuccess();
      }
    }
  };

  const handleSuccess = () => {
    setPoints((prevPoints) => prevPoints + 10);

    if (level < LEVELS.length - 1) {
      const nextLevel = LEVELS[level + 1];
      setLevel((prevLevel) => prevLevel + 1);
      setSize(nextLevel.size);
      setTime(nextLevel.time);
      setCellWidth(nextLevel.cellWidth);
      setCellHeight(nextLevel.cellHeight);
      setNumbers(generateNumbers(nextLevel.size));
      setExpectedNumber(1);
      setClickedNumbers(new Set());
    } else {
      setSessionResult("Win");
      setIsGameOver(true);
    }
  };

  const handleFailure = () => {
    setSessionResult("lose");
    setIsGameOver(true);
  };

  const updateHistory = () => {
    const newHistory = JSON.parse(localStorage.getItem("gameHistory")) || [];

    if (sessionResult !== null) {
      newHistory.push({
        level: level + 1,
        points: points,
        result: sessionResult,
        timestamp: new Date().toLocaleString(),
      });

      localStorage.setItem("gameHistory", JSON.stringify(newHistory));
    }
  };

  const restartGame = () => {
    setLevel(0);
    const firstLevel = LEVELS[0];
    setSize(firstLevel.size);
    setTime(firstLevel.time);
    setCellWidth(firstLevel.cellWidth);
    setCellHeight(firstLevel.cellHeight);
    setNumbers(generateNumbers(firstLevel.size));
    setExpectedNumber(1);
    setPoints(0);
    setClickedNumbers(new Set());
    setIsGameOver(false);
    setSessionResult(null);
    setIsGameStarted(false);
  };

  const startGame = () => {
    setIsGameStarted(true);
  };

  const endGame = () => {
    setSessionResult("lose");
    setIsGameOver(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div>
      {!isGameStarted ? (
        <div>
          <div className="navbar">
            <NavLink to="/" className="btns">
              <IoHomeSharp />
            </NavLink>
            <NavLink to="/history" className="btns">
              <FaHistory />
            </NavLink>
          </div>
          <div className="start-screen" onClick={startGame}>
            <h1>Schulte Table Game</h1>
            <div className="start"> Start Game</div>
          </div>
        </div>
      ) : (
        <div className="game-start">
          <div className="current-level">{`Level: ${level + 1}`}</div>

          {!isGameOver && (
            <>
              <div onClick={endGame} className="end-game-button">
                <RxExit />
              </div>

              <div className="points">Reward : {points}</div>

              <div className="reverse-timer">
                {`Timer : ${formatTime(time)}`}
              </div>
            </>
          )}

          <div>
            {isGameOver ? (
              <div>
                <div className="points">Reward : {points}</div>
                {sessionResult === "Win" ? (
                  <div className="next-number">Congratulations! You Win!</div>
                ) : (
                  <div className="next-number">Game Over! </div>
                )}
              </div>
            ) : (
              <div>
                <div className="next-number"> {expectedNumber}</div>
                <div className="symbol-find">Symbol to find</div>
              </div>
            )}
          </div>
          {isGameOver && (
            <div className="game-over">
              <Button onClick={restartGame}>Restart</Button>
            </div>
          )}
          {!isGameOver && (
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${size}, 1fr)`,
                width: `calc(${cellWidth}px * ${size} + ${(size - 1) * 5}px)`,
                height: `calc(${cellHeight}px * ${size} + ${(size - 1) * 5}px)`,
              }}
            >
              {numbers.map((number) => (
                <div
                  key={number}
                  className={`cell ${
                    clickedNumbers.has(number) ? "clicked" : ""
                  }`}
                  style={{
                    width: `${cellWidth}px`,
                    height: `${cellHeight}px`,
                  }}
                  onClick={() => handleClick(number)}
                >
                  {number}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchulteTable;
