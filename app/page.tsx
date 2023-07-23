import Header from "@/components/header/Header"
import List from "@/components/list/List"

export default function Home() {

  return (
    <>
     <div className='grid grid-cols-1 md:grid-cols-4'>
         <div className='col-span-1'>
              <Header/>
         </div>
         <div className='p-6 col-span-1 md:col-span-3 md:pt-9 md:pr-16'>
               <List/>
         </div>
     </div>
    
    </>
  )
}
