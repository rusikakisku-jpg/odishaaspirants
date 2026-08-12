-- Complete Data Import for Cloudflare D1 database odishaaspirants_db

-- 1. Insert Jobs & Recruitment Records
INSERT OR REPLACE INTO jobs (id, title, slug, title_home, title_list, board, board_full, vacancies, qualification, last_date, publish_date, start_date, status, status_class, overview, eligibility_html, dates_html, fee_html, syllabus_html, apply_html, cta_text, cta_url, notification_url, category, thumbnail_url, is_published, created_at) VALUES
(7, 'Combined Graduate Level (CGL) Mains Exam 2026', 'combined-graduate-level-cgl-mains-exam-2026', NULL, NULL, 'OSSC', 'Odisha Staff Selection Commission', '--', 'June 02, 2026', 'Active Now', 'May 22, 2026', '--', 'Active Now', 'status-active', NULL, NULL, NULL, NULL, NULL, NULL, 'View Admit Card (Live)', '#', '#', 'admit', NULL, 1, '2026-06-14 10:43:28'),
(8, 'Civil Services Preliminary Examination 2026', 'civil-services-preliminary-examination-2026', NULL, NULL, 'OPSC', 'Odisha Public Service Commission', '--', 'June 08, 2026', 'Active Now', 'May 19, 2026', '--', 'Active Now', 'status-active', NULL, NULL, NULL, NULL, NULL, NULL, 'View Admit Card (Live)', '#', '#', 'admit', NULL, 1, '2026-06-14 10:43:28'),
(9, 'Sub-Inspector Written Examination 2026', 'sub-inspector-written-examination-2026', NULL, NULL, 'Odisha Police', 'Odisha Police State Board', '--', 'July 12, 2026', 'Release Soon', 'May 14, 2026', '--', 'Release Soon', 'status-soon', NULL, NULL, NULL, NULL, NULL, NULL, 'Apply Online', '#', '#', 'admit', NULL, 1, '2026-06-14 10:43:28'),
(10, 'Combined Group-C Teachers Recruitment 2026', 'combined-group-c-teachers-recruitment-2026', NULL, NULL, 'OSSSC', 'Odisha Sub-Ordinate Staff Selection Commission', '--', 'July 28, 2026', 'Release Soon', 'May 12, 2026', '--', 'Release Soon', 'status-soon', NULL, NULL, NULL, NULL, NULL, NULL, 'Apply Online', '#', '#', 'admit', NULL, 1, '2026-06-14 10:43:28'),
(13, 'Odisha Police Constable Written Test 2026', 'odisha-police-constable-written-test-2026', NULL, NULL, 'Odisha Police', 'Odisha Police State Board', '--', 'PROVISIONAL KEY', 'May 17, 2026', 'May 17, 2026', '--', 'PROVISIONAL', 'status-soon', NULL, NULL, NULL, NULL, NULL, NULL, 'View Answer Key PDF', '#', '#', 'key', NULL, 1, '2026-06-14 10:43:28'),
(14, 'OSSC Assistant Training Officer (ATO) 2026', 'ossc-assistant-training-officer-ato-2026', NULL, NULL, 'OSSC', 'Odisha Staff Selection Commission', '--', 'FINAL KEY', 'May 12, 2026', 'May 12, 2026', '--', 'FINAL KEY', 'status-active', NULL, NULL, NULL, NULL, NULL, NULL, 'View Answer Key PDF', '#', '#', 'key', NULL, 1, '2026-06-14 10:43:28'),
(15, 'Assistant Soil Conservation Officer 2026', 'assistant-soil-conservation-officer-2026', NULL, NULL, 'OPSC', 'Odisha Public Service Commission', '--', 'PROVISIONAL KEY', 'May 09, 2026', 'May 09, 2026', '--', 'PROVISIONAL', 'status-soon', NULL, NULL, NULL, NULL, NULL, NULL, 'Apply Online', '#', '#', 'key', NULL, 1, '2026-06-14 10:43:28'),
(18, 'RI, ARI & Amin Combined Written Test Phase-1 Results', 'ri-ari-amin-combined-written-test-phase-1-results', NULL, NULL, 'OSSSC', 'Odisha Sub-Ordinate Staff Selection Commission', '--', 'May 15, 2026', 'Declared', 'May 15, 2026', '--', 'Declared', 'status-active', NULL, NULL, NULL, NULL, NULL, NULL, 'Check Merit List / Results', '#', '#', 'result', NULL, 1, '2026-06-14 10:43:28'),
(19, 'OSSC CHSL (10+2) Final Merit and Department Allocation List', 'ossc-chsl-10-2-final-merit-and-department-allocation-list', NULL, NULL, 'OSSC', 'Odisha Staff Selection Commission', '--', 'May 08, 2026', 'Declared', 'May 08, 2026', '--', 'Declared', 'status-active', NULL, NULL, NULL, NULL, NULL, NULL, 'Apply Online', '#', '#', 'result', NULL, 1, '2026-06-14 10:43:28'),
(20, 'Post Graduate Teacher (PGT) Written Test Cut-Off Marks', 'post-graduate-teacher-pgt-written-test-cut-off-marks', NULL, NULL, 'OPSC', 'Odisha Public Service Commission', '--', 'May 02, 2026', 'Declared', 'May 02, 2026', '--', 'Declared', 'status-active', NULL, NULL, NULL, NULL, NULL, NULL, 'Apply Online', '#', '#', 'result', NULL, 1, '2026-06-14 10:43:28'),
(58, 'CGL Specialist – 199 Posts', 'cgl-specialist-199-posts', 'OSSC CGL Specialist – 199 Posts', 'CGL Specialist – 199 Posts', 'OSSC', 'OSSC Recruitment', '--', 'Any Bachelors Degree, B.Sc, Diploma, Any Post Graduate, ICWA', '2026-07-08', '2026-05-20', '2026-05-20', 'Active Now', 'status-active', 'Overview details to be added.', '<p>Please refer to eligibility details.</p>', '<p>Important dates details.</p>', '<p>Application fee details.</p>', '<p>Syllabus details.</p>', '<p>How to apply guidelines.</p>', 'Apply Online', '#', 'https://www.freejobalert.com/articles/ossc-cgl-specialist-recruitment-2026-apply-online-for-199-posts-3049987', 'vacancy', 'assets/images/job-thumbnail.png', 1, '2026-07-03 17:36:22'),
(59, 'Food Safety Officer – 84 Posts', 'food-safety-officer-84-posts', 'OSSC Food Safety Officer – 84 Posts', 'Food Safety Officer – 84 Posts', 'OSSC', 'OSSC Recruitment', '--', 'B.Sc, B.Tech/B.E, M.Sc, M.Phil/Ph.D', '2026-07-08', '2026-05-20', '2026-05-20', 'Active Now', 'status-active', 'Overview details to be added.', '<p>Please refer to eligibility details.</p>', '<p>Important dates details.</p>', '<p>Application fee details.</p>', '<p>Syllabus details.</p>', '<p>How to apply guidelines.</p>', 'Apply Online', '#', 'https://www.freejobalert.com/articles/ossc-fso-recruitment-2026-apply-online-for-84-food-safety-officer-posts-3049990', 'vacancy', 'assets/images/job-thumbnail.png', 1, '2026-07-03 17:36:22'),
(60, 'Speech Therapist, Senior Stenographer, Radiographer Grade-I and More – 4 Posts', 'speech-therapist-senior-stenographer-radiographer-grade-i-and-more-4-posts', 'SVNIRTAR Speech Therapist, Senior Stenographer, Radiographer Grade-I and More – 4 Posts', 'Speech Therapist, Senior Stenographer, Radiographer Grade-I and More – 4 Posts', 'SVNIRTAR', 'SVNIRTAR Recruitment', '--', '10TH, Diploma, Any Graduate', '2026-07-20', '2026-06-11', '2026-06-11', 'Active Now', 'status-active', 'Overview details to be added.', '<p>Please refer to eligibility details.</p>', '<p>Important dates details.</p>', '<p>Application fee details.</p>', '<p>Syllabus details.</p>', '<p>How to apply guidelines.</p>', 'Apply Online', '#', 'https://www.freejobalert.com/articles/svnirtar-recruitment-2026-apply-online-for-speech-therapist-senior-stenographer-and-more-posts-3053603', 'vacancy', 'assets/images/job-thumbnail.png', 1, '2026-07-03 17:36:22'),
(61, 'Junior Typist, Stenographer and More – 19 Posts', 'junior-typist-stenographer-and-more-19-posts', 'Sundargarh District Court Junior Typist, Stenographer and More – 19 Posts', 'Junior Typist, Stenographer and More – 19 Posts', 'Sundargarh District Court', 'Sundargarh District Court Recruitment', '--', '10TH, Diploma', '2026-07-13', '2026-06-13', '2026-06-13', 'Active Now', 'status-active', 'Overview details to be added.', '<p>Please refer to eligibility details.</p>', '<p>Important dates details.</p>', '<p>Application fee details.</p>', '<p>Syllabus details.</p>', '<p>How to apply guidelines.</p>', 'Apply Online', '#', 'https://www.freejobalert.com/articles/sundargarh-district-court-recruitment-2026-apply-offline-for-19-junior-typist-stenographer-and-mo-3053822', 'vacancy', 'assets/images/job-thumbnail.png', 1, '2026-07-03 17:36:22'),
(62, 'Nursing Officer – 5,989', 'nursing-officer-5-989', 'OSSSC Nursing Officer – 5,989', 'Nursing Officer – 5,989', 'OSSSC', 'OSSSC Recruitment', '--', 'B.Sc, GNM', '2026-07-13', '2026-06-13', '2026-06-13', 'Active Now', 'status-active', 'Overview details to be added.', '<p>Please refer to eligibility details.</p>', '<p>Important dates details.</p>', '<p>Application fee details.</p>', '<p>Syllabus details.</p>', '<p>How to apply guidelines.</p>', 'Apply Online', '#', 'https://www.freejobalert.com/articles/osssc-nursing-officer-recruitment-2026-apply-online-for-5989-posts-3053639', 'vacancy', 'assets/images/job-thumbnail.png', 1, '2026-07-03 17:36:22'),
(63, 'Part-Time Correspondent – 4 Posts', 'part-time-correspondent-4-posts', 'Prasar Bharati Part-Time Correspondent – 4 Posts', 'Part-Time Correspondent – 4 Posts', 'Prasar Bharati', 'Prasar Bharati Recruitment', '--', 'Diploma, PG Diploma', '2026-07-07', '2026-06-15', '2026-06-15', 'Active Now', 'status-active', 'Overview details to be added.', '<p>Please refer to eligibility details.</p>', '<p>Important dates details.</p>', '<p>Application fee details.</p>', '<p>Syllabus details.</p>', '<p>How to apply guidelines.</p>', 'Apply Online', '#', 'https://www.freejobalert.com/articles/prasar-bharati-part-time-correspondent-recruitment-2026-apply-offline-3053976', 'vacancy', 'assets/images/job-thumbnail.png', 1, '2026-07-03 17:36:22'),
(99, 'Anganwadi Helper – 2 Posts', 'anganwadi-helper-2-posts', 'WCD Odisha Anganwadi Helper – 2 Posts', 'Anganwadi Helper – 2 Posts', 'WCD Odisha', 'WCD Odisha Recruitment', '--', '12TH', '2026-07-16', '2026-07-03', '2026-07-03', 'Active Now', 'status-active', 'Overview details to be added.', '<p>Please refer to eligibility details.</p>', '<p>Important dates details.</p>', '<p>Application fee details.</p>', '<p>Syllabus details.</p>', '<p>How to apply guidelines.</p>', 'Apply Online', '#', 'https://www.freejobalert.com/articles/wcd-odisha-anganwadi-helper-recruitment-2026-apply-online-3056645', 'vacancy', 'assets/images/job-thumbnail.png', 1, '2026-07-03 17:36:22');

-- 2. Insert Options & Site Configurations
INSERT OR REPLACE INTO options (option_name, option_value) VALUES
('alert_notice', 'OPSC Civil Services Exam Date rescheduled to July 12, 2026. Keep practicing!'),
('footer_desc', 'Simplifying your preparation for OPSC, OSSC, OSSSC, OTET, and other Odisha government exams. Access high-quality study notes and realistic mock tests to crack your dream job');

-- 3. Insert Syllabus Patterns & Subjects
INSERT OR REPLACE INTO syllabus_patterns (id, board, title, update_year, pattern, description, pdf_name, is_published, created_at) VALUES
(1, 'OPSC', 'Odisha Civil Services (OCS) Syllabus', '2026', 'Prelims (Paper I & II MCQ) + Mains (9 Written Papers) + Interview', 'Detailed official syllabus for OCS General Studies Paper-I (History, Geography, Polity, Science) and Paper-II (CSAT), along with Mains GS and Optional papers.', 'opsc_ocs_syllabus_2026.pdf', 1, '2026-06-13 12:00:54'),
(2, 'OSSC', 'OSSC Combined Graduate Level (CGL) Syllabus', '2026', 'Preliminary Examination (MCQ) + Main Written Exam + Computer Skill Test', 'Official syllabus and marks distribution for CGL positions including Auditors, inspectors, and assistants across departments.', 'ossc_cgl_syllabus_2026.pdf', 1, '2026-06-13 12:00:54');

INSERT OR REPLACE INTO syllabus_subjects (id, syllabus_id, subject_name, marks, duration) VALUES
(1, 1, 'Prelims Paper I (General Studies)', '200 Marks', '2 Hours'),
(2, 1, 'Prelims Paper II (CSAT)', '200 Marks (33% Qualifying)', '2 Hours'),
(3, 1, 'Mains General Studies I, II, III, IV', '1000 Marks Total', '3 Hours each'),
(4, 2, 'Prelims: Arithmetic, Reasoning, GA, Computer', '150 Marks', '150 Mins'),
(5, 2, 'Mains Paper I: Language (English & Odia)', '100 Marks', '2 Hours'),
(6, 2, 'Mains Paper II: General Studies (Polity, History)', '100 Marks', '2 Hours');

-- 4. Insert PYQs & Downloads
INSERT OR REPLACE INTO pyqs (id, board, years, title, description, accent, is_published, created_at) VALUES
(1, 'OPSC', '2015, 2018, 2020, 2022, 2024', 'OPSC OCS Past Papers', 'Download previous year question papers for Odisha Civil Services (OCS) Prelims (Paper I & II) and Mains GS.', '#8b5cf6', 1, '2026-06-13 12:00:54'),
(2, 'OSSC', '2021, 2022, 2023, 2024, 2025', 'OSSC CGL Past Papers', 'Access official shift-wise question papers and answer key PDFs for OSSC Combined Graduate Level (CGL) Prelims.', '#3b82f6', 1, '2026-06-13 12:00:54'),
(3, 'OSSSC', '2015, 2021, 2022, 2024', 'OSSSC RI/ARI/Amin', 'Get past recruitment question papers and model answer sheet PDFs for Combined Exams (RI, ARI, Amin).', '#10b981', 1, '2026-06-13 12:00:54');

INSERT OR REPLACE INTO pyq_downloads (id, pyq_id, year, paper, file_url) VALUES
(1, 1, 2024, 'OCS Prelims Paper-1 GS', '#'),
(2, 1, 2022, 'OCS Prelims Paper-1 GS', '#'),
(3, 1, 2020, 'OCS Prelims GS Paper-1 & 2', '#'),
(4, 1, 2018, 'OCS Mains GS Paper-1 & 2', '#'),
(5, 2, 2024, 'OSSC CGL Prelims GS Set-A', '#'),
(6, 2, 2023, 'OSSC CGL Prelims GS Set-C', '#');

-- 5. Insert Study Notes, Topics & Chapters
INSERT OR REPLACE INTO study_notes (id, category, icon, color, created_at) VALUES
(1, 'History & Culture', '🏛️', '#8b5cf6', '2026-06-13 12:00:54'),
(2, 'Geography', '🌏', '#3b82f6', '2026-06-13 12:00:54'),
(3, 'Indian Polity', '⚖️', '#10b981', '2026-06-13 12:00:54');

INSERT OR REPLACE INTO study_topics (id, note_id, title, description, tags, is_published, created_at) VALUES
(1, 1, 'Odisha History & Heritage', 'Comprehensive notes covering ancient Kalinga, Ganga Dynasty, British rule, and the formation of Odisha province.', 'Ancient Kalinga, Ganga Dynasty, British Rule', 1, '2026-06-13 12:00:54'),
(2, 1, 'Indian Freedom Struggle', 'Key milestones from the Revolt of 1857, partition of Bengal, Non-Cooperation, Civil Disobedience, to Indian Independence Act.', 'Revolt of 1857, INC, Gandhian Era', 1, '2026-06-13 12:00:54');

INSERT OR REPLACE INTO study_chapters (id, topic_id, chapter_title, file_name) VALUES
(1, 1, 'Kalinga War & Ashoka Influence', 'kalinga_war_notes.pdf'),
(2, 1, 'Rise of Ganga Dynasty & Temple Architecture', 'ganga_dynasty_architecture.pdf');

-- 6. Insert Users & Admin Accounts
INSERT OR REPLACE INTO users (id, username, email, password, role, created_at) VALUES
(1, 'admin', 'rusikakisku@gmail.com', '$2y$12$R9jV/N/DmVNaaOHaM1zrl.t9C3ZAjBv0ft4qw8m.zb.ZxxOC5yhDO', 'admin', '2026-06-13 12:03:37'),
(2, 'admin_portal', 'admin@odishaaspirants.com', '$2y$12$R9jV/N/DmVNaaOHaM1zrl.t9C3ZAjBv0ft4qw8m.zb.ZxxOC5yhDO', 'admin', '2026-07-20 08:29:37');
