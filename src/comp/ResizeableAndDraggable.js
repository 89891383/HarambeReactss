import { Box } from "@material-ui/core";
import { useCallback, useEffect, useRef, useState } from "react";
import ControlCameraIcon from "@material-ui/icons/ControlCamera";

const classes = {
	parent: {
		aspectRatio: "16/9",
		position: "fixed",
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
		cursor: "grab",
		display: "flex",
		padding: "5px",
		opacity: "0.4",
		borderRadius: "0 0 0 5px",
		transition: "300ms ease-in-out opacity",
	},
	box: {
		width: "100%",
		height: "100%",
		position: "relative",
	},
};

const ResizeableAndDraggable = ({ children, initWidth = 300 }) => {
	const [width, setWidth] = useState(initWidth);
	const [top, setTop] = useState(0);
	const [left, setLeft] = useState(0);
	const [isDragging, setIsDragging] = useState(false);

	const childrenRef = useRef(null);
	const dragRef = useRef(null);
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
			if (result >= 0 && result < maxHeight - height) {
				return result;
			} else if (result < 0) {
				return 0;
			} else {
				return prev;
			}
		});
		setLeft((prev) => {
			const result = e.clientX + 20 - width;
			if (result >= 0) {
				return result;
			} else if (result < 0) {
				return 0;
			} else {
				return prev;
			}
		});
	}, []);

	const handleMouseUpResize = useCallback(() => {
		setIsDragging(false);
		window.removeEventListener("mousemove", resize);
		window.removeEventListener("mouseup", handleMouseUpResize);
		parentRef.current.style.pointerEvents = "auto";
	}, [resize]);

	const handleMouseDownResize = useCallback(
		(e) => {
			if (parentRef.current !== e.target) return;
			setIsDragging(true);
			window.addEventListener("mouseup", handleMouseUpResize);
			window.addEventListener("mousemove", resize);
			parentRef.current.style.pointerEvents = "none";
		},
		[handleMouseUpResize, resize]
	);

	const handleMouseUpMove = useCallback(() => {
		setIsDragging(false);
		window.removeEventListener("mousemove", move);
		window.removeEventListener("mouseup", handleMouseUpMove);
		parentRef.current.style.pointerEvents = "auto";
	}, [move]);

	const handleMouseDownMove = useCallback(
		(e) => {
			if (e.target !== dragRef.current) return false;
			setIsDragging(true);
			window.addEventListener("mousemove", move);
			window.addEventListener("mouseup", handleMouseUpMove);
			parentRef.current.style.pointerEvents = "none";
		},
		[handleMouseUpMove, move]
	);

	useEffect(() => {
		window.addEventListener("mousedown", handleMouseDownMove);
		window.addEventListener("mousedown", handleMouseDownResize);

		return () => {
			window.removeEventListener("mousedown", handleMouseDownMove);
			window.removeEventListener("mousedown", handleMouseDownResize);
		};
	}, [handleMouseDownMove, handleMouseDownResize]);

	return (
		<>
			{isDragging && (
				<Box
					sx={{
						width: "100vw",
						height: "100vh",
						position: "fixed",
						top: "0",
						left: "0",
						cursor: "grab",
					}}
				></Box>
			)}

			<Box
				id="resizeable_parent"
				sx={classes.parent}
				ref={parentRef}
				style={{ width, transform: `translate(${left}px,${top}px)` }}
			>
				<Box sx={classes.box} ref={childrenRef}>
					{children}
					<Box id="drag" sx={classes.drag} ref={dragRef}>
						<ControlCameraIcon style={{ pointerEvents: "none" }} />
					</Box>
				</Box>
			</Box>
		</>
	);
};

export default ResizeableAndDraggable;
