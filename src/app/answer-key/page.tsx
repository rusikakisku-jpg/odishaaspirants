import React from 'react';
import { fetchJobsApi } from '@/lib/api';
import AnswerKeyClient from './AnswerKeyClient';

export default async function AnswerKeyPage() {
  const items = await fetchJobsApi();
  return <AnswerKeyClient initialItems={items} />;
}
