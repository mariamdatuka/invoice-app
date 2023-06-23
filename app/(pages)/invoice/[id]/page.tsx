import data from '../../../../data.json'
import Image from 'next/image';

type Props = {
    params: {
      id: string;
    };
  };

const Page = ({params}:Props) => {
    
const {id}=params
const invoice=data.find((inv)=>inv.id===id);
 
  return (
    <>
    <main className='flex flex-col items-center'>
      <button className='flex gap-3 justify-center items-center'>
          <Image src='../../../../assets/icon-arrow-left.svg' alt='arrowleft' width={7} height={7}/>
          <p>Go back</p>
      </button>
      <section className='w-10/12 flex items-center justify-between bg-[var(--color-white)] rounded-lg p-6' >
         <div className='flex gap-2 justify-center items-center'>
             <p className='text-[var(--color-dark-gray)] text-xs'>Status</p>
             <div className={`status-${invoice?.status.toLowerCase()} text-md`}>{invoice?.status}</div>
         </div>
         <div className='flex justify-center items-center gap-3'>
             <button className='bg-gray-100 rounded-3xl px-5 py-3'>Edit</button>
             <button className='bg-[var(--color-dark-red)] rounded-3xl px-5 py-3'>Delete</button>
             <button className='bg-[var(--color-dark-purple)] rounded-3xl px-5 py-3'>Mark as Paid</button>
         </div>
      </section>
    </main>
    </>
  )
}

export default Page