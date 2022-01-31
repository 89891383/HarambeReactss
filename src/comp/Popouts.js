import { useDispatch, useSelector } from "react-redux";
import {
	changeIsAddVideo,
	dialogOpenToggle,
	historyOpenToggle,
	pollOpenToggle,
} from "../redux/popoutsSlice";
import AddVideo from "./AdminPanel/AddVideo";
import OptionsDialog from "./AdminPanel/Options/OptionsDialog";
import HistoryDialog from "./History/HistoryDialog";
import SetPoll from "./Poll/SetPoll";
import Popout from "./Popout";

const Popouts = () => {
	const dispatch = useDispatch();

	const { isDialogOpen, isPollOpen, isHistoryOpen, isAddVideo } = useSelector(
		(state) => state.popouts
	);

	return (
		<>
			<Popout
				state={isDialogOpen}
				setState={() => dispatch(dialogOpenToggle(false))}
			>
				<OptionsDialog />
			</Popout>

			<Popout
				state={isAddVideo}
				setState={() => dispatch(changeIsAddVideo(false))}
			>
				<AddVideo />
			</Popout>
			<Popout
				state={isPollOpen}
				setState={() => dispatch(pollOpenToggle(false))}
			>
				<SetPoll />
			</Popout>
			<Popout
				state={isHistoryOpen}
				setState={() => dispatch(historyOpenToggle(false))}
			>
				<HistoryDialog />
			</Popout>
		</>
	);
};

export default Popouts;
