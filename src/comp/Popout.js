import React, { useCallback } from "react";
import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import "./Popout.css";
const Popout = ({ children, state, setState }) => {
	const popoutRef = useRef(null);

	const handleClose = useCallback(
		(e) => {
			if (!popoutRef.current.contains(e.target)) {
				setState(false);
			}
		},
		[setState]
	);

	return (
		<CSSTransition
			classNames="transition"
			unmountOnExit
			in={state}
			timeout={300}
			onEnter={() => {
				document.addEventListener("click", handleClose);
			}}
			onExit={() => {
				document.removeEventListener("click", handleClose);
			}}
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
