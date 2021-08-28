import { Fade } from "@material-ui/core";
import React from "react";
import { useRef } from "react";
import { useClickAway } from "react-use";
import "./Popout.css";
const Popout = ({ children, state, setState }) => {
	const popoutRef = useRef(null);

	useClickAway(popoutRef, () => {
		setState(); // CLOSE
	});

	return (
		<Fade unmountOnExit in={state} timeout={300}>
			<div className="closeBackground">
				<div className="popoutContainer" ref={popoutRef}>
					{children}
				</div>
			</div>
		</Fade>
	);
};

export default Popout;
