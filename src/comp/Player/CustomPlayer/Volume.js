import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import React, { useCallback, useState } from "react";
import { Box, Fade, makeStyles, Slider } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { changeVolume } from "../../../redux/playerState";
import { sharedStyles } from "../../../shared/styles";

const useStyles = makeStyles({
	volumeBar: {
		display: "flex",
		gap: "10px",
		alignItems: "center",
		transition: "300ms width",
		position: "relative",
	},
	slider: {
		position: "absolute",
		width: "100%",
		left: "0",
		transform: "translate(0px, -75%)",
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
		<Box
			className={classes.volumeBar}
			onMouseEnter={toggleSlider}
			onMouseLeave={toggleSlider}
		>
			<Box onClick={handleMute} sx={sharedStyles.box}>
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
		</Box>
	);
};

export default Volume;
