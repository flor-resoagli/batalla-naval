import {CircularProgress} from "@mui/material";


function Loading()  {

    return (
        <div className={'loader-container'}>
            <CircularProgress color={'inherit'}/>
        </div>
    )

}

export default Loading