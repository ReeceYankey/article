import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { useState } from "react";

export function getDate(seconds) {
  return (new Date(seconds*1000)).toLocaleDateString();
}

export function getTime(seconds) {
  return (new Date(seconds*1000)).toLocaleString(undefined, {year:"numeric", month:"numeric", day:"numeric", "hour":"numeric", minute:"numeric"});
}

export function NavBar() {
  const [username, setUsername] = useState(JSON.parse(sessionStorage.getItem('username')));

  function logOutClicked() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('access_token');
    setUsername();
    // TODO send logout to backend so it can blacklist token
  }
  
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{flexGrow:1}}>
          <Typography variant='h6' component='a' href="/" 
            sx={{
              mr:2,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Home
          </Typography>
        </Box>
        <Box sx={{flexGrow:0}}>
          {!username && 
            <Typography variant='h6' component='a' href="/login" 
              sx={{
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Log in
            </Typography>
          }
          {username && 
            <Box display='flex'>
              <Typography variant='h6' sx={{mr:3, flexGrow:0}}>
                Hello {username}!
              </Typography>
              <Typography variant='h6' onClick={logOutClicked}
                sx={{
                  flexGrow:0,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                Log out
              </Typography>
            </Box>
          }
        </Box>
      </Toolbar>
    </AppBar>
  );
}