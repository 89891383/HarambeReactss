import React from "react";
import {  useState } from "react";
import "./Profile.css";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import { makeStyles } from "@material-ui/core";
import { CSSTransition } from "react-transition-group";
import AccountInfo from "./AccountInfo";

const useStyles = makeStyles({
	profileIcon: {
		color: "white",
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
			onClick={()=> setIsHover(prev => !prev)}

		>
			<AccountBoxIcon className={classes.profileIcon} />

			<CSSTransition
				unmountOnExit
				classNames="transition"
				in={isHover}
				timeout={300}
			>

				<AccountInfo/>
		
			</CSSTransition>
		</div>
	);
};

export default Profile;
