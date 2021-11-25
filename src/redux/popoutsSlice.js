import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isAddVideo: false,
	isHistoryOpen: false,
	isDialogOpen: false,
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
	},
});

export const { changeIsAddVideo, historyOpenToggle, dialogOpenToggle } =
	popoutsSlice.actions;
export default popoutsSlice.reducer;
