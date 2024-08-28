import { NavLink } from "react-router-dom";
import "./HistoryPage.css";
import { useState, useEffect } from "react";
import { IoHomeSharp } from "react-icons/io5";
import { FaHistory } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("gameHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("gameHistory");
    setHistory([]);
  };

  return (
    <>
      <div className="navbar">
        <NavLink to="/" className="btns">
          <IoHomeSharp />
        </NavLink>
        <NavLink to="/history" className="btns">
          <FaHistory />
        </NavLink>
      </div>
      <div className="history-page">
        <div className="game-history">
          <h1>Result</h1>
          <button onClick={clearHistory} className="clear-history-button">
            <RiDeleteBinFill />
          </button>
        </div>
        <ul className="total-history">
          {history.length > 0 ? (
            history.map((entry, index) => (
              <li key={index}>
                {`Level ${entry.level}: ${entry.result} - Reward: ${entry.points} - Time: ${entry.timestamp}`}
              </li>
            ))
          ) : (
            <li>No Result</li>
          )}
        </ul>
      </div>
    </>
  );
};

export default HistoryPage;
