'use client'
import * as React from 'react';
import { Container, Stack, Paper } from '@mui/material';
import HeaderBar from '@/components/HeaderBar/HeaderBar';
import QuestionsPages from '@/components/QuestionsPages/QuestionsPages';
import "../../app/globals.css";

export default function TryoutPages() {
  return (
    <>
      <Container>
        <Stack spacing={2}>

            <HeaderBar />
            <Container>
              <QuestionsPages/>
            </Container>
        </Stack>
      </Container>
    </>
  );
}