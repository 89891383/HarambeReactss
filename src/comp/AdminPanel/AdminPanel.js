import React from "react";
import { useState } from "react";
import Button2 from "../Button";
import { Button } from '@material-ui/core'
import "./AdminPanel.css";
import Queue from "../Queue/Queue";
import AddVideo from "./AddVideo";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";


const useStyles = makeStyles({
	addVideoBtn: {
		color:'#90be6d',
		borderColor:'#90be6d',
		padding:'5px 35px',
		"&:hover":{
			borderColor:'black',
			backgroundColor:'#90be6d',
			color:'black'
		}
	}
})

const AdminPanel = () => {

	const classes = useStyles()

	const {admin, nickname, isPlaylistOpen} = useSelector(state=> state.player)


	const [isAddVideo, setIsAddVideo] = useState(false);

	const handleTwitchLogin = () => {
		window.location.href = `/auth/twitch`; //DECLARED IN APP
	};

	const isDisabled = admin ? false : !isPlaylistOpen;

	return (
		<>
			<AddVideo isAddVideo={isAddVideo} setIsAddVideo={setIsAddVideo} />
			{admin ? (
				// ADMIN PANEL
				<>
					{/* ADDING VIDEO PANEL */}
					<div className="adminPanel">
						{/* <div className="adminButtons"> */}

							<Button 
							variant="outlined" 
							color="primary"
							disabled={isDisabled}
							className={classes.addVideoBtn}
							onClick={()=>setIsAddVideo(prev=> !prev)}
							>
								ADD VIDEO
							</Button>


							{/* <Button2
								disabled={isDisabled}
								onClick={() => setIsAddVideo((prev) => !prev)}
							>
								Add Video
							</Button2> */}
						{/* </div> */}
					</div>
					<Queue />
				</>
			) : (
				// IS NOT ADMIN
				<div className="delayInfoContainer">
					<div className="twitchLoginButton">
						{!nickname ? (
							<Button2 onClick={handleTwitchLogin}> LOGIN WITH TWITCH</Button2>
						) : (
							<>
								<div className="adminPanel">

									<Button 
										variant="outlined" 
										color="primary"
										disabled={isDisabled}
										className={classes.addVideoBtn}
										onClick={()=>setIsAddVideo(prev=> !prev)}
									>
									ADD VIDEO
									</Button>

									{/* <Button2
										disabled={isDisabled}
										onClick={() => setIsAddVideo((prev) => !prev)}
									>
										Add Video
									</Button2> */}
								</div>
							</>
						)}
					</div>
					<Queue />
				</div>
			)}
		</>
	);
};

export default AdminPanel;
