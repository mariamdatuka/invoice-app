import { Invoice } from '@/types';
import axios from 'axios'

const BASE_URL='https://invoice-app-1wi7.onrender.com/api/'

export const fetchInvoices=async()=>{
    return axios.get(`${BASE_URL}invoice`);
}
export const addInvoice=async(invoice:Invoice)=>{
    return axios.post(`${BASE_URL}add`, invoice)
}
export const deleteInvoice=async(invoiceId:string)=>{
    return axios.delete(`${BASE_URL}add/${invoiceId}`)
}
export const updateInvoice=async(invoiceId:string)=>{
    return axios.put(`${BASE_URL}add/${invoiceId}`)
}