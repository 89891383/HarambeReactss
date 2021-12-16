import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./playerState";
import popoutsSlice from "./popoutsSlice";
import pollSlice from "./pollSlice";
import alertSlice from "./alertSlice";

const checkLocalhost = window.location.hostname === "localhost";

export const store = configureStore({
	reducer: {
		player: playerReducer,
		popouts: popoutsSlice,
		vote: pollSlice,
		alert: alertSlice,
	},
	devTools: checkLocalhost,
});
