import React from 'react';
import { fetchSyllabusApi, fetchJobsApi } from '@/lib/api';
import SyllabusClient, { SyllabusDisplayItem } from './SyllabusClient';

export default async function SyllabusPage() {
  const [patterns, jobs] = await Promise.all([
    fetchSyllabusApi(),
    fetchJobsApi(),
  ]);

  const initialList: SyllabusDisplayItem[] = patterns.map((p: any) => ({
    id: p.id,
    title: p.title,
    board: p.board,
    year: p.update_year || '2026',
    link: `/jobs/${p.id}`,
  }));

  jobs.forEach((j) => {
    if (!initialList.some((f) => String(f.id) === String(j.id))) {
      initialList.push({
        id: j.id,
        title: `${j.title} Syllabus`,
        board: j.board,
        year: '2026',
        link: `/jobs/${j.id}`,
      });
    }
  });

  return <SyllabusClient initialList={initialList} />;
}
