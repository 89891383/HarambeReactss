import { Box, Fade, makeStyles } from "@material-ui/core";
import TimerIcon from "@material-ui/icons/Timer";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../../../App";
import { useClickAway } from "react-use";
import { useSelector } from "react-redux";

const useStyles = makeStyles({
	box: {
		padding: "5px",
		borderRadius: "5px",
		display: "flex",
		transition: "300ms",
		cursor: "pointer",
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.3);",
		},
		"@media (max-width:600px)": {
			display: "none",
		},
	},
	playbackRate: {
		position: "relative",
	},
	playbackRateOptions: {
		position: "absolute",
		top: "0",
		color: "white",
		left: "50%",
		transform: "translate(-50%, -100%)",
		backgroundColor: "black",
		borderRadius: "5px",
		overflow: "hidden",
		boxShadow: "0 0 2px black",
	},
});

const PlaybackRate = () => {
	const { admin, playbackRate } = useSelector((state) => state.player);

	const { socket } = useContext(DataContext);

	const classes = useStyles();

	const chooseRef = useRef(null);

	const containerRef = useRef(null);

	const [isOpen, setIsOpen] = useState(false);

	useClickAway(containerRef, () => {
		setIsOpen(false);
	});

	const handlePlaybackRate = useCallback(
		(e) => {
			const chooseNumber = Number(e.target.textContent);

			if (!chooseNumber || !admin) return setIsOpen(false);
			setIsOpen(false);
			if (playbackRate === chooseNumber) return false;
			socket.emit("playbackRate", chooseNumber);
		},
		[admin, playbackRate, socket]
	);

	useEffect(() => {
		if (chooseRef.current) {
			[...chooseRef.current.children].forEach((item) => {
				if (Number(item.textContent) === playbackRate) {
					item.style.backgroundColor = "#101010";
				}
			});
		}
	}, [chooseRef, isOpen, playbackRate]);

	return (
		<Box className={classes.playbackRate} ref={containerRef}>
			<Box className={classes.box} onClick={() => setIsOpen((prev) => !prev)}>
				<TimerIcon />
			</Box>

			<Fade in={isOpen} unmountOnExit timeout={300}>
				<Box
					className={classes.playbackRateOptions}
					onClick={handlePlaybackRate}
					ref={chooseRef}
				>
					<Box className="playbackOption">2</Box>
					<Box className="playbackOption">1.5</Box>
					<Box className="playbackOption">1</Box>
					<Box className="playbackOption">0.5</Box>
				</Box>
			</Fade>
		</Box>
	);
};

export default PlaybackRate;
