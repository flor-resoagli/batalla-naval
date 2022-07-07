import React, {useEffect, useState} from 'react';
import "./App.css";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import TitlePage from "./pages/title/TitlePage";
import ChatPage from "./pages/chat/ChatPage";
import HomePage from "./pages/home/HomePage";
import GamePage from "./pages/game/GamePage";
import NewGamePage from "./pages/newGame/newGamePage";
import WaitingRoomPage from "./pages/waitingRoom/WaitingRoomPage";
import {VolumeMute, VolumeOff} from "@mui/icons-material";


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

    useEffect(() => {
        const bg: HTMLMediaElement | null = document.querySelector('.audio')

        if(bg) {
            bg.play()
            bg.addEventListener('timeupdate', function (){
                if (bg.currentTime >= 2*60+30) {
                    bg.currentTime = 0;
                    bg.play()
                }
            }, false);
        }
    }, [])

    const handleMute = () => {
        const bg: HTMLMediaElement | null = document.querySelector('.audio')

        if(bg) {
            bg.muted = !bg.muted
        }
    }

    return (
      <div className={'background'}>
          {/*<audio src={bgMusic} autoPlay />*/}
          {/*<img src={Background} className={'background-image'} alt={'battleship'}/>*/}
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

                  </Routes>

                    <button className={'mute-button'} onClick={handleMute}> Sound </button>
                    <audio autoPlay className={'audio'}>
                        <source src={"https://www.fesliyanstudios.com/musicfiles/2019-12-09_-_Retro_Forest_-_David_Fesliyan/2019-12-09_-_Retro_Forest_-_David_Fesliyan.mp3"} type={"audio/mpeg"}/>
                    </audio>
                </div>
            </Router>

      </div>
  );
}



export default App;
