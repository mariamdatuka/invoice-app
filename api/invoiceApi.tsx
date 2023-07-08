import axios from 'axios'

const BASE_URL='https://invoice-app-1wi7.onrender.com/api/invoice'

export const fetchInvoices=async()=>{
    return axios.get(`${BASE_URL}`);
}
export const addInvoice=async(invoice:any)=>{
    return axios.post(`${BASE_URL}/add`, invoice)
}
export const deleteInvoice=async(invoiceId:any)=>{
    return axios.delete(`${BASE_URL}/add/${invoiceId}`)
}
export const updateInvoice=async(invoiceId:any)=>{
    return axios.put(`${BASE_URL}/add/${invoiceId}`)
}