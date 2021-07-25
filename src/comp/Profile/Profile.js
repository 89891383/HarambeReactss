import React from "react";
import {  useState } from "react";
import "./Profile.css";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import { makeStyles } from "@material-ui/core";
import AccountInfo from "./AccountInfo";
import { Fade } from "@material-ui/core";

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


				<Fade 
					in={isHover}
					unmountOnExit
				>
					<div>
						<AccountInfo/>
					</div>
				</Fade>
		</div>
	);
};

export default Profile;
