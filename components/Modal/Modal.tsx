import React from "react";

interface Props{
    isOpen:boolean;
    onClose:()=>void;
    children:React.ReactNode
}

const Modal = ({isOpen,onClose,children}:Props) => {
  return (
   <>
    {
     isOpen && <>
    <div className="fixed inset-0 flex items-center justify-start bg-black bg-opacity-50 ml-24">
      <div className='bg-white w-2/4 h-screen p-4 rounded-md'>
          {children}
        <button onClick={onClose}>Close Modal</button>
      </div>
    </div>
  </>
    }
      
    </>
  )
}

export default Modal