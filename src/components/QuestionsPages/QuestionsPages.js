import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Container, FormControl, FormControlLabel, Grid, Modal, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { QuestionAnswer } from '@mui/icons-material';
import { GETLOGOUT, GETREPORT } from '@/app/config/endpoint';

export default function QuestionsPages() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [questions, setQuestions] = useState({});
    const [allQuest, setAllQuest] = useState([]);
    const [correct, setCorrect] = useState(0); // Initialize as integer
    const [totalScore, setTotalScore] = useState(0); // Initialize as integer
    const [answers, setAnswers] = useState({}); // Changed to object
    const [report, setReport] = useState('');
    const [idUser, setIdUser] = useState('0');
    const [isReportEmpty, setIsReportEmpty] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter();
    const [idQuest, setIdQuest] = useState('1');
    const [disable, setDisable] = useState(true);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '90%' : 400,
        backgroundColor: 'white',
        boxShadow: 24,
        p: 4,
        maxWidth: '60vw',
    };

    // Fetch data function
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/questions/${idQuest}`);
            setQuestions(response.data.data);
            const resOfAllQuest = await axios.get(`http://localhost:8000/api/questions`);
            setAllQuest(resOfAllQuest.data.data);
            setIdUser(localStorage.getItem('idUser'))
            if (handleClose) {
                setReport('')
            }
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        fetchData();
        setDisable(true);
    }, [idQuest]);

    const handleChange = (event) => {
        const newAnswers = { ...answers, [idQuest]: event.target.value };
        setAnswers(newAnswers);
        setDisable(false);
    };

    const handleNext = () => {
        const currentId = parseInt(idQuest);
        if (currentId < allQuest.length) {
            const answerData = questions.options.find(option => option.jawaban === answers[idQuest]);
            if (answerData && answerData.iscorrect != 0 && !answers[`scored_${idQuest}`]) {
                setTotalScore(prevScore => prevScore + answerData.nilai);
                setCorrect(prevCorrect => prevCorrect + 1);
                setAnswers(prevAnswers => ({ ...prevAnswers, [`scored_${idQuest}`]: true }));
            }
            setIdQuest(String(currentId + 1));
            setDisable(true);
        }
    };

    const handleDone = () => {
        router.push('../ScorePages/ScorePages');
        localStorage.setItem('totalScore', totalScore);
        localStorage.setItem('totalCorrect', correct);
    };

    const handleBack = () => {
        const currentId = parseInt(idQuest);
        if (currentId > 1) {
            setIdQuest(String(currentId - 1));
        }
    };

    const handleAnswer = (e) => {
        const newAnswers = { ...answers, [idQuest]: e };
        setAnswers(newAnswers);
        setDisable(false);
        console.log(totalScore);
    };

    const handleReport = (e) => {
        const reportText = e.target.value;
        setReport(reportText);
        setIsReportEmpty(reportText.trim() === '');
    };

    const handleSubmitReport = () => {
        if (!isReportEmpty) {
            setOpen(false);
            axios.post('http://localhost:8000/api/tryout/lapor-soal/create', {
                tryout_question_id: idQuest,
                laporan: report,
                user_id: idUser,

            })
                .then(function (response) {
                    alert("soal berhasil direport")
                })
                .catch(function (error) {
                    alert("soal gagal direport")
                });

            console.log(report);
            setReport('');
            setIsReportEmpty(true);
        } else {
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
            backgroundColor={"white"}
        >
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Question {questions.no_soal} of {allQuest.length}
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ fontSize: "19px" }}>
                {questions.soal}
            </Typography>

            <FormControl component="fieldset">
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={answers[idQuest] || ''}
                    onChange={handleChange}
                >
                    {questions.options && questions.options.map((data) => (
                        <FormControlLabel component="legend" key={data.id} value={data.jawaban} control={<Radio />} label={data.jawaban} onClick={() => handleAnswer(data.id)} />
                    ))}
                </RadioGroup>
            </FormControl>

            <Grid container spacing={2} justifyContent="flex-start" mt={4}>
                < Grid item xs={6} >
                    <Button fullWidth variant="outlined" onClick={handleBack}>Back</Button>
                </Grid>
                <Grid item xs={6}>
                    {idQuest == allQuest.length ? <Button fullWidth variant="contained" onClick={handleDone}>Done</Button> : <Button fullWidth variant="contained" onClick={handleNext} disabled={disable}>Next</Button>}
                </Grid>
            </Grid>
            <Typography gutterBottom sx={{ fontSize: "14px", color: "red", marginBlock: "20px", cursor: "pointer" }} onClick={handleOpen}>
                Report questions
            </Typography>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Grid
                        container
                        spacing={2}
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        mt={4}
                    >
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-basic"
                                variant="outlined"
                                placeholder="Write a report here..."
                                fullWidth
                                multiline
                                rows={4}
                                onChange={handleReport}
                                value={report}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button fullWidth variant="contained" color="error" onClick={handleSubmitReport} disabled={isReportEmpty}>
                                Report
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </ Box>
    );
}
