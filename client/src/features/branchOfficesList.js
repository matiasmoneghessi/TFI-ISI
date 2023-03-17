import { createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import axios from 'axios';

export const branchOfficesGetter = createAsyncThunk("BRANCH_OFFICES_GETTER", async () => {
    return await axios.get('http://localhost:3001/api/appointment/:id/showAppointmentsBranch')
    .then((res) => {
        localStorage.setItem('branches', JSON.stringify(res.data))
        return res.data
    });
});

const branchOfficesListReducer = createReducer({}, {
    [branchOfficesGetter.fulfilled]: (state, action) => {
        return action.payload
    }
});

export default branchOfficesListReducer;