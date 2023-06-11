import { useLoaderData } from 'react-router-dom';
import './root.css';
import axios, { AxiosError } from 'axios';

export async function loader({params}) {
  const res = await axios.get('/get_article/' + params.articleId);
  // console.log(res.data);
  return res.data;
}

export default function Article() {
  const article = useLoaderData();

  return (
    <div className="App">
      <h1>{article.title}</h1>
      <div>By: {article.author}</div>
      <p> {article.content} </p>
    </div>
  );
}
