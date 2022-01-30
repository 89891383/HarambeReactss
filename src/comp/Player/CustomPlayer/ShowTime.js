import { Typography } from "@material-ui/core";
import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
const ShowTime = ({ time }) => {
	const [cursorX, setCursorX] = useState(-1000);
	const showTimeRef = useRef(null);

	const handleFollowCursor = useCallback((e) => {
		setCursorX(e.clientX);
	}, []);

	useEffect(() => {
		document.addEventListener("mousemove", handleFollowCursor);
		return () => {
			document.removeEventListener("mousemove", handleFollowCursor);
		};
	}, [handleFollowCursor]);

	const progressBarRect = document
		.querySelector(".progressBar")
		.getBoundingClientRect();

	if (!time) return false;

	const showTimeWidth = showTimeRef?.current?.getBoundingClientRect().width;

	const { hours, minutes, seconds } = time;

	let calculateTranslate = cursorX - progressBarRect.x - showTimeWidth / 2;

	return (
		<div
			className="showTime"
			ref={showTimeRef}
			style={{ transform: `translate(${calculateTranslate}px, -150%)` }}
		>
			<Typography>{`${hours}:${minutes}:${seconds}`}</Typography>
		</div>
	);
};

export default ShowTime;
