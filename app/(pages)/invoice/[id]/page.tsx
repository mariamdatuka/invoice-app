'use client'
import { useEffect,useState } from 'react';
import Image from 'next/image';
import { formatDate } from '@/components/common/formatDate';
import { useRouter } from 'next/navigation';
import { useDispatch} from 'react-redux';
import { AppDispatch } from '@/store/store'
import { fetchInvoicesAsync, deleteInvoiceAsync,updateInvoiceAsync} from '@/store/reducers/invoiceSlice';
import { useAppSelector } from '@/store/store'
import SmallModal from '@/components/Modal/SmallModal';
import Modal from '@/components/Modal/Modal';
import Header from '@/components/header/Header';
import {useForm} from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { Invoice, InvoiceItem } from '@/types';
import axios from 'axios';


type Props = {
    params: {
      id: string;
    };
  };

const Page = ({params}:Props) => {

const [rows,setRows]=useState<InvoiceItem[]>([]);
const [isOpen, setIsOpen]=useState<boolean>(false);
const [IsOpenModal, setIsOpenModal]=useState<boolean>(false);
const dispatch = useDispatch<AppDispatch>();
const invoices = useAppSelector((state) => state.invoices.invoices);
const router=useRouter();
const {id}=params;
const invoice= invoices.find((inv:Invoice)=>(inv.id===id));

useEffect(()=>{
dispatch(fetchInvoicesAsync());
}, [invoices])

const openModal=()=>{
  setIsOpen(true)
}
const closeModal=()=>{
  setIsOpen(false);
}

const openFormModal=()=>{
  setIsOpenModal(true)
}
const closeFormModal=()=>{
  setIsOpenModal(false);
}

const transformedDate= invoice && formatDate(invoice.createdAt)
const paymentDue=invoice && formatDate(invoice.paymentDue)

const handleDelete=(id:string)=>{
   dispatch(deleteInvoiceAsync(id));
   router.push("/");
}

const schema = Yup.object().shape({
  senderAddress: Yup.object().shape({
    street: Yup.string().required('Street Address is required'),
    city: Yup.string().required('City is required'),
    postCode: Yup.string().required('Post Code is required'),
    country: Yup.string().required('Country is required'),
  }),
  clientAddress: Yup.object().shape({
    street: Yup.string().required('Street Address is required'),
    city: Yup.string().required('City is required'),
    postCode: Yup.string().required('Post Code is required'),
    country: Yup.string().required('Country is required'),
  }),
   clientEmail:Yup.string().required('required'),
   clientName:Yup.string().required('required'),
   createdAt:Yup.string().required('required'),
   paymentDue:Yup.string().required('required'),
   description:Yup.string().required('required'),
   paymentTerms:Yup.number().required(),
   status:Yup.string().required(),
   total:Yup.number().required('required'),
   items: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('required'),
      quantity: Yup.number().required('required').min(1, 'min 1').nullable().transform((value) => Number.isNaN(value) ? null : value ),
      price: Yup.number().required('required').min(1, 'must be a positive number').nullable().transform((value) => Number.isNaN(value) ? null : value ),
      total: Yup.number().required('required').nullable().transform((value) => Number.isNaN(value) ? null : value ),
    })
  ),
});


const {register,handleSubmit, formState:{errors},watch,setValue}=useForm({
  mode:'onBlur',
  resolver:yupResolver(schema),
  defaultValues:{
    createdAt:'',
    paymentDue:'',
    description:'',
    paymentTerms:0,
    clientName:'',
    clientEmail:'',
    status:'pending',
    senderAddress:{
        street:'',
        city:'',
        postCode:'',
        country:'',
    },
    clientAddress:{
      street:'',
      city:'',
      postCode:'',
      country:'',
    },
    items:[
      {
        name:'',
        quantity:0,
        price:0,
        total:0,
      }
     ],
    total:0,
  }
})

const items:any = watch('items');
const onSubmit = (invoice:any) => {
  dispatch(updateInvoiceAsync({id, invoice}));
  closeFormModal();
};
const addRow=()=>{
     const newRow={
        name:'',
        price:0,
        quantity:0,
        total:0,    
     }
     setRows([newRow, ...rows])
  }
  const deleteRow=(i:number)=>{
        const updatedRows= rows.filter((_:any,index:number)=>index!==i);
        setRows(updatedRows);
      }

      const populateFormFields = (invoice:any) => {
        setValue('senderAddress.street', invoice.senderAddress.street);
        setValue('senderAddress.city', invoice.senderAddress.city);
        setValue('senderAddress.postCode', invoice.senderAddress.postCode);
        setValue('senderAddress.country', invoice.senderAddress.country);

        setValue('clientName', invoice.clientName);
        setValue('clientEmail', invoice.clientEmail);

        setValue('clientAddress.street', invoice.clientAddress.street);
        setValue('clientAddress.city', invoice.clientAddress.city);
        setValue('clientAddress.postCode', invoice.clientAddress.postCode);
        setValue('clientAddress.country', invoice.clientAddress.country);

        setValue('createdAt', invoice.createdAt);
        setValue('paymentDue', invoice.paymentDue);
        setValue('description', invoice.description);
        setValue('total', invoice.total);

        // Set values for the items fields
        invoice.items.forEach((item:any, index:number) => {
       setValue(`items.${index}.name`, item.name);
       setValue(`items.${index}.quantity`, item.quantity);
       setValue(`items.${index}.price`, item.price);
       setValue(`items.${index}.total`, item.total);
       });
      };

      const handleEdit = () => {
        openFormModal();
        populateFormFields(invoice); // Populate the form fields with the invoice details
      };

      const changeStatus=(id:string,invoice:Invoice)=>{
        if(invoice.status!=='paid'){
            const updatedInvoice={...invoice, status:'paid'}
            dispatch(updateInvoiceAsync({id,invoice:updatedInvoice}));
        }
      }
      
      const changeToDraft=(id:string,invoice:Invoice)=>{
        if(invoice.status!=='draft'){
            const updatedInvoice={...invoice, status:'draft'}
            dispatch(updateInvoiceAsync({id,invoice:updatedInvoice}));
        }
      }
      
  return (
    <>
    {invoice && (
        <>
         <div className='grid grid-cols-1 md:grid-cols-4'>
           <div className='col-span-1'>
              <Header/>
           </div>
         <div className='col-span-1 md:col-span-3 pt-9 pr-16'>
           <main className='flex flex-col items-center gap-6'>
             <button className='flex gap-3 justify-center items-center' onClick={()=>router.push('/')}>
          <Image src='../../../../assets/icon-arrow-left.svg' alt='arrowleft' width={7} height={7}/>
          <p>Go back</p>
      </button>
      <section className='w-10/12 flex items-center justify-between bg-[var(--color-white)] rounded-lg p-6' >
         <div className='flex gap-2 justify-center items-center'>
             <p className='text-[var(--color-dark-gray)] text-xs'>Status</p>
             <div className={`status-${invoice?.status.toLowerCase()} text-md`}>{invoice.status}</div>
         </div>
         <div className='flex justify-center items-center gap-3'>
             <button className='bg-gray-100 rounded-3xl px-5 py-3 hover:bg-cyan-50 transition-all duration-300' onClick={handleEdit}>Edit</button>
             <button className='bg-[var(--color-dark-red)] rounded-3xl px-5 py-3 hover:bg-[var(--color-light-red)] transition-all duration-300' onClick={openModal}>Delete</button>
             <button className='bg-[var(--color-dark-purple)] rounded-3xl px-5 py-3 hover:bg-[var(--color-light-purple)] transition-all duration-300' onClick={()=>changeStatus(invoice.id, invoice)}>Mark as Paid</button>
         </div>
      </section>
      <Modal isOpen={IsOpenModal}>
      <main>
        <h2 className='font-bold text-2xl'>Edit Invoice {invoice.id}</h2>
      <form onSubmit={handleSubmit(onSubmit)}> 
      <section className='flex flex-col gap-5 mt-2'>   
        <p className='text-[var(--color-dark-purple)] font-bold text-xs'>bill from</p>
        <div className='flexbox'>
          <label className='label'>Street Address</label>
          <input className='input w-96'type='text' {...register('senderAddress.street')}/>
          <span className='error'>{errors.senderAddress?.street?.message}</span>
        </div>
       <div className='flex gap-6 items-center justify-start'>
          <div className='flexbox'>
             <label className='label'>City</label>
             <input className='input w-28'type='text' {...register('senderAddress.city')}/>
             <span className='error'>{errors.senderAddress?.city?.message}</span>
          </div>
          <div className='flexbox'>
             <label className='label'>Post Code</label>
             <input className='input w-28'type='text' {...register('senderAddress.postCode')}/>
             <span className='error'>{errors.senderAddress?.postCode?.message}</span>
          </div>
          <div className='flexbox'>
             <label className='label'>Country</label>
             <input className='input w-28'type='text' {...register('senderAddress.country')}/>
             <span className='error'>{errors.senderAddress?.country?.message}</span>
          </div>
        </div>
       </section> 
     <section className='flex flex-col gap-5 mt-6'>
       <p className='text-[var(--color-dark-purple)] font-bold text-xs'>bill to</p>
        <div className='flexbox'>
          <label className='label'>Client's Name</label>
          <input className='input w-96'type='text' {...register('clientName')}/>
          <span className='error'>{errors.clientEmail?.message}</span>
        </div>
        <div className='flexbox'>
          <label className='label'>Client's Email</label>
          <input className='input w-96'type='email' {...register('clientEmail')}/>
          <span className='error'>{errors.clientEmail?.message}</span>
        </div>
        <div className='flexbox'>
          <label className='label'>Street Address</label>
          <input className='input w-96'type='text'{...register('clientAddress.street')}/>
          <span className='error'>{errors.clientAddress?.street?.message}</span>
        </div>
       <div className='flex gap-6 items-center justify-start'>
          <div className='flexbox'>
             <label className='label'>City</label>
             <input className='input w-28'type='text' {...register('clientAddress.city')}/>
             <span className='error'>{errors.clientAddress?.city?.message}</span>
          </div>
          <div className='flexbox'>
             <label className='label'>Post Code</label>
             <input className='input w-28'type='text' {...register('clientAddress.postCode')}/>
             <span className='error'>{errors.clientAddress?.postCode?.message}</span>
          </div>
          <div className='flexbox'>
             <label className='label'>Country</label>
             <input className='input w-28'type='text' {...register('clientAddress.country')}/>
             <span className='error'>{errors.clientAddress?.country?.message}</span>
          </div>
       </div>
       <div className='flex gap-6 items-center justify-start'>
           <div className='flexbox'>
              <label className='label'>Invoice Date</label>
              <input className='input w-44'type='date'{...register('createdAt')}/>
              <span className='error'>{errors.createdAt?.message}</span>
           </div>
           <div className='flexbox'>
              <label className='label'>Payment terms</label>
              <select className='w-44 input' {...register('paymentDue')}>
                  <option value='Next 30 Days'>Next 30 Days</option>
                  <option value='Next 1 Day'>Next 1 Day</option>
                  <option value='Next 7 Days'>Next 7 Days</option>
                  <option value='Next 14 Days'>Next 14 Days</option>      
              </select>
              <span className='error'>{errors.paymentDue?.message}</span>
           </div>
         </div>
         <div className='flexbox'>
             <label className='label'>Project Description</label>
             <input className='input w-96'type='text' placeholder='e.g Graphic design service'
              {...register('description')}/>
              <span className='error'>{errors.description?.message}</span>
          </div>
      </section>
      <section className='mt-6'>
          <h3 className='text-lg text-[var(--color-dark-gray)] font-bold'>Item List</h3>
          <div className='grid grid-cols-6 my-4 place-items-start gap-2'>
               <div className='col-span-2 smallFont'>item Name</div>
               <div className='col-span-1 smallFont'>Qty.</div>
               <div className='col-span-1 smallFont'>Price</div>
               <div className='col-span-1 smallFont'>Total</div>
          </div>
           {
             rows?.map((_,index:number)=>(
               <div key={index} className='grid grid-cols-6 place-items-start mb-3 gap-2'>
                    <div className='col-span-2 flexbox'>
                        <input className='w-40 input'type='text' {...register(`items.${index}.name`)}/>
                        <span className='error'>{errors.items?.[index]?.name?.message}</span>
                    </div>
                    <div className='col-span-1 flexbox'>
                        <input type='number' className='input w-11' {...register(`items.${index}.quantity`)}
                        />
                        <span className='error'>{errors.items?.[index]?.quantity?.message}</span>
                    </div>
                    <div className='col-span-1 flexbox'>
                        <input type='text' className='input w-24' {...register(`items.${index}.price`)}
                        />
                        {
                           items?.[index]?.price!==null && (
                            <span className='error'>{errors.items?.[index]?.price?.message}</span>
)
                        }
                    </div>
                    <div className='col-span-1 self-center'>
                         <input type='number' className='input w-24' {...register(`items.${index}.total`)}
                         value={items?.[index]?.quantity * items?.[index]?.price || ''}
                          readOnly 
                          />
                      <span className='error'>{errors.items?.[index]?.total?.message}</span>
                    </div>
                    <div className='col-span-1 self-center' onClick={()=>deleteRow(index)}>
                       <Image src='./assets/icon-delete.svg' alt='delete' width={10} height={10}/>
                    </div>
               </div>
             ))
           }
          <button onClick={addRow} type='button'className='bg-[var(--bg-gray)] rounded-3xl border-none w-96 p-2 smallFont font-bold'>+ Add New Item</button>
      </section>
      <div className='flex items-center justify-between mt-6'>
          <button onClick={closeFormModal}className='bg-gray-100 rounded-3xl px-5 py-3 hover:bg-cyan-50 transition-all duration-300 text-[var(--color-dark-gray)]'>Discard</button>
          <div className='flex gap-3  justify-center items-center'>
              <button type='button'className='bg-[var(--color-black)] rounded-3xl px-5 py-3 hover:opacity-90 transition-all duration-300 text-[var(--color-dark-gray)]' onClick={()=>changeToDraft(invoice.id, invoice)} >Save as draft</button>
              <button type='submit' className='bg-[var(--color-dark-purple)] rounded-3xl px-5 py-3 hover:bg-[var(--color-light-purple)] transition-all duration-300 text-[var(--color-white)]'>Save & Send</button>
          </div>
      </div>
      </form> 
     </main> 
      </Modal>
      <SmallModal isOpen={isOpen}>
        <div className='flex flex-col items-start gap-2 mt-5'>
           <p className='text-2xl font-bold'>Confirm Deletion</p>
           <p className='smallFont'>Are you sure you want to delete invoice {invoice.id}? This action cannot be undone.</p>
           <div className='flex items-center justify-center gap-3 self-end mt-6'>
              <button onClick={closeModal} className='bg-gray-100 rounded-3xl px-5 py-3 hover:bg-cyan-50 transition-all duration-300'>Cancel</button>
              <button className='bg-[var(--color-dark-red)] rounded-3xl px-5 py-3 hover:bg-[var(--color-light-red)] transition-all duration-300' onClick={()=>handleDelete(invoice.id)}>Delete</button>
           </div>
        </div>   
      </SmallModal>
      <section className='w-10/12 bg-[var(--color-white)] rounded-lg p-6'>
            <div className='grid grid-cols-4'>
                 <div className='flex flex-col justify-center items-center gap-5'>
                    <div className='pb-4'>
                        <h4 className='font-bold'>#{invoice.id}</h4>
                        <span className='text-[var(--color-light-gray)] text-xs'>{invoice.description}</span>
                    </div>
                    <div>
                        <span className='text-[var(--color-light-gray)] text-xs'>invoice date</span>
                        <p className='font-bold'>{transformedDate}</p>
                    </div>
                    <div>
                       <span className='text-[var(--color-light-gray)] text-xs'>payment due</span>
                       <p className='font-bold'>{paymentDue}</p>
                    </div>
                  </div>
                 <div className='justify-self-center self-end'>
                      <span className='text-[var(--color-light-gray)] text-xs'>Bill to</span>
                      <h5 className='font-bold'>{invoice.clientName}</h5>
                      <p className='text-[var(--color-light-gray)] text-xs'>{invoice.clientAddress.street}</p>
                      <p className='text-[var(--color-light-gray)] text-xs'>{invoice.clientAddress.city}</p>
                      <p className='text-[var(--color-light-gray)] text-xs'>{invoice.clientAddress.postCode}</p>
                      <p className='text-[var(--color-light-gray)] text-xs'>{invoice.clientAddress.country}</p>
                 </div>
                 <div className='self-center justify-self-center'>
                      <span className='text-[var(--color-light-gray)] text-xs'>Sent to</span>
                      <p className='font-bold'>{invoice.clientEmail}</p>
                 </div>
                 <div className='self-start justify-self-center'>
                     <p className='text-[var(--color-light-gray)] text-xs'>{invoice.clientAddress.street}</p>
                     <p className='text-[var(--color-light-gray)] text-xs'>{invoice.senderAddress.city}</p>
                     <p className='text-[var(--color-light-gray)] text-xs'>{invoice.senderAddress.postCode}</p>
                     <p className='text-[var(--color-light-gray)] text-xs'>{invoice.senderAddress.country}</p>
                 </div>
            </div>
            <section className='grid grid-cols-5  mt-10 bg-[var(--bg-gray)] px-4 py-6'>
                    <div className='col-span-2 text-[var(--color-light-gray)] text-xs'>item name</div>
                    <div className='col-span-1 text-[var(--color-light-gray)] text-xs'>QTY</div>
                    <div className='col-span-1 text-[var(--color-light-gray)] text-xs'>Price</div>
                    <div className='col-span-1 text-[var(--color-light-gray)] text-xs'>total</div>
                    {invoice.items.map((itm:any, index)=>(
                      <div className='grid-rows-1' key={index}>
                         <p>{itm.name}</p>
                         <p>{itm.quantity}</p>
                         <p>{itm.price}</p>
                         <p>{itm.total}</p>
                      </div>
                    ))}
            </section>
            <div className='px-4 py-6 flex items-center justify-between bg-[var(--color-dark-blue)] rounded-md'>
                <p className='text-xs text-[var(--color-white)]'>Amount Due</p>
                <h2 className='text-2xl text-[var(--color-white)]'>£{invoice.total}</h2>
            </div>
      </section>
    </main>
         </div>
     </div>
  
        </>
    )}
    
    </>
  )
}

export default Page