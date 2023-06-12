import { useLoaderData } from 'react-router-dom';
import './root.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { AppBar, Box, Button, Container, Toolbar, Typography, TextField } from '@mui/material';
import { NavBar } from './shared';

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

function CommentSection({article_id}) {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");

  async function refreshComments() {
      const com = await fetchComments(article_id);
      setComments(com);
  }

  useEffect(()=>{
    refreshComments();
  },[article_id]);

  const submitComment = () => {
    const temp = async () => {
      const token = JSON.parse(sessionStorage.getItem('access_token'));
      console.log(token);
      const res = await axios.post('/post_comment', {article_id: article_id, content: newCommentText},{
        headers:{
          'Authorization': 'Bearer '+token,
          'Content-Type': 'application/json'
        }
      });
      
      refreshComments();
    }
    temp();
  }

  return (
    <div>
      <h2>Comments</h2>
      <TextField onChange={(event)=>setNewCommentText(event.target.value)} />
      <Button onClick={submitComment}>Submit</Button>
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

  return (
    <div >
      <NavBar />
      <Container>
        <h1>{article.title}</h1>
        <div>By: {article.author}</div>
        <p> {epochToString(article.creation_date)} </p>
        <p> {article.content} </p>
        <CommentSection article_id={article.article_id} />
      </Container>
    </div>
  );
}
