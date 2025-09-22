import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/slice";
import employerReducer from "./employer/employerSlice"
import jobReducer from "./jobs/jobSlice"
import  candidateReducer  from "./candidate/candidateSlice";
import jobApplicationReducer from "./jobApp/jobAppSlice";
export const store = configureStore({
  reducer:{
    users: userReducer,
    employer: employerReducer,
    jobs:jobReducer,
    candidate:candidateReducer, 
    jobApplication: jobApplicationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;




