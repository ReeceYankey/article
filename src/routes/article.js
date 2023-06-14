import { useLoaderData, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Box, Button, Container, Typography, TextField, Stack, Divider } from '@mui/material';
import { NavBar } from './shared';
import { formatArticleDate, formatCommentDate } from './shared';

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


function CommentSection({article_id}) {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const navigate = useNavigate();

  async function refreshComments() {
      const com = await fetchComments(article_id);
      setComments(com);
  }

  useEffect(()=>{ // only runs on initial page load
    refreshComments();
  },[article_id]);

  const submitComment = () => {
    const temp = async () => {
      const token = sessionStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }
      console.log(token);
      const res = await axios.post('/post_comment', {article_id: article_id, content: newCommentText},{
        headers:{
          'Authorization': 'Bearer '+token,
          'Content-Type': 'application/json'
        }
      });

      setNewCommentText("");
      refreshComments();
    }
    temp();
  }

  return (
    <div>
      <h2>Comments</h2>
      <Stack direction='row'>
        <TextField sx={{flexGrow:1}} multiline value={newCommentText} onChange={(event)=>setNewCommentText(event.target.value)} />
        <Button sx={{flexGrow:0}} onClick={submitComment}>Submit</Button>
      </Stack>
      <Stack marginY={1} spacing={1}>
        {comments && comments.map((comment, index)=>{
          return <Box paddingX={1} key={index} sx={{wordWrap: 'break-word'}} maxWidth='100%'>
            {/* <p>{comment.author} - {comment.content}</p> */}
            <Typography><b>{comment.author}</b></Typography>
            <Typography color='GrayText'>{formatCommentDate(comment.creation_date)}</Typography>
            <Typography mb={1}>{comment.content}</Typography>
            <Divider />
          </Box>;
        })}

      </Stack>
    </div>
  );
}


export default function Article() {
  const article = useLoaderData();
  const paragraphs = article.content.split("\n");

  return (
    <div >
      <NavBar />
      <Container  maxWidth='sm' >
        <Typography marginTop={4} fontSize={40} variant='h1'>{article.title}</Typography>
        <Typography marginTop={1} color='GrayText' >Author: {article.author}</Typography>
        <Typography color='GrayText'>{formatArticleDate(article.creation_date)}</Typography>
        <Stack spacing={2}>
          {paragraphs.map((paragraph, index)=>{
            return (
              <Typography key={index} marginTop={1} fontSize={20} variant='body1'>{paragraph}</Typography>
            );
          })}
        </Stack>
        <CommentSection article_id={article.article_id} />
      </Container>
    </div>
  );
}
