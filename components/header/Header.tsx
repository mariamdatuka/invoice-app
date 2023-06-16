import Image from 'next/image';


const header = () => {
  return (
    <>
      <div className='rounded-r-xl p-4 w-screen h-16 md:w-24 md:h-screen bg-[var(--color-dark-blue)]'>
        <Image src='/assets/icon-moon.svg' alt='moon' width={15} height={15} />
      </div>
    </>
  )
}

export default header