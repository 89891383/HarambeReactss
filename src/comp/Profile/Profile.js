import React from "react";
import { useContext, useState } from "react";
import { DataContext } from "../../App";
import "./Profile.css";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import { makeStyles } from "@material-ui/core";
import { CSSTransition } from "react-transition-group";
import Button2 from "../Button";

const useStyles = makeStyles({
	profileIcon: {
		color: "white",
	},
});

const Profile = () => {
	const classes = useStyles();
	const { twitchUserData } = useContext(DataContext);
	const [isHover, setIsHover] = useState(false);

	const handleLogout = () => {
		window.location.href = `/twitch/logout`;
	};

	return (
		<div
			className="profileIcon"
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
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
