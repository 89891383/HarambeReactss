import React from "react";
import { useContext, useRef, useEffect } from "react";
import { DataContext } from "../../App";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Button2 from "../Button";

const Delay = () => {
	const {
		setMaxDelay,
		maxDelay,
		twitchUserData,
		websiteURL,
		chatRef,
		twitchStreamer,
	} = useContext(DataContext);

	const delayInfoRef = useRef(null);

	///  HANDLE SET WIDTH ON DELAY INFO SAME AS CHAT
	useEffect(() => {
		const handleDelayInfoSetWidth = () => {
			if (delayInfoRef.current) {
				delayInfoRef.current.style.width = chatRef?.current?.offsetWidth + "px";
			}
		};
		window.addEventListener("resize", handleDelayInfoSetWidth);
		if (delayInfoRef.current) {
			handleDelayInfoSetWidth();
		}
		return () => {
			window.removeEventListener("resize", handleDelayInfoSetWidth);
		};
		// MADE FOR .current
		// eslint-disable-next-line
	}, [chatRef, delayInfoRef.current, twitchStreamer]);

	const handleTwitchLogin = () => {
		window.location.href = `${websiteURL}/auth/twitch`; //DECLARED IN APP
	};

	const handleLogout = () => {
		window.location.href = `${websiteURL}/twitch/logout`;
	};

	const handleChangeMaxDelay = (type) => {
		if (type === "increment") {
			setMaxDelay((prev) => prev + 1);
		} else if (type === "decrement") {
			setMaxDelay((prev) => {
				if (prev > 2) {
					return prev + -1;
				} else {
					return prev;
				}
			});
		}
	};

	return (
		<div className="delay" ref={delayInfoRef}>
			<span className="delayInfo">Max Delay: {maxDelay} seconds</span>
			<div className="delayManage">
				<div
					className="delayManageOptionDecrement"
					onClick={() => handleChangeMaxDelay("decrement")}
				>
					<RemoveIcon />
				</div>
				<div
					className="delayManageOptionIncrement"
					onClick={() => handleChangeMaxDelay("increment")}
				>
					<AddIcon />
				</div>
			</div>

			{twitchUserData ? (
				<div className="accountInfo">
					<div className="img">
						<img src={twitchUserData.image} alt="Profile" />
					</div>

					<Button2 text={"LOGOUT"} onClick={handleLogout} />
				</div>
			) : (
				<>
					<div className="twitchLoginButton">
						<Button2 text={"LOGIN WITH TWITCH"} onClick={handleTwitchLogin} />
					</div>
				</>
			)}
		</div>
	);
};

export default Delay;
