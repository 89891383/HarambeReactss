import { useDispatch, useSelector } from "react-redux";
import {
	dialogOpenToggle,
	historyOpenToggle,
	pollOpenToggle,
} from "../redux/popoutsSlice";
import OptionsDialog from "./AdminPanel/Options/OptionsDialog";
import HistoryDialog from "./History/HistoryDialog";
import SetPoll from "./Poll/SetPoll";
import Popout from "./Popout";

const Popouts = () => {
	const dispatch = useDispatch();

	const { isDialogOpen, isPollOpen, isHistoryOpen } = useSelector(
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
