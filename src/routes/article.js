import { useLoaderData } from 'react-router-dom';
import './root.css';
import axios from 'axios';

export async function loader({params}) {
  try {
    const res = await axios.get('/get_article/' + params.articleId);
    // console.log("a");
    // console.log(res.data);
    return res.data;
  } catch (error) {
    // console.log(error); // probably 404
    return null;
  }
}

export default function Article() {
  const article = useLoaderData();

  if (article == null) {
    
  }

  return (
    <div className="App">
      <h1>{article.title}</h1>
      <div>By: {article.author}</div>
      <p> {article.content} </p>
    </div>
  );
}
