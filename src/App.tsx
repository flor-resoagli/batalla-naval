import React from 'react';
import "./App.css";
import Background from "./utils/images/img-bg.jpg";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import TitlePage from "./pages/title/TitlePage";
import ChatPage from "./pages/chat/ChatPage";

function App() {
  return (
      <div className={'background'}>
          <img src={Background} className={'background-image'} alt={'battleship'}/>
          <div className={'pages'}>
            <Router>
              <Routes>
                <Route path={"/"} element={<TitlePage />}/>
                <Route path={"/chat"} element={<ChatPage/>}/>
              </Routes>
            </Router>
          </div>
      </div>
  );
}

export default App;
