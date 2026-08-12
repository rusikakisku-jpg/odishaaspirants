import React from 'react';
import { fetchJobsApi, fetchJobDetailsApi, getJobSlug } from '@/lib/api';
import ArticleDetailsClient from './ArticleDetailsClient';

export async function generateStaticParams() {
  const jobs = await fetchJobsApi();
  if (jobs.length === 0) {
    return [
      { slug: 'opsc-medical-officer-recruitment' },
      { slug: 'osssc-ri-ari-amin-recruitment' },
      { slug: 'ossc-cgl-mains-admit-card' },
    ];
  }
  const paramsList = jobs.map((job) => ({
    slug: getJobSlug(job),
  }));
  return paramsList;
}

export default async function ArticleDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allJobs = await fetchJobsApi();

  let job = allJobs.find((j) => getJobSlug(j) === slug || String(j.id) === slug) || null;
  if (!job) {
    job = await fetchJobDetailsApi(slug);
  }

  return <ArticleDetailsClient slug={slug} initialJob={job} initialAllJobs={allJobs} />;
}
