import React, {useState} from 'react'
import data from '../../data.json'
import Image from 'next/image'
import Filter from '../Filter/Filter'

const List = () => {

  const [selectedStatus, setSelectedStatus]=useState<string>('');

  const filteredList=(e:any)=>{
       const value=e.target.value;
       const newArray=data.filter((arr)=>(value===arr.status));
       return newArray;
  }

  return (
    <>
       <Filter/>
       <section className='flex flex-col gap-3 mt-12'>
           {data.map((item:any)=>(
             <main className='flex gap-3 bg-[var(--color-white)] p-5 rounded-lg items-center justify-around h-16'>
                 <p className='text-lg text-[var(--color-black)] font-bold'>#{item.id}</p>
                 <p className='text-md text-[var(--color-light-gray)]'>{item.paymentDue}</p>
                 <p className='text-md text-[var(--color-dark-gray)]'>{item.clientName}</p>
                 <p className='font-bold text-[var(--color-black)] text-lg'>£{item.total}</p>
                 <div className={`status-${item.status.toLowerCase()} text-md`}>{item.status}</div>
                 <Image src='./assets/icon-arrow-right.svg' alt='arrowRight' width={7} height={7}/>
             </main>
           ))}
       </section>
    </>
  )
}

export default List