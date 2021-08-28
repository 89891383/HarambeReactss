import React from "react";
import { useState } from "react";
import "./Profile.css";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import { Box, makeStyles } from "@material-ui/core";
import AccountInfo from "./AccountInfo";
import { Fade } from "@material-ui/core";

const useStyles = makeStyles({
	box: {
		padding: "5px",
		borderRadius: "5px",
		display: "flex",
		transition: "300ms",
		cursor: "pointer",
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.3)",
		},
	},
});

const Profile = () => {
	const classes = useStyles();
	const [isHover, setIsHover] = useState(false);

	return (
		<div
			className="profileIcon"
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			onClick={() => setIsHover((prev) => !prev)}
		>
			<Box className={classes.box}>
				<AccountBoxIcon />
			</Box>

			<Fade in={isHover} unmountOnExit>
				<div>
					<AccountInfo />
				</div>
			</Fade>
		</div>
	);
};

export default Profile;
