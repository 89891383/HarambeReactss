import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Iframe from "react-iframe";
import { useSelector } from "react-redux";
import { useIdle } from "react-use";
import Title from "./CustomPlayer/Title";

const useStyles = makeStyles({
	iFrame: {
		width: "100%",
		height: "100%",
	},
	titleBox: {
		display: "flex",
		alignItems: "center",
		position: "absolute",
		top: "0",
		left: "0",
		width: "100%",
		padding: "15px",
	},
});

const AlternativePlayer = () => {
	const { videoTitle, currentVideoLink } = useSelector((state) => state.player);

	const classes = useStyles();

	const isIdle = useIdle(3000);

	return (
		<Box className={classes.iFrame}>
			<Iframe
				url={currentVideoLink}
				width="100%"
				height="100%"
				styles={{ overflow: "hidden" }}
				frameBorder="0"
				scrolling="no"
				allowFullScreen
				allow-popouts="no"
				display="initial"
				position="relative"
			/>
			{videoTitle && !isIdle && (
				<Box className={classes.titleBox}>
					<Title />
				</Box>
			)}
		</Box>
	);
};

export default AlternativePlayer;
