import { Button, TextField, Container, Stack } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

async function signup(username, password) {
  // console.log(username+" "+password);
  try {
    const res = await axios.post('/create_user', {username: username, password: password});
    console.log("Signup success");
    return true;
  } catch (error) {
    console.log("Failed signup: "+error);
    console.log(error);
    return false;
  }
}

export default function Signup() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const onButtonClick = async () => {
    const success = await signup(user, pass);
    if (success) {
      navigate(-1);
    } else {
      setErr(true);
    }
  }

  return (
    <div>
      <Container >
        <Stack marginTop={4} spacing={1} alignItems='center' >
          <TextField 
            error={err} 
            autoFocus 
            label='Username' 
            onChange={(event)=>{setUser(event.target.value);setErr(false)}} 
          />
          <TextField 
            error={err} 
            label='Password' 
            type='password' 
            onChange={(event)=>{setPass(event.target.value);setErr(false)}} 
          />
          <Button variant='contained' onClick={()=>onButtonClick()} >Create account</Button>
        </Stack>
      </Container>
    </div>
  );
}