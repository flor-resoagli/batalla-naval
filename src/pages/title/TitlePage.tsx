
import "./TitlePage.css";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {userAPI} from "../../apis/userAPI";

function TitlePage() {

    function handleCallbackResponse(response: any) {
        //validate token and get user information
        handleLogIn(response.credential).then(r => {
            // console.log(r)
            navigate("/home")
        })
        // navigate("/home")
    }

    const handleLogIn = async (token: string) => {

        return userAPI.postUserToken(token).then((r) => {
            console.log(r)
            sessionStorage.setItem("player", JSON.stringify(r))
        })
    }


    //initialize google client and google button for log in
    useEffect(() => {
        // global google


        // @ts-ignore
        google.accounts.id.initialize({
            client_id: "1002439529785-176seou2o0icad73ijfohbeq4lgfeo4j.apps.googleusercontent.com",
            callback: handleCallbackResponse
        })

        // @ts-ignore
        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            {width: 100,shape: "pill"}
        )

        // @ts-ignore
        //google.accounts.id.prompt();

    }, [google]);

    const navigate = useNavigate();

return (
        <div className={'container'}>
            <div className={'title-container'}>
                <h1>Battleships</h1>
            </div>
            <div className={'button-container'} id={'signInDiv'}> Log in </div>
        </div>
    );

}

export default TitlePage;
