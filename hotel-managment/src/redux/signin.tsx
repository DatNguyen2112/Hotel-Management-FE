import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
  userFullName: string;
}

const initialState: CounterState = {
  userFullName: "",
};

const userFullName = createSlice({
  name: "fullName",
  initialState,
  reducers: {
    setFullName: (state, action) => {
      state.userFullName = action.payload;
    },
  },
});

const FullName = userFullName.reducer;

export const { setFullName } = userFullName.actions;

export default FullName;
