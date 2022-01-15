const formatTime = (time) => {
	return time < 10 ? `0${time}` : time;
};

const convertSeconds = (time) => {
	if (typeof time !== "number" || !time) return false;

	let minutes = Math.floor(time / 60);
	let hours = Math.floor(minutes / 60);
	let seconds = Math.floor(time - 60 * minutes);
	minutes = formatTime(minutes % 60);
	hours = formatTime(hours);
	seconds = formatTime(seconds);
	return `${hours}:${minutes}:${seconds}`;
};

export default convertSeconds;
