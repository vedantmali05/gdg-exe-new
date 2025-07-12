"use client";

import { getFromLocalStorage, saveToLocalStorage } from '@/utils/browserStorage';
import { STORAGE_KEYS } from '@/utils/constants';
import { dummyUsers } from '@/utils/data';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Community from './community/page';

export default function Home() {
  const users = getFromLocalStorage(STORAGE_KEYS.users);
  if (!users || users.length === 0) {
    saveToLocalStorage(STORAGE_KEYS.users, dummyUsers);
  }

  const router = useRouter();

  useEffect(() => {
    router.replace('/community');
  }, [router]);

  return (
    <main>
      <Community />
    </main>
  );
}
