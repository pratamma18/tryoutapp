'use client'
import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Stack, useMediaQuery, useTheme, CircularProgress, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import AlertFunction from '@/components/AlertFunction/AlertFunction';
import loginIcon from "../../../public/icon/login.png";
import Image from 'next/image';

export default function LoginPages() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem('statusLogin');
    if (status == 200) {
      AlertFunction("Logout Successful", "You have successfully logged out", "success");
      localStorage.removeItem('statusLogin');
    }
    if (status == 201) {
      AlertFunction("Registration Successful", "You have successfully registered", "success");
      localStorage.removeItem('statusLogin');
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const param = {
      email: email,
      password: password
    };
    axios.post('http://localhost:8000/api/login', param, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(res => {
      setLoading(false);
      router.push('../TryoutPages/TryoutPages');
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("idUser", res.data.id);
      localStorage.setItem("statusLogin", res.data.status);
    })
    .catch(error => {
      AlertFunction("Login failed", "Incorrect email or password", "error");
      setLoading(false);
    });
  };

  const handleRegister = () => {
    router.push('../RegistrationPages/RegistrationPages');
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
        <Typography variant='h5' m={4}>TryoutApp</Typography>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ width: '100%' }} 
        >
           
          {error && <Typography color="error">{error}</Typography>}
          <Image
            src={loginIcon}
            width={200}
            alt="Login Icon"
          />
         
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            size="small"
            sx={{ width: '85%',backgroundColor: "rgba(128, 128, 128, 0.1)" }} 
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            size="small"
            sx={{ width: '85%',backgroundColor: "rgba(128, 128, 128, 0.1)" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{ mt: 2, width: "70%", borderRadius: "25px", height: "50px", textTransform: "none" }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </Stack>
        <Typography
          variant="body2"
          gutterBottom
          sx={{ fontSize: isMobile ? '12px' : '20px', marginTop: 2, cursor: 'pointer', '&:hover': { color: 'secondary.main' } }}
          onClick={handleRegister}
        >
          New user? Register now!
        </Typography>
      </Container>
    </Box>
  );
}
