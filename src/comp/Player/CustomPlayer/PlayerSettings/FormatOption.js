import { Typography } from "@material-ui/core";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeQuality } from "../../../../redux/playerState";

const FormatOption = (item) => {
	const { format, url } = item.item;

	const dispatch = useDispatch();

	const { currentVideoLink } = useSelector((state) => state.player);

	const ref = useRef(null);

	if (!format || !url) return false;

	if (currentVideoLink === url) {
		ref?.current?.classList.add("current");
	}

	const style = currentVideoLink === url ? { backgroundColor: "#121212" } : {};

	const handleChangeQuality = () => {
		dispatch(changeQuality(url));
	};

	return (
		<div className="formatOption" style={style} onClick={handleChangeQuality}>
			<Typography>{format}p</Typography>
		</div>
	);
};

export default FormatOption;
