import { Box } from "@material-ui/core";
import { useState } from "react";

const Draggable = ({ children }) => {
	const [X, setX] = useState(0);
	const [Y, setY] = useState(0);

	const styles = {
		box: {
			left: `${Y}px`,
			top: `${X}px`,
			position: "absolute",
			// display: "inline-block",
			// overflow: "hidden",
			width: "200px",
			height: "auto",
		},
		dragBox: {
			background: "#121212",
			padding: "10px",
			// position: "absolute",
			zIndex: 3,
		},
	};

	return (
		<Box sx={styles.box}>
			<Box sx={styles.dragBox}>TAKE</Box>
			{children}
		</Box>
	);
};

export default Draggable;
