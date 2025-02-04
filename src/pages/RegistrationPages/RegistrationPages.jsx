// components/Login.js
'use client'
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, useMediaQuery, useTheme,CircularProgress,Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import AlertFunction from '@/components/AlertFunction/AlertFunction';
import axios from 'axios';
import Image from 'next/image';
import registerIcon from "../../../public/icon/register.png";



export default function RegistrationPages() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const handleRegist = async () => {
    const param = {
      name: name,
      email: email,
      password: password
    };
    setLoading(true);
    if(name == ""){
      AlertFunction("The name is empty", "Name must be filled in", "warning");
      setLoading(false);
    }else if(email == ""){
      AlertFunction("The email is empty", "Email must be filled in", "warning");
      setLoading(false);
    }else if(password == ""){
      AlertFunction("The password is empty", "Password must be filled in", "warning");
      setLoading(false);
    }else{
      try {
        const res = await axios.post('http://localhost:8000/api/register', param);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('statusLogin', res.data.status);
        router.push('/');
      } catch (error) {
        if (error.response.data.status == 400){
          AlertFunction("Invalid email", "The email you used is invalid", "warning");
        }else if(error.response.data.status == 409){
          AlertFunction("Email is available", "The email you are using is already registered", "warning");
        }else if(error.response.data.status == 422){
          AlertFunction("Invalid password", "Minimum password length is 8 characters", "warning");
        }
       
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  return (

    <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh"
  >
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: isMobile ? 2 : 4,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        width: '100%', 
      }}
    >
      <Typography variant='h5' m={4}> Registration</Typography>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ width: '100%' }} 
      >
         
        {error && <Typography color="error">{error}</Typography>}
        <Image
          src={registerIcon}
          width={200}
          alt="register Icon"
        />
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
           autoComplete="off"
            size="small"
          onChange={(e) => setName(e.target.value)}
          sx={{ width: '85%',backgroundColor: "rgba(128, 128, 128, 0.1)" }} 
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
           autoComplete="off"
            size="small"
          onChange={(e) => setEmail(e.target.value)}
          sx={{ width: '85%',backgroundColor: "rgba(128, 128, 128, 0.1)" }} 
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
           autoComplete="off"
            size="small"
          onChange={(e) => setPassword(e.target.value)}
          sx={{ width: '85%',backgroundColor: "rgba(128, 128, 128, 0.1)" }} 
        />
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegist}
              sx={{ mt: 2, width: "100%", borderRadius: "15px", height: "50px", textTransform: "none" }}
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleBack}
              fullWidth
              disabled={loading}
              sx={{ mt: 2, width: "100%", borderRadius: "15px", height: "50px", textTransform: "none" }}
            >
              Back
            </Button>
      </Stack>
    </Container>
  </Box>
  );
}
