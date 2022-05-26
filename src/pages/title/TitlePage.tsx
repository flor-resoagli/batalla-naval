
import "./TitlePage.css";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

function TitlePage() {

    function handleCallbackResponse(response: any) {
        console.log(response.credentials);
        navigate("/chat")
    }

    //initialize google client and google button for log in
    useEffect(() => {
        /* global google */
        // @ts-ignore

        google.accounts.id.initialize({
            client_id: "471985862015-4v5saftm1b6vqn2j8s2u1lljc34o227c.apps.googleusercontent.com",
            callback: handleCallbackResponse
        })

        // @ts-ignore
        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            {width: 100,shape: "pill"}
        )

        // @ts-ignore
        //google.accounts.id.prompt();

    }, []);

    const navigate = useNavigate();

return (
        <div className={'container'}>
            <div className={'title-container'}>
                <h1 >Batalla Naval</h1>
            </div>
            <div className={'button-container'} id={'signInDiv'}> Log in </div>
        </div>
    );

/**
 return (
 <div>
 <div className={'title-container'}>
 <h1>Batalla Naval</h1>
 </div>
 <div className={'button-container'}>
 <button className={'login'}>Log In</button>
 </div>
 </div>
 );
 */
}

export default TitlePage;