import { useState, useEffect } from "react";
import "./GuessGame.css";
import Button from "react-bootstrap/Button";

import image1 from "../../../assets/images/credit.png";
import image2 from "../../../assets/images/goldfinch.jpg";
import image3 from "../../../assets/images/ondo.png";
import image4 from "../../../assets/images/orign.png";
import image5 from "../../../assets/images/OUSG.png";
import image6 from "../../../assets/images/pax.png";
import image7 from "../../../assets/images/pendle.jpg";
import image8 from "../../../assets/images/polymesh.png";
import image9 from "../../../assets/images/reserve-rights.jpg";
import image10 from "../../../assets/images/Xdc.jpg";

const IMAGE_PATHS = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
];
const NUM_CARDS = IMAGE_PATHS.length * 2;

function GuessGame() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIndices, setMatchedIndices] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    initializeCards();
  }, []);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setIsFlipping(true);

      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.path === secondCard.path) {
        setMatchedIndices((prev) => [...prev, firstIndex, secondIndex]);
      }

      setTimeout(() => {
        setFlippedIndices([]);
        setIsFlipping(false);
      }, 800);
    }
  }, [flippedIndices]);

  useEffect(() => {
    if (matchedIndices.length === NUM_CARDS) {
      setGameWon(true);
    }
  }, [matchedIndices]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameWon(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const initializeCards = () => {
    const shuffledCards = [...IMAGE_PATHS, ...IMAGE_PATHS]
      .map((path) => ({ path, id: Math.random() }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatchedIndices([]);
    setMoveCount(0);
    setGameWon(false);
    setTimeLeft(120);
  };

  const handleCardClick = (index) => {
    if (
      flippedIndices.length < 2 &&
      !flippedIndices.includes(index) &&
      !matchedIndices.includes(index) &&
      !isFlipping
    ) {
      setFlippedIndices((prev) => [...prev, index]);
      setMoveCount((prev) => prev + 1);
    }
  };

  const renderCard = (card, index) => {
    const isFlipped =
      flippedIndices.includes(index) || matchedIndices.includes(index);
    const isDisabled = matchedIndices.includes(index);

    return (
      <div
        key={index}
        className={`card ${isFlipped ? "flipped" : ""} ${
          isDisabled ? "disabled" : ""
        }`}
        onClick={() => !isDisabled && handleCardClick(index)}
      >
        <div className="card-inner">
          <div className="card-front"></div>
          <div className="card-back">
            <img src={card.path} alt={`Card ${index}`} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="main">
      <h1 className="game-name"> &#34;Memory Challenge&#34;</h1>
      <Button onClick={initializeCards}>New Game</Button>
      <div className="timer">
        Timer: {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, "0")}
      </div>
      {!gameWon && timeLeft > 0 ? (
        <>
          <div className="moves">Moves: {moveCount}</div>
          <div className="card-container">{cards.map(renderCard)}</div>
        </>
      ) : (
        <div className="congratulations">
          <h2>
            {gameWon ? "Congratulations! You've won!" : "Time's up! Game Over!"}
          </h2>
        </div>
      )}
    </div>
  );
}

export default GuessGame;
