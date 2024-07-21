<<<<<<< HEAD
'use client'
import * as React from 'react';
import { Typography, Toolbar, Box, AppBar, IconButton, } from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Logout } from '@mui/icons-material';
import Swal from 'sweetalert2';



export default function HeaderBar() {
    const router = useRouter();
    const handleHome = () => {
        Swal.fire({
            title: "Do you want to logout?",
            text: "logging out will delete all your answers",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ok",
        }).then((result) => {
            if (result.isConfirmed) {
                handleLogout();
            }
        });

        const handleLogout = async () => {
            try {
                const response = await axios.post(
                    'http://localhost:8000/api/logout',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        }
                    })
                localStorage.setItem('statusLogin', response.status);
                localStorage.removeItem('token');
                localStorage.removeItem('idUser');
                router.push('/');
            }
            catch (err) {
            }
        }


    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        TryoutApp
                    </Typography>
                    <IconButton size="small" sx={{ color: "white" }} onClick={handleHome}>
                        <Logout />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
=======
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
>>>>>>> 5e06176eb4014e5f90154783ec7aa0f7665779a4
