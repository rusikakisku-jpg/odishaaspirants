import React from 'react';
import { JOBS_DATA } from '@/lib/data';
import JobDetailsClient from './JobDetailsClient';

export function generateStaticParams() {
  return JOBS_DATA.map((job) => ({
    id: String(job.id),
  }));
}

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <JobDetailsClient id={id} />;
}
