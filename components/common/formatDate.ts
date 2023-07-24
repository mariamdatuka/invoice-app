
export const formatDate=(dateString:any)=>{
   const date=new Date(dateString);
   const day=date.getDate();
   const month=date.toLocaleString('default', {month:'short'})
   const year=date.getFullYear();

   return  `${day} ${month} ${year}`;
}

