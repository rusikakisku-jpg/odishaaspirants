import React from 'react';
import { fetchJobsApi } from '@/lib/api';
import LatestJobsClient from './LatestJobsClient';

export default async function LatestJobsPage() {
  const jobs = await fetchJobsApi();
  return <LatestJobsClient initialJobs={jobs} />;
}
