import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isAddVideo: false,
	isHistoryOpen: false,
	isDialogOpen: false,
	isPollOpen: false,
};

const popoutsSlice = createSlice({
	name: "popoutsSlice",
	initialState,
	reducers: {
		changeIsAddVideo: (state, action) => {
			const { payload } = action;

			state.isAddVideo = payload;
		},
		historyOpenToggle: (state, action) => {
			state.isHistoryOpen = action.payload;
		},
		dialogOpenToggle: (state, action) => {
			state.isDialogOpen = action.payload;
		},
		pollOpenToggle: (state, action) => {
			state.isPollOpen = action.payload;
		},
	},
});

export const {
	changeIsAddVideo,
	historyOpenToggle,
	dialogOpenToggle,
	pollOpenToggle,
} = popoutsSlice.actions;
export default popoutsSlice.reducer;
