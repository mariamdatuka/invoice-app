import Image from "next/image"

const Filter = () => {
  return (
    <>
 <main className='flex items-center justify-between'>
    <div className='flex flex-col gap-2'>
         <h1 className='text-4xl font-bold'>Invoices</h1>
         <p className='text-[var(--color-dark-gray)] text-xs'>There are total 7 invoices</p>
    </div>
  <div className='flex justify-center items-center gap-3'> 
    <div className="relative inline-block">
  <select
    className="block appearance-none bg-white pl-3 pr-8 py-2 text-gray-900 rounded-md leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
    <button className='h-12 bg-[var(--color-dark-purple)] p-4 rounded-3xl flex gap-2 items-center justify-center hover:bg-[var(--color-light-purple)] transition ease-in-out duration-700'>   
        <div className=' bg-slate-50 rounded-full w-6 h-6 flex justify-center items-center'>
           <Image src='/assets/icon-plus.svg' alt='plus' width={10} height={10}/>
        </div>
        <p className='text-[var(--color-light)]'>New invoice</p>
    </button>
    </div>
 </main>
    </>
  )
}

export default Filter