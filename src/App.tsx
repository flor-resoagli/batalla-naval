import React from 'react';
import "./App.css";
import Background from "./utils/images/background-img.png";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import TitlePage from "./pages/title/TitlePage";

function App() {
  return (
      <div className={'background'}>
          <img src={Background} className={'background-image'} alt={'battleship'}/>
          <div className={'pages'}>
            <Router>
              <Routes>
                <Route path={"/"} element={<TitlePage />}/>
              </Routes>
            </Router>
          </div>
      </div>
  );
}

export default App;
