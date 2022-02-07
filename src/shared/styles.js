import colors from "../colors";

export const sharedStyles = {
	box: {
		padding: "5px",
		borderRadius: "5px",
		display: "flex",
		transition: "300ms background",
		cursor: "pointer",
		"&:hover": {
			backgroundColor: colors.boxHoverWhite,
		},
	},
};
