import { Box, Tooltip, Zoom } from "@material-ui/core";
import PollIcon from "@material-ui/icons/Poll";
import { useDispatch } from "react-redux";
import { pollOpenToggle } from "../../redux/popoutsSlice";
import { sharedStyles } from "../../shared/styles";

const PollBtn = () => {
	const dispatch = useDispatch();

	return (
		<Box sx={sharedStyles.box}>
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
