'use client'
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { fetchInvoices, addInvoice, deleteInvoice, updateInvoice } from '@/api/invoiceApi';
import { Invoice } from '@/types';

export const fetchInvoicesAsync = createAsyncThunk('invoices/fetchInvoices', async () => {
    const response = await fetchInvoices();
    return response.data;
  });
export const addInvoiceAsync=createAsyncThunk('invoices/addInvoice', async(invoice:Invoice)=>{
    const response= await addInvoice(invoice);
    return response.data;
  })
export const deleteInvoiceAsync=createAsyncThunk('invoices/deleteInvoice', async(id)=>{
    const response=await deleteInvoice(id);
    return response.data;
  })
export const upateInvoiceAsync=createAsyncThunk('invoices/updateInvoice', async(id)=>{
    const response=await updateInvoice(id);
    return response.data;
  })

  const initialState: {
    invoices:Invoice[];
    loading: boolean;
    error: string | null | undefined;
  } = {
    invoices: [],
    loading: false,
    error: null,
  };

const invoiceSlice=createSlice({
    name:'invoice',
    initialState,
    reducers:{},
     extraReducers:(builder)=>{
        builder 
        .addCase(fetchInvoicesAsync.pending, (state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchInvoicesAsync.fulfilled, (state,action)=>{
            state.loading=false;
            state.invoices=action.payload;
        })
        .addCase(fetchInvoicesAsync.rejected, (state,action)=>{
           state.loading=false;
           state.error=action.error.message
        })
        .addCase(addInvoiceAsync.pending, (state)=>{
          state.loading=true;
          state.error=null;
        })
        .addCase(addInvoiceAsync.fulfilled, (state,action)=>{
            state.loading=false;
            const newInvoice=action.payload;
            state.invoices=[newInvoice,...state.invoices]
        })
        .addCase(addInvoiceAsync.rejected, (state,action)=>{
          state.loading=false;
          state.error=action.error.message
       })
        .addCase(deleteInvoiceAsync.fulfilled, (state,action)=>{
            state.loading=false;
            state.invoices=state.invoices.filter((itm)=>{itm.id!==action.payload})
        })
        .addCase(upateInvoiceAsync.fulfilled, (state,action)=>{
            const updatedInvoice=action.payload;
            const index=state.invoices.findIndex((item)=>{item.id===updatedInvoice.id})
            if(index!==-1){
                state.invoices[index]=updatedInvoice;
            }
        })
     }
})

export default invoiceSlice.reducer;