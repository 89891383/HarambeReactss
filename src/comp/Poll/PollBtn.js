import { Box, makeStyles, Tooltip, Zoom } from "@material-ui/core";
import PollIcon from "@material-ui/icons/Poll";
import { useDispatch } from "react-redux";
import { pollOpenToggle } from "../../redux/popoutsSlice";

const useStyles = makeStyles({
	box: {
		padding: "5px",
		borderRadius: "5px",
		display: "flex",
		transition: "300ms",
		cursor: "pointer",
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.3)",
		},
	},
});
const PollBtn = () => {
	const dispatch = useDispatch();
	const classes = useStyles();

	return (
		<Box className={classes.box}>
			<Tooltip
				title="Poll"
				placement="bottom"
				enterDelay={0}
				TransitionComponent={Zoom}
				onClick={() => dispatch(pollOpenToggle(true))}
			>
				<PollIcon />
			</Tooltip>
		</Box>
	);
};

export default PollBtn;
