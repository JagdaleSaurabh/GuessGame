// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// import SchulteTable from "./Components/SchulteGame/SchulteTable/SchulteTable";
// import HistoryPage from "./Components/SchulteGame/History/HistoryPage";
import "./App.css";
import GuessGame from "./Components/GuessGame/GuessGame/GuessGame";

const App = () => {
  return (
    // <Router>
    //   <div className="app">
    //     <Routes>
    //       <Route path="/" element={<SchulteTable />} />
    //       <Route path="/history" element={<HistoryPage />} />
    //     </Routes>
    //   </div>
    // </Router>
    <GuessGame />
  );
};

export default App;
