import React from 'react';
import { fetchPyqsApi } from '@/lib/api';
import PYQClient from './PYQClient';

export default async function PYQPage() {
  const pyqs = await fetchPyqsApi();
  return <PYQClient initialPyqs={pyqs} />;
}
