'use client'
import React, {useState,useEffect} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Modal from '../Modal/Modal'
import { useForm} from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { useDispatch} from 'react-redux';
import { AppDispatch } from '@/store/store'
import { useAppSelector } from '@/store/store'
import { fetchInvoicesAsync,addInvoiceAsync} from '@/store/reducers/invoiceSlice'
import { Invoice} from '@/types'

interface Item {
  name: string;
  price: number;
  quantity: number;
  total: number;
}[]

const List = () => {
  const [selectedStatus, setSelectedStatus]=useState<string>('');
  const [isOpen, setIsOpen]=useState<boolean>(false);
  const [rows,setRows]=useState<Item[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const invoices = useAppSelector((state) => state.invoices.invoices);

  //calculate total price of all items array of objects
  const calculateTotal=(items:Item[])=>{
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

const filteredInvoices = selectedStatus === '' ? invoices : invoices.filter(item => item.status === selectedStatus);
const totalInvoices = filteredInvoices.length;

 useEffect(()=>{
  dispatch(fetchInvoicesAsync())  
},[selectedStatus,invoices,dispatch]);

  const openModal=()=>{
    setIsOpen(true)
  }
  const closeModal=()=>{
    setIsOpen(false);
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
   items: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('required'),
      quantity: Yup.number().required('required').min(1, 'min 1').nullable().transform((value) => Number.isNaN(value) ? null : value ),
      price: Yup.number().required('required').min(1, 'must be a positive number').nullable().transform((value) => Number.isNaN(value) ? null : value ),
      total: Yup.number().required('required'),
    })
  ),
});

//GENERATE UNIQUE ID FOR NEW INVOICE
const generateID:any=()=>{
  const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetters=Array.from({length:2},()=>letters[Math.floor(Math.random()*letters.length)]);
  const randomNumbers=Array.from({length:4},()=>Math.floor(Math.random()*9));

  return `${randomLetters.join("")}${randomNumbers.join("")}`;
}

const {register,handleSubmit, formState:{errors},watch,reset,getValues}=useForm({
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
     ]|| [],
  }
})

const items:any = watch('items');
const onSubmit = (data:any) => {
  const total=calculateTotal(items)
  const generatedId = generateID();
  const invoiceWithId = { ...data, id: generatedId, total };
  dispatch(addInvoiceAsync(invoiceWithId));
  reset();
  closeModal();
};
//add new object as a row in items array
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
  
  const handleChange=(e:any)=>{
       setSelectedStatus(e.target.value)
  }
 
  //add invoice without validations
  const saveDraft=()=>{
    const data=getValues();
    const total=calculateTotal(items)
    const generatedId = generateID();
    const invoiceWithId = { ...data, id: generatedId, total, status:'draft' };
    dispatch(addInvoiceAsync(invoiceWithId));
    reset();
    closeModal();
  }

  return (
    <>
  <section className='flex items-center justify-between'>
    <div className='flex flex-col gap-2'>
         <h1 className='text-xl sm:text-4xl font-bold'>Invoices</h1>
         <p className='text-[var(--color-dark-gray)] text-xs'>There are total {totalInvoices}  invoices</p>
    </div>
  <div className='flex justify-center items-center gap-3'> 
    <div className="relative inline-block">
  <select
    className="block appearance-none bg-transparent pl-3 pr-8 py-2 text-gray-900 rounded-md leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    onChange={handleChange}
  > 
    <option value="">
      Filter{window.innerWidth < 640 ? '' : 'by status'}
    </option>
    <option value="paid">paid</option>
    <option value="pending">pending</option>
    <option value="draft">draft</option>
  </select>
  <div className="absolute inset-y-0 right-0 flex items-center pr-5 sm:pr-2 pointer-events-none">
    <svg
      className="w-4 h-4 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </div>
</div>
    <button onClick={openModal} className='h-12 bg-[var(--color-dark-purple)] p-4 rounded-3xl flex gap-2 items-center justify-center hover:bg-[var(--color-light-purple)] transition ease-in-out duration-700'>   
        <div className=' bg-slate-50 rounded-full w-6 h-6 flex justify-center items-center'>
           <Image src='/assets/icon-plus.svg' alt='plus' width={10} height={10}/>
        </div>
        <p className='text-[var(--color-light)]'>New {window.innerWidth<640?'':'Invoice'}</p>
    </button>
    <Modal isOpen={isOpen}>
      <main>
        <h2 className='font-bold text-2xl'>New Invoice</h2>
      <form onSubmit={handleSubmit(onSubmit)}> 
      <section className='flex flex-col gap-5 mt-2'>   
        <p className='text-[var(--color-dark-purple)] font-bold text-xs'>bill from</p>
        <div className='flexbox'>
          <label className='label'>Street Address</label>
          <input className='input w-72 sm:w-96'type='text' {...register('senderAddress.street')}/>
          <span className='error'>{errors.senderAddress?.street?.message}</span>
        </div>
       <div className='flex gap-6 items-center justify-start'>
          <div className='flexbox'>
             <label className='label'>City</label>
             <input className='input w-20 sm:w-28'type='text' {...register('senderAddress.city')}/>
             <span className='error'>{errors.senderAddress?.city?.message}</span>
          </div>
          <div className='flexbox'>
             <label className='label'>Post Code</label>
             <input className='input w-20 sm:w-28'type='text' {...register('senderAddress.postCode')}/>
             <span className='error'>{errors.senderAddress?.postCode?.message}</span>
          </div>
          <div className='flexbox'>
             <label className='label'>Country</label>
             <input className='input w-20 sm:w-28'type='text' {...register('senderAddress.country')}/>
             <span className='error'>{errors.senderAddress?.country?.message}</span>
          </div>
        </div>
       </section> 
     <section className='flex flex-col gap-5 mt-6'>
       <p className='text-[var(--color-dark-purple)] font-bold text-xs'>bill to</p>
        <div className='flexbox'>
          <label className='label'>Client's Name</label>
          <input className='input w-72 sm:w-96'type='text' {...register('clientName')}/>
          <span className='error'>{errors.clientEmail?.message}</span>
        </div>
        <div className='flexbox'>
          <label className='label'>Client's Email</label>
          <input className='input w-72 sm:w-96'type='email' {...register('clientEmail')}/>
          <span className='error'>{errors.clientEmail?.message}</span>
        </div>
        <div className='flexbox'>
          <label className='label'>Street Address</label>
          <input className='input w-72 sm:w-96'type='text'{...register('clientAddress.street')}/>
          <span className='error'>{errors.clientAddress?.street?.message}</span>
        </div>
       <div className='flex gap-6 items-center justify-start'>
          <div className='flexbox'>
             <label className='label'>City</label>
             <input className='input w-20 sm:w-28'type='text' {...register('clientAddress.city')}/>
             <span className='error'>{errors.clientAddress?.city?.message}</span>
          </div>
          <div className='flexbox'>
             <label className='label'>Post Code</label>
             <input className='input w-20 sm:w-28'type='text' {...register('clientAddress.postCode')}/>
             <span className='error'>{errors.clientAddress?.postCode?.message}</span>
          </div>
          <div className='flexbox'>
             <label className='label'>Country</label>
             <input className='input w-20 sm:w-28'type='text' {...register('clientAddress.country')}/>
             <span className='error'>{errors.clientAddress?.country?.message}</span>
          </div>
       </div>
       <div className='flex gap-6 items-center justify-start'>
           <div className='flexbox'>
              <label className='label'>Invoice Date</label>
              <input className='input w-36 sm:w-44'type='date'{...register('createdAt')}/>
              <span className='error'>{errors.createdAt?.message}</span>
           </div>
           <div className='flexbox'>
              <label className='label'>Payment terms</label>
              <select className='w-36 sm:w-44 input' {...register('paymentDue')}>
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
             <input className='input w-72 sm:w-96'type='text' placeholder='e.g Graphic design service'
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
                        <input className='w-36 sm:w-40 input'type='text' {...register(`items.${index}.name`)}/>
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
          <button onClick={addRow} type='button'className='bg-[var(--bg-gray)] rounded-3xl border-none w-64 md:w-96 p-2 smallFont font-bold'>+ Add New Item</button>
      </section>
      <div className='flex items-center justify-between mt-6'>
          <button onClick={closeModal}className='bg-gray-100 rounded-3xl px-3 md:px-5 py-3 hover:bg-cyan-50 transition-all duration-300 text-[var(--color-dark-gray)]'>Discard</button>
          <div className='flex gap-3  justify-center items-center'>
              <button onClick={saveDraft}type='button'className='bg-[var(--color-black)] rounded-3xl px-3 md:px-5 py-3 hover:opacity-90 transition-all duration-300 text-[var(--color-dark-gray)]'>Save as draft</button>
              <button type='submit' className='bg-[var(--color-dark-purple)] rounded-3xl px-3 md:px-5 py-3 hover:bg-[var(--color-light-purple)] transition-all duration-300 text-[var(--color-white)]'>Save & Send</button>
          </div>
      </div>
      </form> 
     </main>    
    </Modal>
    </div>
 </section>
       <section className='flex flex-col gap-3 mt-12'>
           {
            filteredInvoices.map((item:Invoice,index:any)=>( 
            <Link key={index} href={`/invoice/${item.id}`}>
                  <div  className='grid grid-cols-2 sm:grid-cols-6 place-items-center bg-[var(--color-white)] rounded-lg p-5 border-2 border-transparent hover:border-[var(--color-dark-purple)] transition border-solid duration-300'>
                 <p className='font-bold col-span-1 sm:order-1'>#{item.id}</p>
                 <p className='smallFont col-span-1 sm:order-3'>{item.clientName}</p>
                 <p className='smallFont col-span-1 self-end sm:order-2 sm:self-center'>{item.createdAt}</p>
                 <div className={`status-${item.status} btnBox font-bold col-span-1 sm:order-6`}>
                     <div className={`circle bg-${item.status}`}></div>
                     <p>{item.status}</p>
                 </div>
                 <Image className='hidden sm:block col-span-1 justify-self-start ml-5 sm:order-7'src='/assets/icon-arrow-right.svg' alt='arrowright' width={7} height={7}/>
                 <p className='font-bold col-span-1 sm:order-5'>${item.total}</p>
            </div>
            </Link>
           
            ))
           }
           
       </section>
    </>
  )
}

export default List