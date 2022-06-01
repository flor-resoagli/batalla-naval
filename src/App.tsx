import React from 'react';
import "./App.css";
import Background from "./utils/images/img-bg.jpg";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import TitlePage from "./pages/title/TitlePage";
import ChatPage from "./pages/chat/ChatPage";
import HomePage from "./pages/home/HomePage";

function App() {

    class ProtectedRoute extends React.Component<{ path: any, children: any }> {
        render() {
            let {path, children} = this.props;
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
                        <Route path={"/home"} element={
                            <ProtectedRoute path={'/home'}>
                                <HomePage/>
                            </ProtectedRoute>
                        }/>
                        <Route path={"/chat"} element={
                            <ProtectedRoute path={'/chat'}>
                                <ChatPage/>
                            </ProtectedRoute>
                        }/>
                  </Routes>
                </div>
            </Router>

      </div>
  );
}



export default App;
