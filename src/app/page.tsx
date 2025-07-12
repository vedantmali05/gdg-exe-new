"use client";

import { getFromLocalStorage, saveToLocalStorage } from '@/utils/browserStorage';
import { STORAGE_KEYS } from '@/utils/constants';
import { dummyUsers } from '@/utils/data';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import TaskPage from './tasks/TaskPage';
import Assistant from './Assistant';
import Community from './Community';
import { ToastContainer } from 'react-toastify';
import ClientOnly from '@/components/ClientOnly';

export default function Home() {
  const users = getFromLocalStorage(STORAGE_KEYS.users);
  if (!users || users.length === 0) {
    saveToLocalStorage(STORAGE_KEYS.users, dummyUsers);
  }

  return (
    <main>
      <ClientOnly>
        <Routes>
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/community" element={<Community />} />
          <Route path="*" element={<Navigate to="/community" />} />
        </Routes>
        <ToastContainer />
      </ClientOnly>
    </main>
  );
}