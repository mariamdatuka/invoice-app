import React from "react";

interface Props{
    isOpen:boolean;
    children:React.ReactNode;
    className?:string;
    divClassName?: string;
}

const Modal = ({isOpen,children,className, divClassName}:Props) => {
  return (
   <>
    {
     isOpen && <>
    <div className={`fixed inset-0 flex items-center justify-start bg-black bg-opacity-50 ml-24 ${className}`}>
      <div className={`bg-white w-2/5 h-screen p-4 rounded-md flex flex-col items-center overflow-y-auto ${divClassName}`}
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