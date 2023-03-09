import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import userReducer from "../features/user";
import appointmentReducer from "../features/appointment";
import branchOfficeReducer from "../features/branchOffice";
import editAppointmentReducer from "../features/editAppointment";
import branchOfficesListReducer from "../features/branchOfficesList";

const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  reducer: {
    user: userReducer,
    appointment: appointmentReducer,
    branchOffice: branchOfficeReducer,
    branchOfficesList: branchOfficesListReducer,
    editApp: editAppointmentReducer,
  },
});

export default store;