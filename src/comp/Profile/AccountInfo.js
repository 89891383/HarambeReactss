import { Avatar, Box, makeStyles, Typography } from "@material-ui/core";
import { useEffect, useRef } from "react";
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
	accountInfo: {
		position: "absolute",
		color: "white",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		gap: "10px",
		padding: "10px 10px",
		borderRadius: "5px",
		backgroundColor: "#161616",
		width: "fit-content",
		transform: "translate(-40%, -132%)",
		boxShadow: "0 0 5px black",
	},
});

const AccountInfo = () => {
	const classes = useStyles();

	const handleLogout = () => {
		window.location.href = `/twitch/logout`;
	};

	const accountRef = useRef(null);

	useEffect(() => {
		const size = accountRef.current.getBoundingClientRect();
		const pageWidth = window.innerWidth;
		const rightBorder = size.x + size.width;
		if (rightBorder > pageWidth) {
			accountRef.current.style.left = `100%`;
			accountRef.current.style.transform = `translate(-102%, -132%)`;
		}
	}, [accountRef]);

	const { twitchUserData } = useSelector((state) => state.player);
	const { image, login } = twitchUserData;

	return (
		<Box className={classes.accountInfo} ref={accountRef}>
			<Box className={classes.box}>
				<Avatar className={classes.avatar} src={image} />
				<Typography variant="body1">{login}</Typography>
			</Box>
			<Button2 onClick={handleLogout}>LOGOUT</Button2>
		</Box>
	);
};

export default AccountInfo;
