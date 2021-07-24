import React from "react";
import { useState } from "react";
import Button2 from "../Button";
import { Button } from '@material-ui/core'
import "./AdminPanel.css";
import Queue from "../Queue/Queue";
import AddVideo from "./AddVideo";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import SideOptions from '../SideOptions';


const useStyles = makeStyles({
	addVideoBtn: {
		color:'#90be6d',
		borderColor:'#90be6d',
		"&:hover":{
			borderColor:'#90be6d',
		}
	}
})

const AdminPanel = () => {

	const classes = useStyles()

	const {admin, nickname, isPlaylistOpen,videoQueue} = useSelector(state=> state.player)


	const [isAddVideo, setIsAddVideo] = useState(false);

	const handleTwitchLogin = () => {
		window.location.href = `/auth/twitch`; //DECLARED IN APP
	};

	const isDisabled = admin ? false : !isPlaylistOpen;

	return (
		<>
			<AddVideo isAddVideo={isAddVideo} setIsAddVideo={setIsAddVideo} />
		
					{/* ADDING VIDEO PANEL */}
					<div className="adminPanel"> 
							<h3 className="currentQueue_Counter"> 
								<span className="queueCounter">{videoQueue.length}</span> Current
								queue:
							</h3>
								{/* QUEUE_H3 CSS IS IN Queue.css */}


						<SideOptions/>
						

						{nickname && 
							<Button 
								variant="outlined" 
								color="primary"
								disabled={isDisabled}
								className={classes.addVideoBtn}
								onClick={()=>setIsAddVideo(prev=> !prev)}
							>
								ADD VIDEO
							</Button>}

						{!nickname  && (

							<Button2 onClick={handleTwitchLogin}> LOGIN WITH TWITCH</Button2>
						)}

					</div>
					<Queue />
				</>
	);
};

export default AdminPanel;
