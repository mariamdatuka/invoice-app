'use client'

import data from '../../../../data.json'
import Image from 'next/image';
import { formatDate } from '@/components/common/formatDate';
import { useRouter } from 'next/navigation';

type Props = {
    params: {
      id: string;
    };
  };

const Page = ({params}:Props) => {

  const router=useRouter();
    
const {id}=params
const invoice=data.find((inv)=>inv.id===id);

const transformedDate= invoice && formatDate(invoice.createdAt)
const paymentDue=invoice && formatDate(invoice.paymentDue)
 
  return (
    <>
    {invoice && (
        <>
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
             <button className='bg-gray-100 rounded-3xl px-5 py-3 hover:bg-cyan-50 transition-all duration-300'>Edit</button>
             <button className='bg-[var(--color-dark-red)] rounded-3xl px-5 py-3 hover:bg-[var(--color-light-red)] transition-all duration-300'>Delete</button>
             <button className='bg-[var(--color-dark-purple)] rounded-3xl px-5 py-3 hover:bg-[var(--color-light-purple)] transition-all duration-300'>Mark as Paid</button>
         </div>
      </section>
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
                    {invoice.items.map((itm)=>(
                      <div className='grid-rows-1' key={invoice.id}>
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
        </>
    )}
    
    </>
  )
}

export default Page