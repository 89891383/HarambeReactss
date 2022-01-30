import { Fade } from "@material-ui/core";
import ShowTime from "./ShowTime";
import React, {
	useState,
	useEffect,
	useRef,
	useContext,
	useCallback,
} from "react";
import { useSelector } from "react-redux";
import { DataContext } from "../../../App";

const formatTime = (time) => {
	return time < 10 ? `0${time}` : time;
};

const convertSeconds = (time) => {
	let minutes = Math.floor(time / 60);
	let hours = Math.floor(minutes / 60);
	let seconds = Math.floor(time - 60 * minutes);
	minutes = formatTime(minutes % 60);
	hours = formatTime(hours);
	seconds = formatTime(seconds);
	return { seconds, minutes, hours };
};

const ProgressBar = () => {
	const [isTimeShow, setIsTimeShow] = useState(false);
	const [timeToShow, setTimeToShow] = useState(null); // CONVERTED SECONDS
	const [currentProgress, setCurrentProgress] = useState(0);
	const [loadedSeconds, setLoadedSeconds] = useState(0);

	const progressRef = useRef(null);

	const {
		admin,
		duration,
		progress,
		videoProgress,
		currentVideoLink,
		isLive,
		nickname,
	} = useSelector((state) => state.player);

	const { socket } = useContext(DataContext);

	useEffect(() => {
		// PROGRESS BAR ANIMATION
		setCurrentProgress((progress / duration) * 100);
	}, [duration, progress]);

	useEffect(() => {
		const loadedSeconds = videoProgress?.loadedSeconds;
		setLoadedSeconds((loadedSeconds / duration) * 100);
	}, [videoProgress, duration]);

	const handleTimeToShow = useCallback(
		(e) => {
			if (!admin) return false;
			const position = progressRef.current.getBoundingClientRect();
			const procents = (e.pageX - position.x) / position.width;
			if (procents >= 0) {
				setTimeToShow(convertSeconds(Math.floor(procents * duration)));
			}
		},
		[admin, duration]
	);

	const handleProgressChange = useCallback(
		(e) => {
			if (!admin || !currentVideoLink || isLive) return false;
			const position = e.target.getBoundingClientRect();
			const procents = (e.pageX - position.x) / position.width;
			const time = convertSeconds(duration * procents);
			const prettyTime = `${time.hours}:${time.minutes}:${time.seconds}`;
			// WARTOSC W PROCENTACH
			socket.emit("changeTime", { procents, nickname, prettyTime });
		},
		[admin, currentVideoLink, duration, isLive, nickname, socket]
	);

	const handleToggleShowTimeAbove = () => {
		setIsTimeShow((prev) => !prev);
	};

	return (
		<div className="progressBar" ref={progressRef}>
			<Fade in={isTimeShow} unmountOnExit>
				<div>
					<ShowTime time={timeToShow} />
				</div>
			</Fade>

			<div className="progressOverflowDiv">
				<div
					className="currentProgress"
					style={{
						transform: `translateX(${
							currentProgress < 100 ? -100 + currentProgress : 0
						}%)`,
					}}
				></div>

				<div
					className="loadedProgress"
					style={{
						transform: `translateX(${
							loadedSeconds < 100 ? -100 + loadedSeconds : 0
						}%)`,
					}}
				></div>
				<div
					className="progressBackground"
					onClick={handleProgressChange}
					onMouseOver={handleToggleShowTimeAbove}
					onMouseLeave={handleToggleShowTimeAbove}
					onMouseMove={handleTimeToShow}
				></div>
			</div>
		</div>
	);
};

export default ProgressBar;
