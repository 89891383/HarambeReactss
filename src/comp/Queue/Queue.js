import React from "react";
import QueueItem from "./QueueItem";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useSelector } from "react-redux";
const Queue = () => {

	const { videoQueue } = useSelector(state=> state.player)

	if(videoQueue.length === 0){
		return (
			<div className="queue">
				<div className="emptyQueueText">QUEUE IS EMPTY</div>
			</div>
		)
	}


	const queueList = videoQueue.map((item, index) => {
		return (
			<CSSTransition key={index} timeout={300} classNames="transition">
				<QueueItem item={item} index={index} key={item.id} />
			</CSSTransition>
		);
	});

	return (
		<div className="queue">
			<TransitionGroup className="queue_List">
				{queueList}
			</TransitionGroup>
		</div>
	);
};

export default Queue;
