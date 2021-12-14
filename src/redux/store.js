import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./playerState";
import popoutsSlice from "./popoutsSlice";
import pollSlice from "./pollSlice";

const checkLocalhost = window.location.hostname === "localhost";

export const store = configureStore({
	reducer: {
		player: playerReducer,
		popouts: popoutsSlice,
		vote: pollSlice,
	},
	devTools: checkLocalhost,
});
