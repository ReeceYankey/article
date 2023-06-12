import { useLoaderData } from 'react-router-dom';
import './root.css';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

export async function loader({params}) {
  const res = await axios.get('/get_article/' + params.article_id);
  // console.log(res.data);
  return res.data;
}

async function fetchComments(article_id) {
  const res = await axios.post('/get_comments', {article_id: article_id});
  console.log(res.data);
  return res.data;
}

function epochToString(seconds) {
  return (new Date(seconds*1000)).toDateString();
}

function CommentSection({comments}) {
  return (
    <div>
      <h2>Comments</h2>
      {comments && comments.map((comment, index)=>{
        return <div key={index}>
          <p>{comment.author} - {comment.content}</p>
        </div>;
      })}
    </div>
  );
}

export default function Article() {
  const article = useLoaderData();
  const [comments, setComments] = useState([]);

  useEffect(()=>{
    const temp = async () => {
      const com = await fetchComments(article.article_id);
      setComments(com);
    }
    temp();
  },[]);

  return (
    <div className="App">
      <h1>{article.title}</h1>
      <div>By: {article.author}</div>
      <p> {epochToString(article.creation_date)} </p>
      <p> {article.content} </p>
      <CommentSection comments={comments}/>
    </div>
  );
}
