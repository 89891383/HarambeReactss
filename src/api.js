export const getProfile = () => {
	return fetch("/getProfile", { credentials: "include" }).then((res) =>
		res.json()
	);
};
