import { Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";

function getToken() {
  const token = sessionStorage.getItem('access_token');
  return token;
} 

async function login(username, password, successCallback) {
  // console.log(username+" "+password);
  try {
    const res = await axios.post('/login', {username: username, password: password});
    sessionStorage.setItem('access_token', JSON.stringify(res.data.access_token));
    console.log("Login success");
    successCallback();
  } catch (error) {
    console.log("Failed login: "+error);
  }
}

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  return (
    <div className='Center'>

      <TextField label='Username' onChange={(event)=>setUser(event.target.value)} />
      <TextField label='Password' onChange={(event)=>setPass(event.target.value)} />
      <Button variant='contained' onClick={()=>login(user, pass, ()=>navigate(-1))} >Submit</Button>
      <Typography>Don't have an account?</Typography>
      <Button variant='contained'>Sign up</Button>
    </div>
  );
}