import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isOpen: false,
  },
  reducers: {
    setOpenModal: (state) => {
      state.isOpen = true;
      console.log("isOpen: " + state.isOpen);
    },
    setCloseModal: (state) => {
      state.isOpen = false;
      console.log("isOpen: " + state.isOpen);
    },
  },
});

export const { setOpenModal, setCloseModal } = modalSlice.actions;
export default modalSlice.reducer;
