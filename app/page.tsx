import Header from "@/components/header/Header"
import List from "@/components/list/List"

export default function Home() {

  return (
    <>
     <div className='grid grid-cols-1 lg:grid-cols-4'>
         <div className='col-span-1'>
              <Header/>
         </div>
         <div className='p-6 col-span-1 lg:col-span-3 lg:pt-9 lg:pr-16'>
               <List/>
         </div>
     </div>
    
    </>
  )
}
