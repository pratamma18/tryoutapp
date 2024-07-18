'use client'
import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { GETLOGIN, GETLOGOUT } from '@/app/config/endpoint';
import axios from 'axios';
import { QuestionAnswer } from '@mui/icons-material';


export default function LoginPages() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  useEffect(() => {
    const token = document.querySelector('meta[name="csrf-token"]');
    if (token) {
      setCsrfToken(token.getAttribute('content'));
    }
  }, []);

  const handleLogin = async () => {
    const param = {
      email: email,
      password: password
    }
    axios.post('http://localhost:8000/api/login',param, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    
   .then(res=>{
    console.log(res)
    router.push('../TryoutPages/TryoutPages');
    localStorage.setItem("token",res.data.token)
    localStorage.setItem("idUser",res.data.id)
    alert("anda berhasil login");
   })
   .catch(error => {
    console.log(error)

    alert("username atau password salah");
  })
  };

  const handleRegister = () => {
    router.push('../RegistrationPages/RegistrationPages');
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
        className="bg-gray-50"
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
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
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleLogin} sx={{ mt: 2 }}>
          Login
        </Button>
        <Typography
          variant="body2"
          gutterBottom
          sx={{ fontSize: isMobile ? '12px' : '20px', marginTop: 2, cursor: 'pointer', '&:hover': { color: 'secondary.main' } }}
          onClick={handleRegister}
        >
          New user? Register now!
        </Typography>
      </Box>
    </Container>
  );
}
