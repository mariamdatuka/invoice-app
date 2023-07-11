'use client'
import React, {useState,useEffect} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Modal from '../Modal/Modal'
import { useForm,Resolver } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { useDispatch} from 'react-redux';
import { AppDispatch } from '@/store/store'
import { useAppSelector } from '@/store/store'
import { fetchInvoicesAsync } from '@/store/reducers/invoiceSlice'
import { Invoice } from '@/types'

interface Item {
  name: string;
  price: number;
  quantity: number;
  total: number;
}[]

const List = () => {
 /*
  
  const [totalInvoices, setTotalInvoices]=useState(null);
  */
  const [selectedStatus, setSelectedStatus]=useState<string>('');
  const [filteredList, setFilteredList]=useState([]);
  const [isOpen, setIsOpen]=useState<boolean>(false);
  const [rows,setRows]=useState<Item[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const invoices = useAppSelector((state) => state.invoices.invoices);
  const loading = useAppSelector((state) => state.invoices.loading);
  const error = useAppSelector((state) => state.invoices.error)

useEffect(()=>{
  dispatch(fetchInvoicesAsync());
}, [])

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
      name: Yup.string().required('Item Name is required'),
      quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
      price: Yup.number().required('Price is required').min(0, 'Price must be a positive number'),
      total: Yup.number().required('Total is required').min(0, 'Total must be a positive number'),
    })
  ),

  
});

const resolver: Resolver<Invoice> = yupResolver(schema);
const {register,handleSubmit, formState:{errors},setValue, watch}=useForm({
  mode:'onBlur',
  resolver,
  defaultValues:{
    id:'',
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

const items = watch('items');


const onSubmit = (data:any) => {
  console.log(data);
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
  
  const handleChange=(e:any)=>{
       setSelectedStatus(e.target.value)
  }
  
  const filteredArray=(data:any,selectedStatus:string)=>{
      if(selectedStatus===''){
        return data;
      } else{
         return data.filter((item:any)=>item.status===selectedStatus)
      }
  }
  const openModal=()=>{
    setIsOpen(true)
  }
  const closeModal=()=>{
    setIsOpen(false);
  }
   //calculate total invoices
  /* const totalNum=(data:any)=>{
       const total=data.length;
       setTotalInvoices(total);
   }
*/
   useEffect(()=>{
    const filtered=filteredArray(invoices, selectedStatus);
    setFilteredList(filtered);
    
},[selectedStatus]);


  return (
    <>
  <section className='flex items-center justify-between'>
    <div className='flex flex-col gap-2'>
         <h1 className='text-4xl font-bold'>Invoices</h1>
         <p className='text-[var(--color-dark-gray)] text-xs'>There are total  invoices</p>
    </div>
  <div className='flex justify-center items-center gap-3'> 
    <div className="relative inline-block">
  <select
    className="block appearance-none bg-white pl-3 pr-8 py-2 text-gray-900 rounded-md leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    onChange={handleChange}
  > 
    <option value="">
      Filter by status
    </option>
    <option value="paid">Paid</option>
    <option value="pending">Pending</option>
    <option value="unpaid">Unpaid</option>
  </select>
  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
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
        <p className='text-[var(--color-light)]'>New invoice</p>
    </button>
    <Modal isOpen={isOpen}>
      <main>
        <h2 className='font-bold text-2xl'>New Invoice</h2>
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
             <input className='input w-28'type='number' {...register('senderAddress.postCode')}/>
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
             <input className='input w-28'type='number' {...register('clientAddress.postCode')}/>
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
                    <div className='col-span-2'>
                        <input className='w-40 input'type='text'/>
                        <span className='error'>{errors.items?.[index]?.name?.message}</span>
                    </div>
                    <div className='col-span-1'>
                        <input type='number' className='input w-11' {...register(`items.${index}.quantity`)}
                        />
                        <span className='error'></span>
                    </div>
                    <div className='col-span-1'>
                        <input type='text' className='input w-24' {...register(`items.${index}.price`)}
                        />
                    </div>
                    <div className='col-span-1 self-center'>
                         <input type='number' className='input w-24' {...register(`items.${index}.total`)}
                         value={items?.[index]?.quantity * items?.[index]?.price || ''}
                          readOnly 
                          />
                    </div>
                    <div className='col-span-1 self-center' onClick={()=>deleteRow(index)}>
                       <Image src='./assets/icon-delete.svg' alt='delete' width={10} height={10}/>
                    </div>
               </div>
             ))
           }
          <button onClick={addRow} className='bg-[var(--bg-gray)] rounded-3xl border-none w-96 p-2 smallFont font-bold'>+ Add New Item</button>
      </section>
      <div className='flex items-center justify-between mt-6'>
          <button  onClick={closeModal}className='bg-gray-100 rounded-3xl px-5 py-3 hover:bg-cyan-50 transition-all duration-300 text-[var(--color-dark-gray)]'>Discard</button>
          <div className='flex gap-3  justify-center items-center'>
              <button className='bg-[var(--color-black)] rounded-3xl px-5 py-3 hover:opacity-90 transition-all duration-300 text-[var(--color-dark-gray)]'>Save as draft</button>
              <button className='bg-[var(--color-dark-purple)] rounded-3xl px-5 py-3 hover:bg-[var(--color-light-purple)] transition-all duration-300 text-[var(--color-white)]'>Save & Send</button>
          </div>
      </div>
      </form> 
     </main>    
    </Modal>
    </div>
 </section>
       <section 
             className='flex flex-col gap-3 mt-12'>
           {filteredList?.map((item:any)=>(
           <Link key={item.id} href={`/invoice/${item.id}`}> 
             <main className='flex gap-3 bg-[var(--color-white)] p-5 rounded-lg items-center justify-around h-16'>
                 <p className='text-lg text-[var(--color-black)] font-bold'>#{item.id}</p>
                 <p className='text-md text-[var(--color-light-gray)]'>{item.paymentDue}</p>
                 <p className='text-md text-[var(--color-dark-gray)]'>{item.clientName}</p>
                 <p className='font-bold text-[var(--color-black)] text-lg'>£{item.total}</p>
                 <div className={`status-${item.status.toLowerCase()} text-md`}>{item.status}</div>
                 <Image src='./assets/icon-arrow-right.svg' alt='arrowRight' width={7} height={7}/>
             </main>
          </Link>
           ))}
       </section>
    </>
  )
}

export default List