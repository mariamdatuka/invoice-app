import { configureStore } from "@reduxjs/toolkit";
import invoiceReducer from './reducers/invoiceSlice'
import {useSelector, TypedUseSelectorHook} from 'react-redux'

const store=configureStore({
    reducer:{
       invoices:invoiceReducer
    }
})

export default store;

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;
export const useAppSelector:TypedUseSelectorHook<RootState>=useSelector;