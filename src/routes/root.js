import { useLoaderData } from 'react-router-dom';
import axios from 'axios';
import { NavBar, getDate } from './shared';
import { Box, Stack, Container, Typography, Link, Paper } from "@mui/material"

export async function loader(){
  const res = await axios.get('/list_articles')
  // console.log(res.data);
  return res.data;
}


function ArticleCard({article}) {
  return (
    <Paper variant='outlined'>
      <Box padding={1} >
        <Link href={'article/'+article.article_id}>{article.title}</Link>
        <Stack direction='row'>
          <Typography sx={{flexGrow:1}} color='GrayText'>{article.author}</Typography>
          <Typography sx={{flexGrow:0}} color='GrayText'>{getDate(article.creation_date)}</Typography>
        </Stack>
      </Box>
    </Paper>
  );
}

export default function Root() {
  const articles = useLoaderData();

  return (
    <div>
      <NavBar />
      <Container maxWidth='sm'>
        <Stack mt={1} spacing={1}>
          {articles.map((article, index)=>{
            return <ArticleCard key={index} article={article} />
          })}
        </Stack>
      </Container>

    </div>
  );
}

