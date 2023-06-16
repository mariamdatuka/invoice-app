import Filter from "@/components/Filter/Filter"
import Header from "@/components/header/Header"

export default function Home() {
  return (
    <>
     <div className='grid grid-cols-1 md:grid-cols-4'>
         <div className='col-span-1'>
              <Header/>
         </div>
         <div className='col-span-1 md:col-span-3 pt-9 pr-16'>
             <Filter/>
         </div>
     </div>
    
    </>
  )
}
