import data from '../../../../data.json'

type Props = {
    params: {
      id: string;
    };
  };

const Page = ({params}:Props) => {
    
const {id}=params
const invoice=data.find((inv)=>inv.id===id);
 
  return (
    <>
      <div>{invoice?.id}blabla</div>
    </>
  )
}

export default Page