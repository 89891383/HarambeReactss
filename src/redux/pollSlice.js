import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isPoll: false,
	pollMessage: "Poll message",
	yesVotes: 0,
	noVotes: 0,
};

const voteSlice = createSlice({
	name: "poll",
	initialState,
	reducers: {
		setPoll: (state, action) => {
			const { pollMessage, isOpen, yes, no } = action.payload;
			state.isPoll = isOpen;
			state.pollMessage = pollMessage;
			state.yesVotes = yes;
			state.noVotes = no;
		},
	},
});

export const { setPoll } = voteSlice.actions;
export default voteSlice.reducer;
