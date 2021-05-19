import React, { useContext } from "react";
import { useState } from "react";
import Button2 from "../Button";
// import Delay from "./Delay";
import { DataContext } from "../../App";
import "./AdminPanel.css";
import Queue from "../Queue/Queue";
import { useEffect } from "react";
import AddVideo from "./AddVideo";

const AdminPanel = () => {
	const {
		// twitchUserData,
		websiteURL,
		admin,
		socket,
		nickname,
		setIsError,
		setErrorMessage,
		setIsSuccess,
		setSuccessMessage,
		setNicknameOfTimeAdmin,
		setTimeAdmin,
		setIsServerTime,
		isPlaylistOpen,
		setIsWarning,
		setWarningMessage,
	} = useContext(DataContext);

	const [isAddVideo, setIsAddVideo] = useState(false);

	useEffect(() => {
		socket.on("timeAdminRequestAnswer", ({ success, message }) => {
			if (success) {
				setTimeAdmin(true);
			} else {
				setErrorMessage(message);
				setIsError(true);
			}
		});

		socket.on("timeAdminChange", ({ nickname, message, isServerTime }) => {
			if (isServerTime) {
				setTimeAdmin(false);
			}
			if (!nickname) {
				setWarningMessage(message);
				setIsWarning(true);
			} else {
				setIsSuccess(true);
				setSuccessMessage(message);
				setNicknameOfTimeAdmin(nickname);
			}
			setIsServerTime(isServerTime);
		});

		socket.on("timeAdminLeaveAnswer", () => {
			setTimeAdmin(false);
		});

		return () => {
			socket.off("timeAdminRequestAnswer");
			socket.off("timeAdminChange");
			socket.off("timeAdminLeaveAnswer");
		};
	}, [
		setErrorMessage,
		setIsError,
		setIsSuccess,
		setSuccessMessage,
		socket,
		setNicknameOfTimeAdmin,
		setTimeAdmin,
		setIsServerTime,
		setIsWarning,
		setWarningMessage,
	]);

	const handleTwitchLogin = () => {
		window.location.href = `${websiteURL}/auth/twitch`; //DECLARED IN APP
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
