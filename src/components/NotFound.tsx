// NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {ArrowCircleLeft} from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import {CircularProgress} from "@mui/material";


function NotFound() {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/'); // Change this to your desired redirect path
    };

    return (
            <div className={"waiting-page"}>
                <div className={'loader-container'}>
                    <h1> 404 - Page Not Found </h1>
                    <p> Oops! The page you are looking for does not exist </p>
                    <div className={'back-btn'} onClick={handleRedirect}> Go Home </div>
                </div>
            </div>
        )
};

// const styles = {
//     heading: {
//         fontSize: '2rem',
//         marginBottom: '1rem',
//     },
//     message: {
//         marginBottom: '2rem',
//     }
// };

export default NotFound;
