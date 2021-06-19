import React, { useCallback } from "react";
import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { useClickAway } from "react-use"
import "./Popout.css";
const Popout = ({ children, state, setState }) => {
	const popoutRef = useRef(null);


	useClickAway(popoutRef, ()=>{
		setState(false);
	})

	return (
		<CSSTransition
			classNames="transition"
			unmountOnExit
			in={state}
			timeout={300}
		>
			<div className="closeBackground">
				<div className="popoutContainer" ref={popoutRef}>
					{children}
				</div>
			</div>
		</CSSTransition>
	);
};

export default Popout;
