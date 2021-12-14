import { useSelector } from "react-redux";
import Profile from "./Profile/Profile";
import History from "./History/History";
import Options from "./AdminPanel/Options/Options";
import "../App.css";
import PollBtn from "./Poll/PollBtn";
const SideOptions = () => {
	const { twitchUserData, admin } = useSelector((state) => state.player);

	return (
		<div className="sideOptions">
			{twitchUserData && <Profile />}
			<History />
			{admin && <PollBtn />}
			{admin && <Options />}
		</div>
	);
};

export default SideOptions;
