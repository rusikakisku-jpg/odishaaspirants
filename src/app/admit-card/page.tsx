import React from 'react';
import { fetchJobsApi } from '@/lib/api';
import AdmitCardClient from './AdmitCardClient';

export default async function AdmitCardPage() {
  const items = await fetchJobsApi();
  return <AdmitCardClient initialItems={items} />;
}
