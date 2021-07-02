import React from "react";
import { useRef } from "react";
import { useContext } from "react";
import { DataContext } from "../../../App";
import OneOption from "./OneOption";
import "./Options.css";
import Popout from "../../Popout";
import AdminList from "./AdminList";
import ChangeChat from "./ChangeChat";
import { useDispatch, useSelector } from "react-redux";
import { dialogOpenToggle } from "../../../redux/playerState";

const OptionsDialog = () => {
	const {
		socket,
	} = useContext(DataContext);
	
	const dispatch = useDispatch()

	const {isServerTime, isDialogOpen, isPlaylistOpen, iFrame,nickname,} = useSelector(state=> state.player)

	const optionsRef = useRef(null);


	const serverTimeToggle = () => {
		socket.emit("serverTimeToggle", { isServerTime, nickname });
	};

	const serverPlaylistToggle = () => {
		socket.emit("playlistToggle", { isOpen: !isPlaylistOpen, nickname });
	};

	const iFrameToggle = () =>{
		socket.emit('iFrameToggle', {nickname})
	}

	return (
		<Popout state={isDialogOpen} setState={()=> dispatch(dialogOpenToggle())}>
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
