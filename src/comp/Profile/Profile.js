import React from "react";
import { useState } from "react";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import { Box } from "@material-ui/core";
import AccountInfo from "./AccountInfo";
import { Fade } from "@material-ui/core";
import { sharedStyles } from "../../shared/styles";

const Profile = () => {
	const [isHover, setIsHover] = useState(false);

	return (
		<Box
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			onClick={() => setIsHover((prev) => !prev)}
		>
			<Box sx={sharedStyles.box}>
				<AccountBoxIcon />
			</Box>

			<Fade in={isHover} unmountOnExit>
				<div>
					<AccountInfo />
				</div>
			</Fade>
		</Box>
	);
};

export default Profile;
