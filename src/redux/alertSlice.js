import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	type: "success",
	message: "",
	isAlert: false,
};

const alertSlice = createSlice({
	name: "alert",
	initialState,
	reducers: {
		setAlert: (state, action) => {
			const { type, message } = action.payload;
			state.message = message;
			state.type = type;
			state.isAlert = true;
		},
		closeAlert: (state) => {
			state.isAlert = false;
		},
	},
});

export const { setAlert, closeAlert } = alertSlice.actions;
export default alertSlice.reducer;
