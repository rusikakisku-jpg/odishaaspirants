import React from 'react';
import { fetchJobsApi, fetchPyqsApi, fetchSyllabusApi } from '@/lib/api';
import HomePageClient from './HomePageClient';

export default async function HomePage() {
  const [allJobs, pyqData, sylData] = await Promise.all([
    fetchJobsApi(),
    fetchPyqsApi(),
    fetchSyllabusApi(),
  ]);

  const initialVacancies = allJobs.filter((j) => j.category === 'vacancy').slice(0, 10);
  const initialAdmitCards = allJobs.filter((j) => j.category === 'admit').slice(0, 10);
  const initialAnswerKeys = allJobs.filter((j) => j.category === 'key').slice(0, 10);
  const initialResults = allJobs.filter((j) => j.category === 'result').slice(0, 10);
  const initialPyqs = pyqData.slice(0, 10);
  const initialSyllabusList = sylData.slice(0, 10);

  return (
    <HomePageClient
      initialVacancies={initialVacancies}
      initialAdmitCards={initialAdmitCards}
      initialAnswerKeys={initialAnswerKeys}
      initialResults={initialResults}
      initialPyqs={initialPyqs}
      initialSyllabusList={initialSyllabusList}
    />
  );
}
