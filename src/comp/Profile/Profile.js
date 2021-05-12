import React from "react";
import { useContext, useState } from "react";
import { DataContext } from "../../App";
import "./Profile.css";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import { makeStyles } from "@material-ui/core";
import { CSSTransition } from "react-transition-group";

const useStyles = makeStyles({
	profileIcon: {
		color: "white",
	},
});

const Profile = () => {
	const classes = useStyles();
	const { twitchUserData } = useContext(DataContext);
	const [isHover, setIsHover] = useState(false);

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
					<div className="img">
						<img src={twitchUserData.image} alt="twitchImage" srcSet="" />
					</div>
					{twitchUserData.login}
				</div>
			</CSSTransition>
		</div>
	);
};

export default Profile;
