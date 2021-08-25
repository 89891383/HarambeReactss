import { Avatar, Box, makeStyles, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import Button2 from "../Button";

const useStyles = makeStyles({
	avatarImage: {
		width: "100px",
		minHeight: "50px",
		height: "auto",
	},
	avatar: {
		width: "50px",
		height: "auto",
	},
	box: {
		display: "flex",
		alignItems: "center",
		gap: "10px",
	},
});

const AccountInfo = () => {
	const classes = useStyles();

	const handleLogout = () => {
		window.location.href = `/twitch/logout`;
	};

	const { twitchUserData } = useSelector((state) => state.player);

	return (
		<div className="accountInfo">
			<Box className={classes.box}>
				<Avatar className={classes.avatar} src={twitchUserData.image} />
				<Typography variant="body1">{twitchUserData.login}</Typography>
			</Box>
			<Button2 onClick={handleLogout}>LOGOUT</Button2>
		</div>
	);
};

export default AccountInfo;
