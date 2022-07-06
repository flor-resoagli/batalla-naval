import './Waiting.css'
import {CircularProgress, Snackbar} from "@mui/material";
import {useState} from "react";



function Waiting (props: {gameID: string}) {

    const [openSnackbar, setOpenSnackbar] = useState(false)
    const handleCopyToken = () => {
        navigator.clipboard.writeText(props.gameID).then(r => console.log(props.gameID))
        setOpenSnackbar(true)
        setTimeout(() => {
            setOpenSnackbar(false)
        }, 1000)
    }

    return (
        <div className={"waiting-page"}>
            <h1 className={'waiting-title'}>Waiting for game</h1>
            <div className={'loader-container'}>
                <CircularProgress color={'inherit'} />
            </div>
            <h3>Invite other players with code:</h3>
            <a onClick={handleCopyToken}>{props.gameID}</a>
            <Snackbar
                anchorOrigin={{ vertical:'bottom', horizontal:'center' }}
                open={openSnackbar}
                message="Copied to clipboard!"/>
        </div>
    )

}

export default Waiting