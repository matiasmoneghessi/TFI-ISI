import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit';

// OPCIONES: recibir el local date desde calendar junto con el picked ---- acceder al prev state del global ---
// setear aca en redux una propiedad adicional con el date anterior

export const appointmentPicker = createAsyncThunk("APPOINTMENT_PICKER", (picked) => {
    console.log('date picked en reduce es ', picked)
    const day = picked.date.getDay().toString();
    const date = picked.date.getDate().toString();
    const month = picked.date.getMonth().toString();
    const year = picked.date.getFullYear().toString();
    const hours = picked.date.getHours().toString();
    const minutes = picked.date.getMinutes().toString();

    return {day, date, month, year, hours, minutes}
});

export const emptyAppointment = createAsyncThunk("EMPTY_APPOINTMENT", () => {
    return {}
});

const appointmentReducer = createReducer({}, {
    [appointmentPicker.fulfilled]: (state, action) => action.payload,
    [emptyAppointment.fulfilled]: (state, action) => action.payload
});

export default appointmentReducer;