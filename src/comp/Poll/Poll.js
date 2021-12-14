import { Box, Button, makeStyles, Slide, Typography } from "@material-ui/core";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataContext } from "../../App";
import { setPoll } from "../../redux/pollSlice";

const useStyles = makeStyles({
	pollBox: {
		position: "absolute",
		top: "15px",
		left: "15px",
		backgroundColor: "#327",
		padding: "15px",
		boxShadow: "0px 0px 10px black",
		color: "white",
		display: "flex",
		gap: "5px",
		flexDirection: "column",
		alignItems: "center",
		maxWidth: "92%",
		borderRadius: "5px",
	},
	textMessage: {
		display: "flex",
		width: "fit-content",
		minWidth: "100%",
		justifyContent: "center",
	},
	btnBox: {
		display: "flex",
		gap: "5px",
	},
});

const Vote = () => {
	const { isPoll, pollMessage, yesVotes, noVotes } = useSelector(
		(state) => state.vote
	);
	const { nickname } = useSelector((state) => state.player);

	const { socket } = useContext(DataContext);
	const dispatch = useDispatch();

	const handleVote = (answer) => {
		if (!isPoll || !nickname) return false;
		socket.emit("poll", { answer, nickname });
	};

	useEffect(() => {
		socket.on("pollAnswer", (poll) => {
			dispatch(setPoll(poll));
		});

		return () => {
			socket.off("pollAnswer");
		};
	}, [dispatch, socket]);

	const classes = useStyles();
	return (
		<Slide direction="down" in={isPoll} unmountOnExit duration={300}>
			<Box className={classes.pollBox}>
				<Box className={classes.textMessage}>
					<Typography>{pollMessage}</Typography>
				</Box>
				<Box className={classes.btnBox}>
					<Button onClick={() => handleVote(true)} variant="outlined">
						Yes ({yesVotes})
					</Button>
					<Button onClick={() => handleVote(false)} variant="outlined">
						No ({noVotes})
					</Button>
				</Box>
			</Box>
		</Slide>
	);
};

export default Vote;
