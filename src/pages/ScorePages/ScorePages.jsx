'use client'
import * as React from 'react';
import { Container, Stack, Paper } from '@mui/material';
import HeaderBar from '@/components/HeaderBar/HeaderBar';
import FinalScorePages from '@/components/FinalScorePages/FinalScorePages';
import "../../app/globals.css";


export default function ScorePages() {
  return (
    <>
      <Container>
        <Stack spacing={2}>
            <HeaderBar />
            <Container>
              <FinalScorePages/>
            </Container>
        </Stack>
      </Container>
    </>
  );
}