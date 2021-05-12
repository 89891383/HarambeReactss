import React, { useContext } from "react";
import { useState } from "react";
import Button2 from "../Button";
// import Delay from "./Delay";
import { DataContext } from "../../App";
import "./AdminPanel.css";
import Queue from "./Queue";
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
		// nicknameOfTimeAdmin,
		setNicknameOfTimeAdmin,
		setTimeAdmin,
		// timeAdmin,
		setIsServerTime,
		isPlaylistOpen,
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
			setIsSuccess(true);
			setIsServerTime(isServerTime);
			setNicknameOfTimeAdmin(nickname);
			setSuccessMessage(message);
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
	]);

	const handleTwitchLogin = () => {
		window.location.href = `${websiteURL}/auth/twitch`; //DECLARED IN APP
	};

	const handleLogout = () => {
		window.location.href = `${websiteURL}/twitch/logout`;
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

							<Button2 onClick={handleLogout}>LOGOUT</Button2>
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

									<Button2 onClick={handleLogout}>LOGOUT</Button2>
								</div>
							</>
						)}
					</div>
					<Queue />
					{/* <Delay /> */}
				</div>
			)}
			{/* {nickname && <Profile />} */}
		</>
	);
};

export default AdminPanel;
