'use client'
import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GETALLQUEST } from '@/app/config/endpoint';
import { Container, Grid, FormControl, FormControlLabel, RadioGroup, Radio, Button, Typography, Box } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function FinalScorePages() {
    const [totalScore, setTotalScore] = useState('0')
    const [totalCorrect, setTotalCorrect] = useState('0');
    const [allQuest, setAllQuest] = useState([]);
    const [value, setValue] = React.useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter();

    const fetchData = async () => {
        try {
            const resOfAllQuest = await axios.get(`http://localhost:8000/api/questions`);
            setAllQuest(resOfAllQuest.data.data);
            setTotalScore(localStorage.getItem('totalScore'));
            setTotalCorrect(localStorage.getItem('totalCorrect'));
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const LogoutHandle = async () => {
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
            localStorage.removeItem('totalScore');
            localStorage.removeItem('totalCorrect');
            router.push('/');
        } catch (error) {
            console.error('Logout Error:', error);
        }
    };


    return (

        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="flex-start"
            p={isMobile ? 2 : 4}
            mt={isMobile ? 2 : 4}
            boxShadow={3}
            borderRadius={2}
            sx={{ backgroundColor: "white" }}
        >
            <Grid container
                spacing={2}
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                mt={2.5}
                mb={5}>
                <Grid item xs={3}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: "19px" }}>
                        YOUR FINAL SCORE :
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: "30px" }}>
                        {totalScore}
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography gutterBottom sx={{ fontSize: "13px" }}>
                        You successfully answered {totalCorrect} out of {allQuest.length}
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Button fullWidth variant="contained" onClick={LogoutHandle}>DONE</Button>
                </Grid>
            </Grid>
        </Box>
    );
}
