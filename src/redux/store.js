import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./playerState";
import popoutsSlice from "./popoutsSlice";

const checkLocalhost = window.location.hostname === "localhost";

export const store = configureStore({
	reducer: {
		player: playerReducer,
		popouts: popoutsSlice,
	},
	devTools: checkLocalhost,
});
