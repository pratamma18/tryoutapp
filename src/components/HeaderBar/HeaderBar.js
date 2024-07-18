'use client'
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function HeaderBar() {
    const router = useRouter();
    const handleHome = async () => {
        try {
            await axios.post(
                'http://localhost:8000/api/logout',
                {}, // Data kosong karena biasanya tidak diperlukan untuk logout
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            localStorage.removeItem('token');
            alert("log out berhasil");
            router.push('/');
        } catch (error) {
            alert("log out gagal");
        }
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        TryoutApp
                    </Typography>
                    <Button color="inherit" onClick={handleHome}>Logout</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
