import React from 'react';
import { fetchJobsApi } from '@/lib/api';
import ResultClient from './ResultClient';

export default async function ResultPage() {
  const items = await fetchJobsApi();
  return <ResultClient initialItems={items} />;
}
