import {
	Box,
	Button,
	LinearProgress,
	makeStyles,
	Slide,
	Typography,
} from "@material-ui/core";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataContext } from "../../App";
import { setPoll, setPollTime } from "../../redux/pollSlice";

const useStyles = makeStyles({
	pollBox: {
		position: "absolute",
		top: "15px",
		left: "15px",
		zIndex: 5,
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
		overflow: "hidden",
	},
	textMessage: {
		display: "flex",
		width: "100%",
		justifyContent: "center",
	},
	btnBox: {
		display: "flex",
		gap: "5px",
	},
	progressBar: {
		height: "4px",
		width: "100%",
		position: "absolute",
		bottom: "0",
	},
});

const Vote = () => {
	const { isPoll, pollMessage, yesVotes, noVotes, time } = useSelector(
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

		socket.on("pollCountDown", (time) => {
			dispatch(setPollTime(time));
		});

		return () => {
			socket.off("pollAnswer");
			socket.off("pollCountDown");
		};
	}, [dispatch, socket]);

	const classes = useStyles();
	return (
		<Slide direction="down" in={isPoll} unmountOnExit duration={300}>
			<Box className={classes.pollBox}>
				<Box className={classes.textMessage}>
					<Typography noWrap>{pollMessage}</Typography>
				</Box>
				<Box className={classes.btnBox}>
					<Button onClick={() => handleVote(true)} variant="outlined">
						Yes ({yesVotes})
					</Button>
					<Button onClick={() => handleVote(false)} variant="outlined">
						No ({noVotes})
					</Button>
				</Box>
				<LinearProgress
					className={classes.progressBar}
					variant="determinate"
					value={(time / 60) * 100}
				/>
			</Box>
		</Slide>
	);
};

export default Vote;
