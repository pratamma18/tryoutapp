// components/Login.js
'use client'
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, useMediaQuery, useTheme,Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
// import { GETLOGIN } from '@/app/config/endpoint';
import { getLogin } from '@/libs/api-libs';
import axios from 'axios';
import "../../app/globals.css";



export default function RegistrationPages() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const handleRegist = async () => {
    const param = {
      name: name,
      email: email,
      password: password
    }
    axios.post('http://localhost:8000/api/register',param)
   .then(res=>{
    localStorage.setItem('token', res.data.token);
    router.push('/');
    alert("registrasi berhasil");
   })
   .catch(error => {
    alert("registrasi gagal");
    console.log(error)
  })
  };

  const handleBack = async () => {
    router.push('/');
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={isMobile ? 4 : 8}
        p={isMobile ? 2 : 4}
        boxShadow={isMobile ? 1 : 3}
        borderRadius={isMobile ? 1 : 3}
        className = "bg-gray-50"
      >
        <Typography variant="h4" gutterBottom>
          Registration
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
         <Grid 
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        mt={4}
        spacing={2}
        > 
                <Grid item xs={6}>
                    <Button variant="outlined" color="primary" onClick={handleBack} sx={{ mt: 2 }} fullWidth>
                            Back
                    </Button>
                </Grid>
                <Grid item xs={6}>
                <Button variant="contained" color="primary" onClick={handleRegist} sx={{ mt: 2 }} fullWidth>
                Regiter
                </Button>
                </Grid>
            </Grid>
      </Box>
    </Container>
  );
}
