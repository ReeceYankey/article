import { Button, TextField, Typography, Container, Stack } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";

async function login(username, password) {
  // console.log(username+" "+password);
  try {
    const res = await axios.post('/login', {username: username, password: password});
    sessionStorage.setItem('access_token', JSON.stringify(res.data.access_token));
    sessionStorage.setItem('username', JSON.stringify(res.data.username));
    console.log("Login success");
    return true;
  } catch (error) {
    console.log("Failed login: "+error);
    return false;
  }
}

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const onButtonClick = async () => {
    const success = await login(user, pass);
    if (success) {
      navigate(-1);
    } else {
      setErr(true);
    }
  }

  return (
    <div>
      <Stack marginTop={4} spacing={1} alignItems='center' >
        <TextField error={err} autoFocus label='Username' onChange={(event)=>{setUser(event.target.value);setErr(false)}} />
        <TextField error={err} label='Password' onChange={(event)=>{setPass(event.target.value);setErr(false)}} />
        <Button variant='contained' onClick={()=>onButtonClick()} >Submit</Button>
        <Typography >Don't have an account?</Typography>
        <Button href="/signup" variant='contained'>Sign up</Button>
      </Stack>
    </div>
  );
}