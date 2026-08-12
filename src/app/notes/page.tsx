import React from 'react';
import { fetchNotesApi } from '@/lib/api';
import NotesClient from './NotesClient';

export default async function NotesPage() {
  const notes = await fetchNotesApi();
  return <NotesClient initialNotes={notes} />;
}
