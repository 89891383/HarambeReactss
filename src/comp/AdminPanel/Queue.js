import React, { useContext } from "react";
import { DataContext } from "../../App";
import QueueItem from "./QueueItem";
const Queue = () => {
	const { videoQueue } = useContext(DataContext);
	const queueList = videoQueue.map((item, index) => {
		return <QueueItem item={item} index={index} key={index} />;
	});

	return <div className="queue">{queueList}</div>;
};

export default Queue;
