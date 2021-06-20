import React from "react";
import { useRef } from "react";
import { useContext } from "react";
import { DataContext } from "../../../App";
import OneOption from "./OneOption";
import "./Options.css";
import Popout from "../../Popout";
import AdminList from "./AdminList";
import ChangeChat from "./ChangeChat";

const OptionsDialog = () => {
	const {
		setIsDialogOpen,
		isServerTime,
		isDialogOpen,
		setIsServerTime,
		socket,
		nickname,
		isPlaylistOpen,
		setIsPlaylistOpen,
		iFrame
	} = useContext(DataContext);

	const optionsRef = useRef(null);


	const serverTimeToggle = () => {
		setIsServerTime((prev) => {
			socket.emit("serverTimeToggle", { isServerTime: !prev, nickname });
			return !prev;
		});
	};

	const serverPlaylistToggle = () => {
		setIsPlaylistOpen((prev) => {
			socket.emit("playlistToggle", { isOpen: !prev, nickname });
		});
	};

	const iFrameToggle = () =>{
		socket.emit('iFrameToggle', {nickname})
	}

	return (
		<Popout state={isDialogOpen} setState={setIsDialogOpen}>
			<div className="optionsDialog" ref={optionsRef}>
				<OneOption checked={isServerTime} onChange={serverTimeToggle}>
					<span>Server time </span>
				</OneOption>
				<OneOption checked={isPlaylistOpen} onChange={serverPlaylistToggle}>
					<span>Playlist open</span>
				</OneOption>

				<OneOption checked={iFrame} onChange={iFrameToggle}>
					<span>iFrame</span>
				</OneOption>

				<ChangeChat/>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<AdminList />
				</div>
			</div>
		</Popout>
	);
};

export default OptionsDialog;
