import React, { useContext } from "react";
import { useState } from "react";
import QueueButton from "./QueueButton";
import PlayButton from "./PlayButton";
import SkipButton from "./SkipButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import QueueIcon from "@material-ui/icons/Queue";
import Button2 from "../Button";
import Delay from "./Delay";
import { DataContext } from "../../App";
import "./AdminPanel.css";
import Queue from "./Queue";
import { useEffect } from "react";

const AdminPanel = () => {
	const {
		twitchUserData,
		websiteURL,
		admin,
		socket,
		nickname,
		setIsError,
		setErrorMessage,
		setIsSuccess,
		setSuccessMessage,
		nicknameOfTimeAdmin,
		setNicknameOfTimeAdmin,
		setTimeAdmin,
		timeAdmin,
	} = useContext(DataContext);
	const [editVideoLink, setEditVideoLink] = useState("");
	const [videoTitle, setVideoTitle] = useState("");

	const handleAddVideoToQueue = () => {
		if (editVideoLink) {
			socket.emit("queueUpdate", {
				videoLink: editVideoLink,
				nickname,
				videoTitle,
			});
			setEditVideoLink("");
			setVideoTitle("");
		}
	};

	const handleAddVideo = () => {
		if (editVideoLink) {
			socket.emit("videoChange", {
				currentVideoLink: editVideoLink,
				videoTitle,
			});
			setVideoTitle("");
			setEditVideoLink("");
		}
	};

	const handleSkipVideo = () => {
		if (admin) {
			socket.emit("skipVideo");
		}
	};

	const handleGetTimeAdmin = () => {
		if (admin) {
			if (timeAdmin) {
				socket.emit("timeAdminLeaveRequest", { nickname });
			} else {
				socket.emit("timeAdminRequest", { nickname });
			}
		}
	};

	useEffect(() => {
		socket.on("timeAdminRequestAnswer", ({ success, message }) => {
			if (success) {
				setTimeAdmin(true);
			} else {
				setErrorMessage(message);
				setIsError(true);
			}
		});

		socket.on("timeAdminChange", ({ nickname, message }) => {
			setIsSuccess(true);
			setNicknameOfTimeAdmin(nickname);
			setSuccessMessage(message);
		});

		socket.on("timeAdminLeaveAnswer", () => {
			setTimeAdmin(false);
		});

		return () => {
			socket.off("timeAdminRequestAnswer");
			socket.off("timeAdminChange");
			socket.off("successMessage");
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
	]);

	const handleLogout = () => {
		window.location.href = `${websiteURL}/twitch/logout`;
	};

	return (
		<>
			{admin ? (
				// ADMIN PANEL
				<>
					{/* ADDING VIDEO PANEL */}
					<div className="adminPanel">
						<form>
							<div className="inputsDiv">
								<input
									type="text"
									value={editVideoLink}
									placeholder={"URL"}
									onChange={(e) => {
										if (admin) {
											setEditVideoLink(e.target.value);
										}
									}}
								/>
								<input
									type="text"
									value={videoTitle}
									placeholder={"TITLE"}
									onChange={(e) => {
										if (admin) {
											setVideoTitle(e.target.value);
										}
									}}
								/>
							</div>

							<button
								style={{ display: "none" }}
								onClick={(e) => {
									e.preventDefault();
									handleAddVideoToQueue();
								}}
								type="submit"
							></button>
							<div className="optionButtons">
								<div className="controlButtons">
									<PlayButton onClick={handleAddVideo} title="Play">
										<PlayArrowIcon />
									</PlayButton>
									<QueueButton
										onClick={handleAddVideoToQueue}
										title={"Add to queue"}
									>
										<QueueIcon />
									</QueueButton>
									<SkipButton onClick={handleSkipVideo} title={"Skip video"}>
										<SkipNextIcon />
									</SkipButton>
								</div>
								<div className="controlButtons">
									<PlayButton onClick={handleGetTimeAdmin}>
										{nicknameOfTimeAdmin
											? `${nicknameOfTimeAdmin} HAS CONTROL`
											: "TAKE CONTROL"}
									</PlayButton>
									<Button2 text={"LOGOUT"} onClick={handleLogout} />
								</div>
							</div>
						</form>
						{twitchUserData && (
							<div className="accountInfo">
								{/* <div className="img">
									<img src={twitchUserData.image} alt="twitchImage" srcSet="" />
								</div> */}
								{twitchUserData.login}
							</div>
						)}
					</div>
					<Queue />
				</>
			) : (
				// IS NOT ADMIN
				<div className="delayInfoContainer">
					<Queue />
					{/* <Delay /> */}
				</div>
			)}
		</>
	);
};

export default AdminPanel;
