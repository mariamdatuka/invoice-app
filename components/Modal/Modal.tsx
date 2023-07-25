import React from "react";

interface Props{
    isOpen:boolean;
    children:React.ReactNode;
}

const Modal = ({isOpen,children}:Props) => {
  return (
   <>
    {
     isOpen && <>
    <div className='fixed inset-0 flex items-center justify-center sm:justify-start bg-black bg-opacity-50 lg:ml-24 '>
      <div className='bg-white w-full sm:w-4/5 lg:w-2/5 h-screen p-2 md:p-4 rounded-md flex flex-col items-center justify-center overflow-y-auto'
>
          {children}
      </div>
    </div>
  </>
    }
      
    </>
  )
}

export default Modal