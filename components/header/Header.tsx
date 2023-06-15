import Image from 'next/image';


const header = () => {
  return (
    <>
      <div className='w-24 h-screen bg-[var(--color-dark-blue)]  rounded-r-xl p-4'>
        <Image src='/assets/icon-moon.svg' alt='moon' width={15} height={15} />
      </div>
    </>
  )
}

export default header