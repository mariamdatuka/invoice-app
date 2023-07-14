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
    <div className='fixed inset-0 flex items-center justify-start bg-black bg-opacity-50 ml-24 '>
      <div className='bg-white w-2/5 h-screen p-4 rounded-md flex flex-col items-center overflow-y-auto'
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