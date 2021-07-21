
import { useSelector } from "react-redux";
import Button2 from "../Button";

const AccountInfo = () => {

	const handleLogout = () => {
		window.location.href = `/twitch/logout`;
	};

    const {twitchUserData } = useSelector(state=> state.player)

    return ( 
        <div className="accountInfo">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="img">
                <img src={twitchUserData.image} alt="twitchImage" srcSet="" />
            </div>
            {twitchUserData.login}
        </div>
        <Button2 onClick={handleLogout}>LOGOUT</Button2>

    </div>
     );
}
 
export default AccountInfo;