import { Box, Fade } from "@material-ui/core";
import { useCallback, useRef, useState } from "react";
import ControlCameraIcon from "@material-ui/icons/ControlCamera";

const classes = {
	parent: {
		aspectRatio: "16/9",
		position: "absolute",
		top: "0",
		zIndex: 1,
		border: "3px solid transparent",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: "5px",
		cursor: "nw-resize",
		transition: "300ms ease-in-out border",
		"&:hover": {
			borderColor: "white",
		},
	},
	drag: {
		position: "absolute",
		right: "0px",
		top: "0px",
		backgroundColor: "#121212",
		color: "white",
		cursor: "move",
		display: "flex",
		padding: "5px",
		borderRadius: "0 0 0 5px",
		transition: "300ms ease-in-out opacity",
	},
	box: { width: "100%", height: "100%", position: "relative" },
};

const ResizeableAndDraggable = ({ children, initWidth = 300 }) => {
	const [width, setWidth] = useState(initWidth);
	const [top, setTop] = useState(0);
	const [left, setLeft] = useState(0);
	const [isDragIcon, setIsDragIcon] = useState(false);

	const childrenRef = useRef(null);

	const root = document.querySelector("#root");

	const parentRef = useRef(null);

	const resize = useCallback((e) => {
		const { left } = parentRef?.current?.getBoundingClientRect();
		setWidth((prev) => {
			if (e.clientX - left + 2 > 250) {
				return e.clientX - left + 2;
			} else {
				return prev;
			}
		});
	}, []);

	const move = useCallback((e) => {
		const { width, height } = parentRef.current.getBoundingClientRect();
		const maxHeight = window.innerHeight;

		setTop((prev) => {
			const result = e.clientY - 20;
			if (result > 0 && result < maxHeight - height) {
				return result;
			} else {
				return prev;
			}
		});
		setLeft((prev) => {
			const result = e.clientX + 20 - width;
			if (result > 0) {
				return result;
			} else {
				return prev;
			}
		});
	}, []);

	const handleMouseUpResize = useCallback(() => {
		window.removeEventListener("mousemove", resize);
		window.removeEventListener("mouseup", handleMouseUpResize);
		root.style.pointerEvents = "auto";
		childrenRef.current.style.pointerEvents = "auto";
	}, [resize, root, childrenRef]);

	const handleMouseDownResize = useCallback(
		(e) => {
			if (parentRef.current !== e.target) return;
			window.addEventListener("mouseup", handleMouseUpResize);
			window.addEventListener("mousemove", resize);
			root.style.pointerEvents = "none";
			childrenRef.current.style.pointerEvents = "none";
		},
		[handleMouseUpResize, resize, root, childrenRef]
	);

	const handleMouseUpMove = useCallback(() => {
		window.removeEventListener("mousemove", move);
		window.removeEventListener("mouseup", handleMouseUpMove);
		root.style.pointerEvents = "auto";
		childrenRef.current.style.pointerEvents = "auto";
	}, [move, root, childrenRef]);

	const handleMouseDownMove = useCallback(() => {
		window.addEventListener("mousemove", move);
		childrenRef.current.style.pointerEvents = "none";
		root.style.pointerEvents = "none";
		window.addEventListener("mouseup", handleMouseUpMove);
	}, [handleMouseUpMove, move, root, childrenRef]);

	const toggleDragIcon = () => {
		setIsDragIcon((prev) => !prev);
	};

	return (
		<Box
			id="resizeable_parent"
			sx={classes.parent}
			ref={parentRef}
			style={{ width, transform: `translate(${left}px,${top}px)` }}
			onMouseDown={handleMouseDownResize}
			onMouseUp={handleMouseUpResize}
			onMouseEnter={toggleDragIcon}
			onMouseLeave={toggleDragIcon}
		>
			<Box sx={classes.box} ref={childrenRef}>
				{children}
				<Fade in={isDragIcon} unmountOnExit>
					<Box
						id="drag"
						onMouseDown={handleMouseDownMove}
						onMouseUp={handleMouseUpMove}
						sx={classes.drag}
					>
						<ControlCameraIcon />
					</Box>
				</Fade>
			</Box>
		</Box>
	);
};

export default ResizeableAndDraggable;
