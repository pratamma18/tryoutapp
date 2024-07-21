import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Button, IconButton, FormControl, FormControlLabel, Grid, Modal, Radio, RadioGroup,
    TextField, Typography, Stack, Dialog, DialogContent, DialogActions
} from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ReportGmailerrorred, List } from '@mui/icons-material';
import AlertFunction from '../AlertFunction/AlertFunction';
import Swal from 'sweetalert2';

export default function QuestionsPages() {
    // State hooks
    const [open, setOpen] = useState(false);
    const [openScore, setOpenScore] = useState(false);
    const [openQuest, setOpenQuest] = useState(false);
    const [questions, setQuestions] = useState({});
    const [allQuest, setAllQuest] = useState([]);
    const [correct, setCorrect] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [answers, setAnswers] = useState({});
    const [report, setReport] = useState('');
    const [idUser, setIdUser] = useState('0');
    const [isReportEmpty, setIsReportEmpty] = useState(true);
    const [idQuest, setIdQuest] = useState('1');
    const [answerId, setAnswerId] = useState([]);
    const [loading, setLoading] = useState(false);
    const [seeAnswers, setSeeAnswers] = useState(false);

    // Media query
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter();

    // Modal styles
    const style = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '90%' : 400,
        backgroundColor: 'white',
        boxShadow: 24,
        p: 4,
        borderRadius: 8,
        outline: 'none',
    };

    // Fetch data from API
    const fetchData = async () => {
        try {
            const status = localStorage.getItem('statusLogin');
            if (status == 200) {
                AlertFunction("Login successful", "welcome to the tryout App", "success");
                localStorage.removeItem("statusLogin");
            }
            const response = await axios.get(`http://localhost:8000/api/questions/${idQuest}`);
            setQuestions(response.data.data);
            const resOfAllQuest = await axios.get('http://localhost:8000/api/questions');
            setAllQuest(resOfAllQuest.data.data);
            setIdUser(localStorage.getItem('idUser'));
            if (handleClose) {
                setReport('');
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [idQuest]);

    // Handle answer change
    const handleChange = (event, dataId) => {
        const newAnswers = { ...answers, [idQuest]: event.target.value };
        setAnswers(newAnswers);
    };

    // Function to check and update score for the current question
    const checkAndUpdateScore = (questionId) => {
        const answerData = questions.options.find(option => option.jawaban === answers[questionId]);
        if (answerData && answerData.iscorrect !== 0) {
            setTotalScore(prevScore => prevScore + answerData.nilai);
            setCorrect(prevCorrect => prevCorrect + 1);
            setAnswers(prevAnswers => ({ ...prevAnswers }));
        }
    };

    // Handle next question
    const handleNext = () => {
        const currentId = parseInt(idQuest);
        checkAndUpdateScore(currentId);

        if (currentId < allQuest.length) {
            setIdQuest(String(currentId + 1));
        } else {
            handleDone();
        }
    };

    // Handle completion
    const handleDone = () => {
        if (!seeAnswers) {
            const unansweredQuestions = allQuest.filter((question, index) => !answers[index + 1]);
            if (unansweredQuestions.length > 0) {
                AlertFunction("Completion Required", "Please answer all questions before submitting.", "warning");
            } else {
                Swal.fire({
                    icon: "question",
                    title: "Do you want to save the changes?",
                    showCancelButton: true,
                    confirmButtonText: "Save",
                }).then((result) => {
                    if (result.isConfirmed) {
                        const currentId = parseInt(idQuest);
                        checkAndUpdateScore(currentId); // Ensure the last question is scored
                        localStorage.setItem('answersId', JSON.stringify(answerId));
                        localStorage.setItem('totalScore', totalScore);
                        localStorage.setItem('totalCorrect', correct);
                        setOpenScore(true);
                    }
                });
            }
        } else {
            router.push('/');
        }
    };

    // Handle back question
    const handleBack = () => {
        const currentId = parseInt(idQuest);
        if (currentId > 1) {
            setIdQuest(String(currentId - 1));
        }
    };

    // Handle answer selection
    const handleAnswer = (e, answerid) => {
        const newAnswers = { ...answers, [idQuest]: e.target.value };
        setAnswers(newAnswers);
        const newAnswersId = { ...answerId, [idQuest]: answerid };
        setAnswerId(newAnswersId);
    };

    // Handle report input change
    const handleReport = (e) => {
        const reportText = e.target.value;
        setReport(reportText);
        setIsReportEmpty(reportText.trim() === '');
    };

    // Handle question selection
    const handleChoiceQuest = (id) => {
        setIdQuest(id);
        setOpenQuest(false);
    };

    const handleCloseScore = () => {
        setOpenScore(false);
        router.push('/');
    };

    // Handle report submission
    const handleSubmitReport = () => {
        if (!isReportEmpty) {
            setOpen(false);
            axios.post('http://localhost:8000/api/tryout/lapor-soal/create', {
                tryout_question_id: idQuest,
                laporan: report,
                user_id: idUser,
            })
                .then(() => {
                    AlertFunction("Report successful", "Exam questions have been successfully reported", "success");
                })
                .catch(() => {
                    AlertFunction("Report failed", "Exam questions failed to be reported", "error");
                });

            setReport('');
            setIsReportEmpty(true);
        } else {
            AlertFunction("Report Failed", "Please provide a report before submitting.", "error");
        }
    };

    const LogoutHandle = async () => {
        setLoading(true);
        try {
            await axios.post(
                'http://localhost:8000/api/logout',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            localStorage.removeItem('token');
            localStorage.removeItem('totalScore');
            localStorage.removeItem('totalCorrect');
            localStorage.removeItem('answersId');
            router.push('/');
        } catch (error) {
            console.error(error);
        }
    };

    const SeeAnswersHandle = () => {
        setSeeAnswers(true);
        setOpenScore(false)
    };

    // Modal handlers
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpenQuest = () => setOpenQuest(true);
    const handleCloseQuest = () => setOpenQuest(false);

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
            <Stack direction="row" spacing={2} sx={{ width: "100%", justifyContent: "space-between" }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Question {questions.no_soal} of {allQuest.length}
                </Typography>
                <Box>
                    <IconButton size="small" color='warning' onClick={handleOpen}>
                        <ReportGmailerrorred />
                    </IconButton>
                    <IconButton size="small" color='primary' onClick={handleOpenQuest}>
                        <List />
                    </IconButton>
                </Box>
            </Stack>

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
                        <FormControlLabel
                            sx={{
                                color: seeAnswers ? (data.iscorrect === 0 ? "red" : "green") : 'black',
                                pointerEvents: seeAnswers ? 'none' : 'auto' // Nonaktifkan interaksi jika seeAnswers
                            }}
                            component="legend"
                            key={data.id}
                            value={data.jawaban}
                            control={<Radio />}
                            label={data.jawaban}
                            onClick={(e) => handleAnswer(e, data.id)}
                        />
                    ))}
                </RadioGroup>
            </FormControl>

            <Grid container spacing={2} justifyContent="flex-start" mt={4}>
                <Grid item xs={6}>
                    <Button fullWidth variant="outlined" onClick={handleBack}>Back</Button>
                </Grid>
                <Grid item xs={6}>
                    {idQuest == allQuest.length ? (
                        <Button fullWidth variant="contained" onClick={handleDone}>Done</Button>
                    ) : (
                        <Button fullWidth variant="contained" onClick={handleNext}>Next</Button>
                    )}
                </Grid>
            </Grid>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...style }}>
                    <Typography variant="h5" sx={{ fontSize: "20px", textAlign: 'center' }}>Report Questions</Typography>
                    <Grid
                        container
                        spacing={2}
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        mt={2}
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

            <Modal
                open={openQuest}
                onClose={handleCloseQuest}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...style }}>
                    <Typography variant="h6" gutterBottom>Select a question</Typography>
                    <Grid container spacing={1}>
                        {allQuest.map((data) => (
                            <Grid item key={data.id} xs={4}>
                                <Button
                                    variant={answers[data.id] ? "contained" : "outlined"}
                                    onClick={() => handleChoiceQuest(data.id)}
                                    fullWidth
                                >
                                    {data.id}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Modal>

            <Dialog
                open={openScore}
                disableBackdropClick
                disableEscapeKeyDown
            >
                <DialogContent>
                    <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                        <Typography variant="h5" gutterBottom>
                            Your Final Score
                        </Typography>
                        <Typography variant="h3" color="primary" gutterBottom>
                            {totalScore}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: "11px" }}>
                            You successfully answered {correct} out of {allQuest.length} questions
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={SeeAnswersHandle} color="primary" variant="outlined">
                        See your answers
                    </Button>
                    <Button onClick={handleCloseScore} color="primary" variant="contained">
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
