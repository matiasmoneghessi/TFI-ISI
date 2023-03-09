import { createAsyncThunk, createReducer } from '@reduxjs/toolkit';

export const branchOfficePicker = createAsyncThunk("BRANCH_OFFICE_PICKER", (picked) => {
    const clickedOffice = picked.clickedOffice ? picked.clickedOffice : picked
    return {clickedOffice}
});

export const emptyBranchOffice = createAsyncThunk("EMPTY_BRANCH_OFFICE", () => {
    return {}
})

const branchOfficeReducer = createReducer({}, {
    [branchOfficePicker.fulfilled]: (state, action) => action.payload,
    [emptyBranchOffice.fulfilled]: (state, action) => action.payload
});

export default branchOfficeReducer;