import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { changeMaxDelay } from "../../../../redux/playerState";

const Delay = () => {
	const { maxDelay } = useSelector((state) => state.player);

	const dispatch = useDispatch();

	return (
		<div className="changeDelay">
			CHANGE DELAY
			<div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
				<Button
					variant="outlined"
					color="primary"
					onClick={() => {
						dispatch(changeMaxDelay(-1));
					}}
				>
					-
				</Button>
				{maxDelay}s
				<Button
					variant="outlined"
					color="primary"
					onClick={() => {
						dispatch(changeMaxDelay(1));
					}}
				>
					+
				</Button>
			</div>
		</div>
	);
};

export default Delay;
