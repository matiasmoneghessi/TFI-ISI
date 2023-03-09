import { createAction, createReducer } from "@reduxjs/toolkit";

export const selectAppToEdit = createAction("SELECT_APP");
export const emptyAppToEdit = createAction("EMPTY_APP");

const editAppointmentReducer = createReducer("", {
  [selectAppToEdit]: (state, action) => action.payload,
  [emptyAppToEdit]: (state) => "",
});

export default editAppointmentReducer;
