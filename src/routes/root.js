import { useLoaderData } from 'react-router-dom';
import './root.css';
import axios from 'axios';

export async function loader(){
  const res = await axios.get('/list_articles')
  // console.log(res.data);
  return res.data;
}


export default function Root() {
  const data = useLoaderData();

  return (
    <div className="App">
      {data.map((e, index)=>{
        return <div key={index}>
          <p>{e.title} - {e.author} - {e.article_id}</p>
        </div>;
      })}
    </div>
  );
}

