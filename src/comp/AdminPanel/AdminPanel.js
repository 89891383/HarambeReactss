import React, { useContext } from "react";
import { useState } from "react";
import Button2 from "../Button";
import { DataContext } from "../../App";
import "./AdminPanel.css";
import Queue from "../Queue/Queue";
import AddVideo from "./AddVideo";

const AdminPanel = () => {
	const {
		admin,
		nickname,
		isPlaylistOpen,
	} = useContext(DataContext);

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
						<div className="adminButtons">
							<Button2
								disabled={isDisabled}
								onClick={() => setIsAddVideo((prev) => !prev)}
							>
								Add Video
							</Button2>
						</div>
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
								<div className="adminButtons">
									<Button2
										disabled={isDisabled}
										onClick={() => setIsAddVideo((prev) => !prev)}
									>
										Add Video
									</Button2>
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
