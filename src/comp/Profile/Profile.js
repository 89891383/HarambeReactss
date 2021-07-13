import React from "react";
import {  useState } from "react";
import "./Profile.css";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import { makeStyles } from "@material-ui/core";
import { CSSTransition } from "react-transition-group";
import Button2 from "../Button";
import { useSelector } from "react-redux";

const useStyles = makeStyles({
	profileIcon: {
		color: "white",
	},
});

const Profile = () => {
	const classes = useStyles();
	const { twitchUserData } = useSelector(state=> state.player)
	const [isHover, setIsHover] = useState(false);

	const handleLogout = () => {
		window.location.href = `/twitch/logout`;
	};

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
				<div className="accountInfo">
					<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
						<div className="img">
							<img src={twitchUserData.image} alt="twitchImage" srcSet="" />
						</div>
						{twitchUserData.login}
					</div>
					<Button2 onClick={handleLogout}>LOGOUT</Button2>
				</div>
			</CSSTransition>
		</div>
	);
};

export default Profile;
