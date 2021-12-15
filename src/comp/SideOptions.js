import { useSelector } from "react-redux";
import Profile from "./Profile/Profile";
import History from "./History/History";
import Options from "./AdminPanel/Options/Options";
import "../App.css";
import PollBtn from "./Poll/PollBtn";
import { makeStyles, Box } from "@material-ui/core";

const useStyles = makeStyles({
	siteOptions: {
		display: "flex",
		flexDirection: "row-reverse",
		gap: "10px",
		marginRight: "10px",
	},
});

const SideOptions = () => {
	const { twitchUserData, admin } = useSelector((state) => state.player);

	const classes = useStyles();

	return (
		<Box className={classes.siteOptions}>
			{twitchUserData && <Profile />}
			<History />
			{admin && <PollBtn />}
			{admin && <Options />}
		</Box>
	);
};

export default SideOptions;
