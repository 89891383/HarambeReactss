import React from "react";
import QueueItem from "./QueueItem";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useSelector } from "react-redux";
const Queue = () => {

	const { videoQueue } = useSelector(state=> state.player)

	const queueList = videoQueue.map((item, index) => {
		return (
			<CSSTransition key={index} timeout={300} classNames="transition">
				<QueueItem item={item} index={index} key={index} />
			</CSSTransition>
		);
	});

	return (
		<>
			{queueList.length > 0 ? (
				<div className="queue">
					<TransitionGroup className="queue_List">{queueList}</TransitionGroup>
				</div>
			) : (
				<div className="queue">
					<div className="emptyQueueText">QUEUE IS EMPTY</div>
				</div>
			)}
		</>
	);
};

export default Queue;
