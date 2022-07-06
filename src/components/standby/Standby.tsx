import {CircularProgress} from "@mui/material";


function Standby() {

    return (
        <div className={"waiting-page"}>

            <h2 >Waiting for opponent...</h2>
            <div className={'loader-container'}>
                <CircularProgress color={'inherit'}/>
            </div>
        </div>
    )

}

export default Standby