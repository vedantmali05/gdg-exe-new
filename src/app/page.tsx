"use client"

import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import TaskPage from './tasks/TaskPage';
import Community from './Community';
import Assistant from './Assistant';
import { getFromLocalStorage, saveToLocalStorage } from '@/utils/browserStorage';
import { STORAGE_KEYS } from '@/utils/constants';
import { dummyUsers } from '@/utils/data';

export default function Home() {

  const users = getFromLocalStorage(STORAGE_KEYS.users);
  if (!users || users.length === 0) {
    saveToLocalStorage(STORAGE_KEYS.users, dummyUsers);
  }


  return (
    // <>Hello</>
    <BrowserRouter>
      <main>
      <Routes>
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/" element={<Community />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer />
    </main>
    </BrowserRouter>
  );
}