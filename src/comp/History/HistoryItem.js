import React, { useEffect, useState } from "react";
const HistoryItem = ({ children, URL, index }) => {
	const [videoTitle, setVideoTitle] = useState(null);

	useEffect(() => {
		fetch(`https://noembed.com/embed?url=${URL}`)
			.then((res) => res.json())
			.then((res) => {
				setVideoTitle(res.title);
			});

		return () => {
			setVideoTitle(null);
		};
	}, [URL]);

	return (
		<div className="historyItem">
			{index + 1}. {videoTitle ? <a href={URL}>{videoTitle}</a> : children}
		</div>
	);
};

export default HistoryItem;
