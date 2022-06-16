import React from 'react';
import "./App.css";
import Background from "./utils/images/img-bg.jpg";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import TitlePage from "./pages/title/TitlePage";
import ChatPage from "./pages/chat/ChatPage";
import HomePage from "./pages/home/HomePage";
import GamePage from "./pages/game/GamePage";
import NewGamePage from "./pages/newGame/newGamePage";
import WaitingRoomPage from "./pages/waitingRoom/WaitingRoomPage";
import WinnerPage from "./pages/WinnerPage/WinnerPage";
import LoserPage from "./pages/LoserPage/LoserPage";

function App() {

    class ProtectedRoute extends React.Component<{children: any }> {
        render() {
            let {children} = this.props;
            if (!sessionStorage.getItem("player")) {
                return <Navigate to={"/"} replace/>;
            }

            return children;
        }
    }

    return (
      <div className={'background'}>
          <img src={Background} className={'background-image'} alt={'battleship'}/>
            <Router>
                <div className={'pages'}>
                  <Routes>

                        <Route path={"/"} element={<TitlePage />}/>

                        <Route path={'/game'} element={<GamePage/>}/>

                        <Route path={"/home"} element={
                            <ProtectedRoute >
                                <HomePage/>
                            </ProtectedRoute>
                        }/>

                        <Route path={"/chat"} element={
                            <ProtectedRoute >
                                <ChatPage/>
                            </ProtectedRoute>
                        }/>

                      <Route path={'/newGame'} element={
                          <ProtectedRoute >
                              <NewGamePage/>
                          </ProtectedRoute>
                      }/>

                      <Route path={'/game/:gameID'} element={
                          <ProtectedRoute>
                              <GamePage />
                          </ProtectedRoute>
                      }/>

                      <Route path={'/waiting'} element={
                          <ProtectedRoute>
                              <WaitingRoomPage />
                          </ProtectedRoute>
                      }/>

                      <Route path={'/winner'} element={
                          <ProtectedRoute>
                              <WinnerPage />
                          </ProtectedRoute>
                      }/>

                      <Route path={'/loser'} element={
                          <ProtectedRoute>
                              <LoserPage />
                          </ProtectedRoute>
                      }/>

                  </Routes>
                </div>
            </Router>

      </div>
  );
}



export default App;
