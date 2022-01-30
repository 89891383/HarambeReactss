import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import React, { useCallback, useState } from "react";
import { Box, Fade, makeStyles, Slider } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { changeVolume } from "../../../redux/playerState";

const useStyles = makeStyles({
	box: {
		padding: "5px",
		borderRadius: "5px",
		display: "flex",
		transition: "300ms",
		width: "fit-content",
		cursor: "pointer",
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.3);",
		},
	},
	slider: {
		position: "absolute",
		width: "34px",
		transform: "translate(0px, -75% )",
		height: "100px",
	},
});

let beforeMute;

const Volume = () => {
	const { volume } = useSelector((state) => state.player);

	const dispatch = useDispatch();

	const [isSlider, setIsSlider] = useState(false);

	const classes = useStyles();

	const handleVolume = useCallback(
		(e, value) => {
			dispatch(changeVolume(value));
		},
		[dispatch]
	);

	const handleMute = useCallback(() => {
		if (volume) {
			beforeMute = volume;
			dispatch(changeVolume(0));
		} else {
			dispatch(changeVolume(beforeMute));
		}
	}, [dispatch, volume]);

	const toggleSlider = () => {
		setIsSlider((prev) => !prev);
	};

	return (
		<div
			className="volumeBar"
			onMouseEnter={toggleSlider}
			onMouseLeave={toggleSlider}
		>
			<Box onClick={handleMute} className={classes.box}>
				{volume ? <VolumeUpIcon /> : <VolumeOffIcon />}
			</Box>

			<Fade in={isSlider}>
				<Box className={classes.slider}>
					<Slider
						orientation="vertical"
						min={0}
						max={1}
						step={0.01}
						value={volume}
						onChange={handleVolume}
					/>
				</Box>
			</Fade>
		</div>
	);
};

export default Volume;
