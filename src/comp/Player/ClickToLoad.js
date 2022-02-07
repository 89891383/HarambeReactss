import { useDispatch } from "react-redux";
import { loadPlayer } from "../../redux/playerState";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { Box, Container, makeStyles, Typography } from "@material-ui/core";
import { sharedStyles } from "../../shared/styles";

const useStyles = makeStyles({
	playIcon: {
		fontSize: "150px",
		"@media(max-width:600px)": {
			fontSize: "80px",
		},
	},
	box: {
		...sharedStyles.box,
		width: "fit-content",
		justifyContent: "center",
		alignItems: "center",
		fontWeight: "700",
		zIndex: 2,
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.3);",
		},
	},
	container: {
		backgroundColor: "black",
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		gap: "10px",
		padding: "25px",
	},
});

const ClickToLoad = () => {
	const classes = useStyles();

	const dispatch = useDispatch();

	const handleClick = () => {
		dispatch(loadPlayer());
	};

	return (
		<Container className={classes.container}>
			<Box className={classes.box} onClick={handleClick}>
				<PlayArrowIcon className={classes.playIcon} />
			</Box>
			<Typography variant="h4">Click to start</Typography>
		</Container>
	);
};

export default ClickToLoad;
