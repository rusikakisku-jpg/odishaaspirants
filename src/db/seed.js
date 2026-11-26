const d1 = require('./d1Client');

async function seedDatabase() {
  if (!d1._inNativeSchema && !d1.nativeSchemaRun) {
    await d1.init();
  }

  console.log('🌱 Seeding initial Odisha Aspirants database...');

  // 0. Ensure all core tables exist before querying or inserting (already ensured if inside runNativeSchema)
  if (!d1._inNativeSchema && d1.CORE_TABLES && Array.isArray(d1.CORE_TABLES)) {
    for (const sql of d1.CORE_TABLES) {
      try {
        await d1.prepare(sql).run();
      } catch (e) {}
    }
  }

  // Ensure Authors table and posts.author_id exist
  try {
    await d1.prepare(`
      CREATE TABLE IF NOT EXISTS authors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        role TEXT DEFAULT 'Senior Recruitment Analyst & Fact-Checker',
        email TEXT,
        bio TEXT,
        avatar_url TEXT DEFAULT '/images/default-avatar.svg',
        qualification TEXT,
        experience TEXT,
        twitter_url TEXT,
        linkedin_url TEXT,
        telegram_url TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    const tableInfo = await d1.prepare('PRAGMA table_info(posts)').all();
    const hasAuthorId = tableInfo.some(c => c.name === 'author_id');
    if (!hasAuthorId) {
      await d1.prepare('ALTER TABLE posts ADD COLUMN author_id INTEGER DEFAULT 1').run();
      console.log('✅ Added author_id column to posts table.');
    }

    const authorCount = await d1.prepare('SELECT COUNT(*) AS count FROM authors').first();
    if (!authorCount || authorCount.count === 0) {
      const initialAuthors = [
        {
          name: 'Mangal',
          slug: 'mangal',
          role: 'Senior Recruitment Analyst & Fact-Checker Lead',
          email: 'editor@odishaaspirants.com',
          bio: 'The official editorial and verification desk of Odisha Aspirants. Our research team meticulously verifies all central and state government job notifications, admit cards, answer keys, and results directly from official gazettes and commissions.',
          qualification: 'Master of Public Administration & Statistical Analysis',
          experience: '10+ Years Competitive Exams Analysis',
          avatar_url: '/images/default-avatar.svg',
          telegram_url: 'https://t.me/odishaaspirantsofficial'
        }
      ];

      for (const a of initialAuthors) {
        const { hashPassword } = require('../middleware/authorAuth');
        const defaultPassword = (a.slug === 'mangal' || a.slug === 'editorial-team') ? 'editor@2026' : 'author@2026';
        const passwordHash = hashPassword(defaultPassword);
        await d1.prepare(`
          INSERT INTO authors (name, slug, role, email, password_hash, bio, qualification, experience, avatar_url, telegram_url, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `).bind(a.name, a.slug, a.role, a.email, passwordHash, a.bio, a.qualification, a.experience, a.avatar_url, a.telegram_url).run();
      }
      console.log('✅ Authors seeded successfully.');
    }

    // Backfill default passwords for existing authors missing password
    try {
      const { hashPassword } = require('../middleware/authorAuth');
      const authorsWithoutPass = await d1.prepare("SELECT id, slug, email FROM authors WHERE password_hash IS NULL OR password_hash = ''").all();
      if (authorsWithoutPass && authorsWithoutPass.length > 0) {
        for (const a of authorsWithoutPass) {
          const defPass = (a.slug === 'mangal' || a.slug === 'editorial-team' || a.email === 'editor@odishaaspirants.com') ? 'editor@2026' : 'author@2026';
          const pHash = hashPassword(defPass);
          await d1.prepare('UPDATE authors SET password_hash = ? WHERE id = ?').bind(pHash, a.id).run();
        }
        console.log('✅ Set default passwords for authors.');
      }
    } catch (passErr) {
      console.warn('Password backfill note:', passErr.message);
    }

    await d1.prepare('UPDATE posts SET author_id = 1 WHERE author_id IS NULL OR author_id = 0').run();
  } catch (err) {
    console.warn('⚠️ Authors initialization warning:', err.message);
  }

  // 1. Seed Badges
  const badgeCount = await d1.prepare('SELECT COUNT(*) AS count FROM badges').first();
  if (!badgeCount || badgeCount.count === 0) {
    const badges = [
      { title: 'Indian Navy SSR/AA', subtitle: 'Apply Online', url: '/post/indian-navy-ssr-aa-online-form-2026', bg_color: '#868a08', order: 1 },
      { title: 'UPSSSC PET 2026', subtitle: 'Online Registration', url: '/post/upsssc-pet-2026-online-form', bg_color: '#0404b4', order: 2 },
      { title: 'UP Police SI 2026', subtitle: 'Apply Online', url: '/post/up-police-si-recruitment-2026', bg_color: '#fb5e03', order: 3 },
      { title: 'UPSC Civil Services', subtitle: 'Apply Online', url: '/post/upsc-civil-services-ias-exam-2026', bg_color: '#8c0101', order: 4 },
      { title: 'SSC CGL 2026', subtitle: 'Apply Online', url: '/post/ssc-cgl-recruitment-2026-online-form', bg_color: '#fb0303', order: 5 },
      { title: 'UPSSSC OTR', subtitle: 'Registration 2026', url: '/post/upsssc-otr-registration-2026', bg_color: '#0b610b', order: 6 },
      { title: 'Railway RRB ALP', subtitle: 'Technician Online', url: '/post/railway-rrb-alp-technician-2026', bg_color: '#ff00bf', order: 7 },
      { title: 'SBI Clerk 2026', subtitle: 'Apply Online', url: '/post/sbi-clerk-junior-associate-2026', bg_color: '#0080ff', order: 8 }
    ];

    for (const b of badges) {
      await d1.prepare(`
        INSERT INTO badges (title, subtitle, url, bg_color, display_order, is_active)
        VALUES (?, ?, ?, ?, ?, 1)
      `).bind(b.title, b.subtitle, b.url, b.bg_color, b.order).run();
    }
    console.log('✅ Badges seeded.');
  }

  // 2. Seed Marquees
  const marqueeCount = await d1.prepare('SELECT COUNT(*) AS count FROM marquees').first();
  if (!marqueeCount || marqueeCount.count === 0) {
    const marquees = [
      { title: 'SSC CGL 2026 Online Form Apply Till 25/10/2026 | | UP Police Constable Result 2026 Declared | | NTA NEET UG 2026 Registration Open', url: '/category/latest-jobs', order: 1 },
      { title: 'Railway RRB ALP Stage 1 Admit Card 2026 Available Now | | UPSC Civil Services IAS Pre Result with Cutoff Marks Out', url: '/category/admit-card', order: 2 },
      { title: 'SBI Clerk 8000+ Post Apply Online | | Indian Navy Agniveer SSR / MR Online Form 2026 | | CTET July 2026 Answer Key', url: '/category/result', order: 3 }
    ];

    for (const m of marquees) {
      await d1.prepare(`
        INSERT INTO marquees (title, url, is_active, display_order)
        VALUES (?, ?, 1, ?)
      `).bind(m.title, m.url, m.order).run();
    }
    console.log('✅ Marquees seeded.');
  }

  // 3. Seed Posts
  const postCount = await d1.prepare('SELECT COUNT(*) AS count FROM posts').first();
  if (!postCount || postCount.count === 0) {
    const posts = [
      // LATEST JOBS
      {
        title: 'SSC Combined Graduate Level CGL Recruitment 2026 Online Form',
        slug: 'ssc-cgl-recruitment-2026-online-form',
        category: 'latest-jobs',
        department: 'Staff Selection Commission (SSC)',
        post_date: '24 September 2026 | 10:15 AM',
        last_date: '25/10/2026',
        short_desc: 'Staff Selection Commission (SSC) has released the notification for Combined Graduate Level CGL Examination 2026 for various Group B and Group C posts in ministries and departments of Government of India. All eligible male and female candidates can apply online from the link given below.',
        total_vacancy: '17,727 Posts',
        important_dates: JSON.stringify([
          { event: 'Application Begin', date: '24/09/2026' },
          { event: 'Last Date for Apply Online', date: '25/10/2026 up to 11:00 PM' },
          { event: 'Last Date Pay Exam Fee', date: '26/10/2026' },
          { event: 'Correction Window Date', date: '28-29 October 2026' },
          { event: 'Tier I Exam Date', date: 'December 2026' },
          { event: 'Admit Card Available', date: 'Before Exam' }
        ]),
        application_fee: JSON.stringify([
          { category: 'General / OBC / EWS', fee: '₹ 100/-' },
          { category: 'SC / ST / PH', fee: '₹ 0/- (Exempted)' },
          { category: 'All Category Female', fee: '₹ 0/- (Nil)' },
          { category: 'Correction Charge (1st Time)', fee: '₹ 200/-' },
          { category: 'Correction Charge (2nd Time)', fee: '₹ 500/-' },
          { category: 'Payment Mode', fee: 'Debit Card, Credit Card, Net Banking, UPI Only' }
        ]),
        age_limit: JSON.stringify({
          as_on: '01/08/2026',
          min_age: '18 Years',
          max_age: '27-32 Years (Post Wise)',
          relaxation: 'Age Relaxation Extra as per SSC Combined Graduate Level Exam 2026 Rules.'
        }),
        vacancy_details: JSON.stringify([
          { post_name: 'Assistant Section Officer (ASO)', total_post: '1,450', eligibility: 'Bachelor Degree in Any Stream from Any Recognized University in India.' },
          { post_name: 'Inspector of Income Tax (CBDT)', total_post: '850', eligibility: 'Bachelor Degree in Any Stream. Physical standards required.' },
          { post_name: 'Inspector (Central Excise / GST)', total_post: '3,200', eligibility: 'Bachelor Degree in Any Stream with Walking and Cycling Physical Test.' },
          { post_name: 'Sub Inspector (CBI)', total_post: '410', eligibility: 'Bachelor Degree in Any Stream. Height: Male 165 CM, Female 150 CM.' },
          { post_name: 'Assistant Audit Officer (AAO)', total_post: '600', eligibility: 'Bachelor Degree in Any Stream. Desirable: CA / CS / MBA / M.Com.' },
          { post_name: 'Tax Assistant (CBDT & CBIC)', total_post: '4,500', eligibility: 'Bachelor Degree with 8,000 Key Depression per hour on Computer.' },
          { post_name: 'Auditor & Accountant', total_post: '3,100', eligibility: 'Bachelor Degree in Any Stream from recognized university.' }
        ]),
        category_details: JSON.stringify([
          { post_name: 'Group B (Gazetted)', ur: '250', ews: '60', obc: '160', sc: '90', st: '40', total: '600' },
          { post_name: 'Group B (Non-Gazetted)', ur: '3200', ews: '850', obc: '2200', sc: '1200', st: '650', total: '8100' },
          { post_name: 'Group C', ur: '3800', ews: '950', obc: '2400', sc: '1300', st: '577', total: '9027' }
        ]),
        how_to_apply: '1. Staff Selection Commission SSC Combined Graduate Level CGL Recruitment 2026. Candidate Can Apply Between 24/09/2026 to 25/10/2026.\n2. Candidate Read the Notification Before Apply the Recruitment Application Form in SSC CGL 2026.\n3. Kindly Check and Collect the All Document - Eligibility, ID Proof, Address Details, Basic Details.\n4. Kindly Ready Scan Document Related to Recruitment Form - Photo, Sign, ID Proof, Etc.\n5. Live Photo is required for SSC One Time Registration (OTR).\n6. Before Submit the Application Form Must Check the Preview and All Column Carefully.\n7. Take A Print Out of Final Submitted Form.',
        links: JSON.stringify([
          { label: 'Apply Online (OTR / Registration)', url: 'https://ssc.gov.in', btn_text: 'Click Here' },
          { label: 'Apply Online (Candidate Login)', url: 'https://ssc.gov.in/login', btn_text: 'Click Here' },
          { label: 'Download Notification PDF', url: '/uploads/ssc-cgl-notification-2026.pdf', btn_text: 'Click Here' },
          { label: 'Download Syllabus', url: '/post/ssc-cgl-new-syllabus-2026', btn_text: 'Click Here' },
          { label: 'Official Website', url: 'https://ssc.gov.in', btn_text: 'SSC Official' }
        ]),
        notification_pdf: '/uploads/ssc-cgl-notification-2026.pdf',
        apply_online_url: 'https://ssc.gov.in',
        official_website_url: 'https://ssc.gov.in',
        is_featured: 1
      },

      {
        title: 'UP Police Sub Inspector SI Recruitment 2026 Online Form',
        slug: 'up-police-si-recruitment-2026',
        category: 'latest-jobs',
        department: 'Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB)',
        post_date: '20 September 2026 | 02:40 PM',
        last_date: '30/10/2026',
        short_desc: 'Uttar Pradesh Police Recruitment & Promotion Board (UPPRPB) invites online application form for the recruitment of Sub Inspector (Civil Police), Platoon Commander (PAC), and Fire Officer 2. Check eligibility, age limit, selection process, and salary here.',
        total_vacancy: '4,543 Posts',
        important_dates: JSON.stringify([
          { event: 'Application Begin', date: '20/09/2026' },
          { event: 'Last Date for Apply', date: '30/10/2026' },
          { event: 'Last Date for Pay Fee', date: '30/10/2026' },
          { event: 'Exam Date', date: 'Notify Soon' }
        ]),
        application_fee: JSON.stringify([
          { category: 'General / OBC / EWS', fee: '₹ 400/-' },
          { category: 'SC / ST', fee: '₹ 400/-' },
          { category: 'All Category Female', fee: '₹ 400/-' }
        ]),
        age_limit: JSON.stringify({
          as_on: '01/07/2026',
          min_age: '21 Years',
          max_age: '28 Years',
          relaxation: 'Age Relaxation as per UPPRPB Sub Inspector Recruitment 2026 Rules.'
        }),
        vacancy_details: JSON.stringify([
          { post_name: 'Sub Inspector (Civil Police)', total_post: '3,800', eligibility: 'Bachelor Degree in Any Stream from Any Recognized University in India.' },
          { post_name: 'Platoon Commander (PAC)', total_post: '650', eligibility: 'Bachelor Degree in Any Stream (Only Male Candidates).' },
          { post_name: 'Fire Service Officer 2', total_post: '93', eligibility: 'Bachelor Degree in Science (B.Sc) from Any Recognized University.' }
        ]),
        category_details: JSON.stringify([
          { post_name: 'SI Civil Police', ur: '1520', ews: '380', obc: '1026', sc: '798', st: '76', total: '3800' }
        ]),
        how_to_apply: '1. Visit official website uppbpb.gov.in.\n2. Complete One Time Registration (OTR).\n3. Fill in Personal Details, Educational Qualifications.\n4. Upload Photo with Plain White Background and Clear Signature.\n5. Pay fee through online mode.\n6. Submit and save confirmation page.',
        links: JSON.stringify([
          { label: 'Apply Online', url: 'https://uppbpb.gov.in', btn_text: 'Click Here' },
          { label: 'Download Detailed Notification', url: '/uploads/up-police-si-notification-2026.pdf', btn_text: 'Click Here' },
          { label: 'Official Website', url: 'https://uppbpb.gov.in', btn_text: 'UPPRPB Official' }
        ]),
        is_featured: 1
      },

      {
        title: 'Railway RRB ALP & Technician Recruitment 2026 Online Form',
        slug: 'railway-rrb-alp-technician-2026',
        category: 'latest-jobs',
        department: 'Railway Recruitment Boards (RRB)',
        post_date: '18 September 2026',
        last_date: '18/10/2026',
        short_desc: 'Railway Recruitment Board (RRB) Centralised Employment Notice (CEN) for Assistant Loco Pilot (ALP) and Technician Grade III vacancies.',
        total_vacancy: '14,298 Posts',
        important_dates: JSON.stringify([
          { event: 'Application Begin', date: '18/09/2026' },
          { event: 'Last Date for Apply', date: '18/10/2026' }
        ]),
        application_fee: JSON.stringify([
          { category: 'General / OBC / EWS', fee: '₹ 500/- (₹400 Refundable after CBT 1)' },
          { category: 'SC / ST / Ex-Servicemen / Female / EBC', fee: '₹ 250/- (Fully Refundable after CBT 1)' }
        ]),
        age_limit: JSON.stringify({ as_on: '01/07/2026', min_age: '18 Years', max_age: '33 Years', relaxation: 'OBC: 3 Years, SC/ST: 5 Years' }),
        vacancy_details: JSON.stringify([
          { post_name: 'Assistant Loco Pilot (ALP)', total_post: '8,500', eligibility: 'Class 10th Matric with ITI in relevant trade OR Diploma in Engineering.' },
          { post_name: 'Technician Grade III', total_post: '5,798', eligibility: 'Class 10th with ITI NCVT/SCVT certificate.' }
        ]),
        how_to_apply: 'Apply through authorized RRB portal with valid Aadhaar authentication and biometric details.',
        links: JSON.stringify([
          { label: 'Apply Online', url: 'https://rrbapply.gov.in', btn_text: 'Click Here' },
          { label: 'Official Notification PDF', url: '/uploads/rrb-alp-cen-2026.pdf', btn_text: 'Click Here' },
          { label: 'RRB Official Website', url: 'https://indianrailways.gov.in', btn_text: 'Click Here' }
        ]),
        is_featured: 1
      },

      {
        title: 'SBI Clerk (Junior Associates) Recruitment 2026 Apply Online',
        slug: 'sbi-clerk-junior-associate-2026',
        category: 'latest-jobs',
        department: 'State Bank of India (SBI)',
        post_date: '15 September 2026',
        last_date: '10/10/2026',
        short_desc: 'State Bank of India invites applications for appointment of Junior Associates (Customer Support & Sales) in clerical cadre across India.',
        total_vacancy: '8,283 Posts',
        important_dates: JSON.stringify([
          { event: 'Application Start', date: '15/09/2026' },
          { event: 'Last Date', date: '10/10/2026' },
          { event: 'Prelims Exam Date', date: 'November 2026' }
        ]),
        application_fee: JSON.stringify([
          { category: 'General / OBC / EWS', fee: '₹ 750/-' },
          { category: 'SC / ST / PwBD', fee: '₹ 0/-' }
        ]),
        age_limit: JSON.stringify({ as_on: '01/04/2026', min_age: '20 Years', max_age: '28 Years' }),
        vacancy_details: JSON.stringify([
          { post_name: 'Junior Associate (Clerk)', total_post: '8,283', eligibility: 'Graduation in any discipline from a recognized University.' }
        ]),
        how_to_apply: 'Candidates can apply online only from SBI Career portal.',
        links: JSON.stringify([
          { label: 'Apply Online', url: 'https://sbi.co.in/careers', btn_text: 'Click Here' },
          { label: 'Download Notification', url: '/uploads/sbi-clerk-notification-2026.pdf', btn_text: 'Click Here' }
        ]),
        is_featured: 1
      },

      {
        title: 'UPSC Civil Services IAS / IFS Examination 2026 Apply Online',
        slug: 'upsc-civil-services-ias-exam-2026',
        category: 'latest-jobs',
        department: 'Union Public Service Commission (UPSC)',
        post_date: '10 September 2026',
        last_date: '05/10/2026',
        short_desc: 'Union Public Service Commission (UPSC) has issued notification for Civil Services (Preliminary) Examination 2026 and Indian Forest Service (IFS) Examination.',
        total_vacancy: '1,206 Posts',
        important_dates: JSON.stringify([
          { event: 'Application Begin', date: '10/09/2026' },
          { event: 'Last Date for Apply', date: '05/10/2026' }
        ]),
        application_fee: JSON.stringify([
          { category: 'General / OBC / EWS', fee: '₹ 100/-' },
          { category: 'SC / ST / PH / Female', fee: '₹ 0/-' }
        ]),
        age_limit: JSON.stringify({ as_on: '01/08/2026', min_age: '21 Years', max_age: '32 Years' }),
        vacancy_details: JSON.stringify([
          { post_name: 'Indian Administrative Service (IAS)', total_post: '1,056', eligibility: 'Bachelor Degree in Any Stream.' },
          { post_name: 'Indian Forest Service (IFS)', total_post: '150', eligibility: 'Bachelor Degree with at least one subject Animal Husbandry, Botany, Chemistry, etc.' }
        ]),
        how_to_apply: 'One Time Registration (OTR) is mandatory before filling UPSC online application form.',
        links: JSON.stringify([
          { label: 'Apply Online (OTR)', url: 'https://upsconline.nic.in', btn_text: 'Click Here' },
          { label: 'Official Website', url: 'https://upsc.gov.in', btn_text: 'Click Here' }
        ]),
        is_featured: 1
      },

      {
        title: 'Indian Navy 10+2 B.Tech Cadet & SSR / AA Online Form 2026',
        slug: 'indian-navy-ssr-aa-online-form-2026',
        category: 'latest-jobs',
        department: 'Join Indian Navy - Nausena Bharti',
        post_date: '08 September 2026',
        last_date: '04/10/2026',
        short_desc: 'Join Indian Navy invites unmarried male and female candidates for Agniveer SSR and 10+2 (B.Tech) Cadet Entry Scheme.',
        total_vacancy: '2,800 Posts',
        important_dates: JSON.stringify([
          { event: 'Application Start', date: '08/09/2026' },
          { event: 'Last Date', date: '04/10/2026' }
        ]),
        application_fee: JSON.stringify([
          { category: 'All Candidates', fee: '₹ 550/- + 18% GST' }
        ]),
        age_limit: JSON.stringify({ as_on: '01/11/2026', min_age: '17.5 Years', max_age: '21 Years' }),
        vacancy_details: JSON.stringify([
          { post_name: 'Agniveer (SSR)', total_post: '2,800', eligibility: '10+2 with Math, Physics and at least one Chemistry/Biology/Computer Science.' }
        ]),
        how_to_apply: 'Apply through joinindiannavy.gov.in with scanned educational certificates and photo.',
        links: JSON.stringify([
          { label: 'Apply Online', url: 'https://www.joinindiannavy.gov.in', btn_text: 'Click Here' }
        ]),
        is_featured: 1
      },

      {
        title: 'UPSSSC OTR Registration 2026 Online Form',
        slug: 'upsssc-otr-registration-2026',
        category: 'latest-jobs',
        department: 'Uttar Pradesh Subordinate Services Selection Commission (UPSSSC)',
        post_date: '01 September 2026',
        last_date: 'Ongoing',
        short_desc: 'UPSSSC One Time Registration (OTR) is mandatory for all upcoming examinations conducted by UPSSSC Lucknow.',
        total_vacancy: 'N/A (One Time Registration)',
        important_dates: JSON.stringify([
          { event: 'Application Begin', date: '01/01/2026' },
          { event: 'Last Date', date: 'No Last Date (Lifetime Valid)' }
        ]),
        application_fee: JSON.stringify([
          { category: 'All Candidates', fee: '₹ 0/- (Free of Cost)' }
        ]),
        age_limit: JSON.stringify({ as_on: 'Current Year', min_age: '18 Years', max_age: '40 Years' }),
        vacancy_details: JSON.stringify([
          { post_name: 'UPSSSC OTR Registration', total_post: 'Lifelong', eligibility: 'Class 8th / 10th / 12th / Diploma / Graduate or Post Graduate.' }
        ]),
        how_to_apply: 'Complete OTR with Aadhaar e-KYC or manual registration, upload photo, signature and download OTR number.',
        links: JSON.stringify([
          { label: 'Apply Online (Register OTR)', url: 'https://upsssc.gov.in', btn_text: 'Click Here' },
          { label: 'Login to OTR Portal', url: 'https://upsssc.gov.in', btn_text: 'Click Here' }
        ]),
        is_featured: 1
      },

      // RESULTS
      {
        title: 'SSC CGL 2026 Tier I Exam Result with Cutoff Marks',
        slug: 'ssc-cgl-tier-1-result-2026',
        category: 'result',
        department: 'Staff Selection Commission (SSC)',
        post_date: '28 September 2026 | 06:20 PM',
        short_desc: 'Staff Selection Commission SSC has declared the result of Combined Graduate Level Examination Tier 1. Candidates who appeared in CBT exam can download merit list and category wise cutoff marks PDF.',
        links: JSON.stringify([
          { label: 'Download Tier I Result (List 1 - AAO)', url: '/uploads/cgl-list1-result.pdf', btn_text: 'Click Here' },
          { label: 'Download Tier I Result (List 2 - JSO)', url: '/uploads/cgl-list2-result.pdf', btn_text: 'Click Here' },
          { label: 'Download Tier I Result (List 3 - Other Posts)', url: '/uploads/cgl-list3-result.pdf', btn_text: 'Click Here' },
          { label: 'Download Cutoff Marks Notice', url: '/uploads/cgl-tier1-cutoff.pdf', btn_text: 'Click Here' }
        ]),
        result_url: '/uploads/cgl-list3-result.pdf'
      },

      {
        title: 'UP Police Constable 60244 Post Written Exam Result 2026',
        slug: 'up-police-constable-written-result-2026',
        category: 'result',
        department: 'UPPRPB Lucknow',
        post_date: '25 September 2026',
        short_desc: 'Uttar Pradesh Police Recruitment Board has announced the written examination results and normalized marks for 60,244 Constable posts. Check list of candidates qualified for DV & PST.',
        links: JSON.stringify([
          { label: 'Download Selected Candidates List (PDF)', url: '/uploads/upp-constable-result.pdf', btn_text: 'Click Here' },
          { label: 'Check Cutoff Marks', url: '/uploads/upp-cutoff.pdf', btn_text: 'Click Here' }
        ])
      },

      {
        title: 'Railway RRB ALP Stage 1 CBT Result 2026 Declared',
        slug: 'rrb-alp-stage-1-cbt-result-2026',
        category: 'result',
        department: 'Railway Recruitment Boards',
        post_date: '22 September 2026',
        short_desc: 'RRB has published zone-wise CBT 1 Results and scorecards for Assistant Loco Pilot (ALP).',
        links: JSON.stringify([
          { label: 'Check Score Card & Marks', url: 'https://rrbapply.gov.in', btn_text: 'Click Here' },
          { label: 'Download Zone-wise Cutoff PDF', url: '/uploads/rrb-alp-cutoff.pdf', btn_text: 'Click Here' }
        ])
      },

      {
        title: 'BPSC 70th Integrated CCE Prelims Result 2026',
        slug: 'bpsc-70th-prelims-result-2026',
        category: 'result',
        department: 'Bihar Public Service Commission (BPSC)',
        post_date: '20 September 2026',
        short_desc: 'BPSC has announced 70th Combined Competitive Examination PT Result. Check roll number list of qualified candidates for mains examination.',
        links: [
          { label: 'Download BPSC 70th Pre Result PDF', url: '/uploads/bpsc-70-result.pdf', btn_text: 'Click Here' }
        ]
      },

      {
        title: 'IBPS PO / Clerk Mains Exam Final Result with Reserve List 2026',
        slug: 'ibps-po-clerk-mains-final-result-2026',
        category: 'result',
        department: 'Institute of Banking Personnel Selection (IBPS)',
        post_date: '17 September 2026',
        short_desc: 'IBPS has declared final allotment result and provisional marks for CRP PO/MT and Clerical cadre.',
        links: [
          { label: 'Download IBPS PO Allotment List', url: 'https://ibps.in', btn_text: 'Click Here' }
        ]
      },

      {
        title: 'CSBC Bihar Police Constable Final Merit List 2026 Out',
        slug: 'csbc-bihar-police-final-result-2026',
        category: 'result',
        department: 'Central Selection Board of Constable (CSBC) Bihar',
        post_date: '14 September 2026',
        short_desc: 'CSBC Bihar has released the final merit list for Bihar Police Sepoy Constable recruitment.',
        links: [
          { label: 'Download Final Selection List PDF', url: '/uploads/bihar-police-final.pdf', btn_text: 'Click Here' }
        ]
      },

      {
        title: 'UPSC Civil Services IAS / IFS Prelims Result with Name List 2026',
        slug: 'upsc-ias-prelims-result-2026',
        category: 'result',
        department: 'Union Public Service Commission',
        post_date: '10 September 2026',
        short_desc: 'UPSC has published roll number wise and name wise result for Civil Services Preliminary Exam 2026.',
        links: [
          { label: 'Download IAS Pre Result (With Name)', url: '/uploads/upsc-ias-pre-result.pdf', btn_text: 'Click Here' }
        ]
      },

      // ADMIT CARD
      {
        title: 'SSC CHSL 10+2 Tier I Exam Admit Card / Status 2026',
        slug: 'ssc-chsl-tier-1-admit-card-2026',
        category: 'admit-card',
        department: 'Staff Selection Commission (SSC)',
        post_date: '27 September 2026 | 11:30 AM',
        short_desc: 'Staff Selection Commission (SSC) has activated region-wise Application Status and Admit Card download links for Combined Higher Secondary Level (10+2) Tier 1 Exam.',
        links: JSON.stringify([
          { label: 'Download Admit Card (CR Region - UP / Bihar)', url: 'https://ssc-cr.org', btn_text: 'Click Here' },
          { label: 'Download Admit Card (NR Region - Delhi, Raj, UK)', url: 'https://sscnr.nic.in', btn_text: 'Click Here' },
          { label: 'Download Admit Card (WR Region - Mumbai)', url: 'https://sscwr.net', btn_text: 'Click Here' },
          { label: 'Download Admit Card (MPR Region)', url: 'https://sscmpr.org', btn_text: 'Click Here' },
          { label: 'Download Admit Card (ER Region)', url: 'https://sscer.org', btn_text: 'Click Here' }
        ]),
        admit_card_url: 'https://ssc.gov.in'
      },

      {
        title: 'UPSSSC PET 2026 Examination City Details & Admit Card',
        slug: 'upsssc-pet-admit-card-2026',
        category: 'admit-card',
        department: 'UPSSSC Lucknow',
        post_date: '25 September 2026',
        short_desc: 'Uttar Pradesh Subordinate Services Selection Commission Preliminary Eligibility Test (PET 2026) admit cards released on upsssc.gov.in.',
        links: JSON.stringify([
          { label: 'Download UPSSSC PET Admit Card', url: 'https://upsssc.gov.in', btn_text: 'Click Here' },
          { label: 'Check Exam City & Center Slip', url: 'https://upsssc.gov.in', btn_text: 'Click Here' }
        ])
      },

      {
        title: 'NTA NEET UG 2026 City Intimation Slip & Admit Card',
        slug: 'nta-neet-ug-admit-card-2026',
        category: 'admit-card',
        department: 'National Testing Agency (NTA)',
        post_date: '23 September 2026',
        short_desc: 'National Testing Agency has released advance intimation of examination city for National Eligibility Cum Entrance Test (NEET UG).',
        links: JSON.stringify([
          { label: 'Download NEET UG Admit Card', url: 'https://exams.nta.ac.in/NEET/', btn_text: 'Click Here' }
        ])
      },

      {
        title: 'UPSC NDA & NA (I) Examination 2026 e-Admit Card',
        slug: 'upsc-nda-1-admit-card-2026',
        category: 'admit-card',
        department: 'Union Public Service Commission',
        post_date: '19 September 2026',
        short_desc: 'Download UPSC National Defence Academy & Naval Academy Examination e-Admit Card with instructions.',
        links: [
          { label: 'Download NDA Admit Card', url: 'https://upsconline.nic.in', btn_text: 'Click Here' }
        ]
      },

      {
        title: 'CTET July 2026 Hall Ticket / Exam Center Intimation',
        slug: 'ctet-july-hall-ticket-2026',
        category: 'admit-card',
        department: 'Central Board of Secondary Education (CBSE)',
        post_date: '16 September 2026',
        short_desc: 'Central Teacher Eligibility Test (CTET) 2026 admit cards now available for download by application number and date of birth.',
        links: [
          { label: 'Download CTET Admit Card (Link 1)', url: 'https://ctet.nic.in', btn_text: 'Click Here' }
        ]
      },

      {
        title: 'Indian Navy Agniveer SSR / MR Computer Based Test Admit Card',
        slug: 'indian-navy-agniveer-admit-card-2026',
        category: 'admit-card',
        department: 'Join Indian Navy - Nausena Bharti (Agniveer 01/2026 & 02/2026 Batch)',
        post_date: '12 September 2026 | 11:30 AM',
        short_desc: 'Join Indian Navy Nausena Bharti has released the Computer Based Test (CBT Stage 1) Admit Card and Exam City Slip for Agniveer SSR (Senior Secondary Recruit) and Agniveer MR (Matric Recruit) 01/2026 & 02/2026 Batch. All registered candidates can download their hall ticket by logging in with their registered Email ID and Password from the official portal.',
        important_dates: JSON.stringify([
          { event: 'Notification Released', date: '10/05/2026' },
          { event: 'Application Start Date', date: '13/05/2026' },
          { event: 'Last Date for Apply Online', date: '05/06/2026' },
          { event: 'Last Date Fee Payment', date: '05/06/2026' },
          { event: 'Exam City / Date Details Available', date: '08/09/2026' },
          { event: 'CBT Admit Card Available', date: '12/09/2026' },
          { event: 'Stage I Computer Based Exam (INET)', date: 'September 2026' }
        ]),
        application_fee: JSON.stringify([
          { category: 'General / OBC / EWS', fee: '₹ 550/- + 18% GST' },
          { category: 'SC / ST Candidates', fee: '₹ 550/- + 18% GST' },
          { category: 'Payment Mode', fee: 'Pay Exam Fee Through Online Net Banking, Debit Card, Credit Card or UPI Fee Mode Only.' }
        ]),
        age_limit: JSON.stringify({
          as_on: 'Agniveer 01/2026 Batch Criteria',
          min_age: '17.5 Years',
          max_age: '21 Years',
          relaxation: 'Candidates Should Born Between 01/11/2004 to 30/04/2007 (Both Dates Inclusive). Read Notification for Age Relaxation details.'
        }),
        vacancy_details: JSON.stringify([
          {
            post_name: 'Agniveer (SSR) - Senior Secondary Recruit',
            total_post: '4,000+ Posts',
            eligibility: '10+2 Intermediate Exam with Mathematics & Physics and at least one subject from Chemistry / Biology / Computer Science from a recognized Board in India.'
          },
          {
            post_name: 'Agniveer (MR) - Matric Recruit (Chef / Steward / Hygienist)',
            total_post: '300+ Posts',
            eligibility: 'Class 10th High School Exam Passed from any Recognized Board in India.'
          }
        ]),
        category_details: JSON.stringify([
          { post_name: 'Agniveer SSR (Male)', ur: '1600', ews: '400', obc: '1080', sc: '600', st: '320', total: '4000' },
          { post_name: 'Agniveer SSR (Female)', ur: '320', ews: '80', obc: '216', sc: '120', st: '64', total: '800' },
          { post_name: 'Agniveer MR (Male/Female)', ur: '120', ews: '30', obc: '81', sc: '45', st: '24', total: '300' }
        ]),
        how_to_apply: `How to Download Indian Navy Agniveer SSR / MR Admit Card 2026:
1. Candidate can download Indian Navy Agniveer SSR / MR Hall Ticket through the official website www.joinindiannavy.gov.in or directly click on the download link given below.
2. Select your registered State and solve the Captcha security code to access candidate login.
3. Enter your Registered Email ID and Password to sign in to your dashboard.
4. Click on Current Opportunities / Application Status and select Agniveer 01/2026 Batch.
5. Click on Download Computer Based Examination Admit Card / Hall Ticket.
6. Check your Shift Timing, Reporting Time, Exam City, and Venue Address carefully.
7. Print out 2 color copies of the Admit Card along with original Photo ID Card (Aadhaar Card / Voter ID / Passport) and 2 passport size photographs to carry to the test center.`,
        links: JSON.stringify([
          { label: 'Download Admit Card (Server I)', url: 'https://www.joinindiannavy.gov.in', btn_text: 'Click Here' },
          { label: 'Download Admit Card (Server II)', url: 'https://www.joinindiannavy.gov.in', btn_text: 'Click Here' },
          { label: 'Check Exam City & Date Slip', url: 'https://www.joinindiannavy.gov.in', btn_text: 'Click Here' },
          { label: 'Indian Navy Online Mock Test', url: 'https://www.joinindiannavy.gov.in', btn_text: 'Click Here' },
          { label: 'Download Official Notification PDF', url: 'https://www.joinindiannavy.gov.in', btn_text: 'Click Here' },
          { label: 'Join Indian Navy Official Website', url: 'https://www.joinindiannavy.gov.in', btn_text: 'Click Here' }
        ]),
        admit_card_url: 'https://www.joinindiannavy.gov.in',
        official_website_url: 'https://www.joinindiannavy.gov.in'
      },

      // ANSWER KEY
      {
        title: 'SSC GD Constable 2026 Provisional Answer Key with Response Sheet',
        slug: 'ssc-gd-constable-answer-key-2026',
        category: 'answer-key',
        department: 'Staff Selection Commission (SSC)',
        post_date: '26 September 2026',
        short_desc: 'Staff Selection Commission has uploaded candidate response sheets along with tentative answer keys for Constable (GD) in CAPFs, SSF and Rifleman (GD) in Assam Rifles Examination.',
        links: JSON.stringify([
          { label: 'Download Tentative Answer Key & Response Sheet', url: 'https://ssc.gov.in', btn_text: 'Click Here' },
          { label: 'Submit Online Objection / Representation', url: 'https://ssc.gov.in', btn_text: 'Click Here' }
        ])
      },

      {
        title: 'UP Police Constable 2026 Master Question Paper & Official Answer Key',
        slug: 'up-police-constable-official-answer-key-2026',
        category: 'answer-key',
        department: 'UPPRPB Lucknow',
        post_date: '21 September 2026',
        short_desc: 'UPPRPB releases shift-wise answer key and objection submission window for Constable civil police exam.',
        links: [
          { label: 'Download Shift-wise Answer Key PDF', url: '/uploads/upp-answerkey.pdf', btn_text: 'Click Here' }
        ]
      },

      {
        title: 'NTA JEE Main 2026 Session 1 Final Answer Key Out',
        slug: 'nta-jee-main-final-answer-key-2026',
        category: 'answer-key',
        department: 'National Testing Agency (NTA)',
        post_date: '15 September 2026',
        short_desc: 'Download final revised answer key for Paper 1 (B.E./B.Tech) conducted by NTA.',
        links: [
          { label: 'Download JEE Final Answer Key PDF', url: '/uploads/jee-final-key.pdf', btn_text: 'Click Here' }
        ]
      },

      // SYLLABUS
      {
        title: 'SSC CGL 2026 New Exam Pattern & Detailed Syllabus PDF',
        slug: 'ssc-cgl-new-syllabus-2026',
        category: 'syllabus',
        department: 'Staff Selection Commission (SSC)',
        post_date: '24 September 2026',
        short_desc: 'Check detailed subject-wise syllabus for SSC CGL Tier 1 and Tier 2 including Reasoning, Quantitative Aptitude, English, General Awareness, and Computer Proficiency.',
        links: JSON.stringify([
          { label: 'Download CGL Syllabus PDF in English', url: '/uploads/ssc-cgl-syllabus-en.pdf', btn_text: 'Click Here' },
          { label: 'Download CGL Syllabus PDF in Hindi', url: '/uploads/ssc-cgl-syllabus-hi.pdf', btn_text: 'Click Here' }
        ])
      },

      {
        title: 'UP Police Sub Inspector SI New Syllabus & Physical Test Norms 2026',
        slug: 'up-police-si-syllabus-2026',
        category: 'syllabus',
        department: 'UPPRPB',
        post_date: '20 September 2026',
        short_desc: 'Get full syllabus for UP SI including General Hindi, Constitution / Law, Mental Ability, Intelligence Quotient Test.',
        links: [
          { label: 'Download UP SI Syllabus in Hindi PDF', url: '/uploads/upsi-syllabus.pdf', btn_text: 'Click Here' }
        ]
      },

      {
        title: 'Railway RRB ALP & Technician Syllabus & CBT 2 Technical Trades',
        slug: 'rrb-alp-technician-syllabus-2026',
        category: 'syllabus',
        department: 'Railway Recruitment Boards (RRB)',
        post_date: '18 September 2026',
        short_desc: 'Railway Recruitment Boards (RRB) has released the detailed Syllabus & Exam Pattern for Assistant Loco Pilot (ALP) and Technician recruitment. Candidates can check CBT 1 screening test pattern, CBT 2 Part A (Maths, Reasoning, Basic Science & Engineering), and CBT 2 Part B ITI trade syllabus with negative marking scheme.',
        total_vacancy: '14,298 Posts (Exam Scheme)',
        important_dates: JSON.stringify([
          { event: 'RRB CEN Notification Released', date: '18/09/2026' },
          { event: 'Syllabus & Exam Pattern Available', date: '18/09/2026' },
          { event: 'CBT 1 Exam Date', date: 'Announced Soon' },
          { event: 'CBT 1 Exam City Intimation', date: '10 Days Before Exam' },
          { event: 'CBT 1 Admit Card Release', date: '4 Days Before Exam' },
          { event: 'CBT 2 Exam Date', date: 'To be notified later' }
        ]),
        application_fee: JSON.stringify([
          { category: 'General / OBC / EWS', fee: '₹ 0/- (Free Syllabus Download)' },
          { category: 'SC / ST / PH / Female', fee: '₹ 0/- (Free Syllabus Download)' },
          { category: 'CBT Model Mock Papers', fee: '₹ 0/- (No Fee Required)' },
          { category: 'Official Exam Scheme PDF', fee: 'Available to all candidates free of cost' }
        ]),
        age_limit: JSON.stringify({
          as_on: '01/07/2026',
          min_age: '18 Years',
          max_age: '33 Years (ALP & Technician)',
          relaxation: 'OBC: 3 Years, SC / ST: 5 Years, Ex-Servicemen as per RRB rules'
        }),
        vacancy_details: JSON.stringify([
          {
            post_name: 'First Stage CBT (CBT 1)',
            total_post: '75 Questions / 60 Min',
            eligibility: 'Screening Test: Mathematics (20 Qs), Mental Ability & Reasoning (25 Qs), General Science (20 Qs), General Awareness on Current Affairs (10 Qs). Negative marking: 1/3rd.'
          },
          {
            post_name: 'Second Stage CBT - Part A',
            total_post: '100 Questions / 90 Min',
            eligibility: 'Decides Final Merit: Mathematics (25 Qs), General Intelligence & Reasoning (25 Qs), Basic Science & Engineering (40 Qs), General Awareness (10 Qs). Negative marking: 1/3rd.'
          },
          {
            post_name: 'Second Stage CBT - Part B (Trade Test)',
            total_post: '75 Questions / 60 Min',
            eligibility: 'Qualifying Only (35% marks required). Questions from relevant ITI / Engineering trade syllabus (Electrician, Fitter, Diesel Mechanic, Turner, Electronic Mech, etc.) as per DGET.'
          },
          {
            post_name: 'Computer Based Aptitude Test (CBAT)',
            total_post: '5 Test Batteries',
            eligibility: 'Only for Assistant Loco Pilot (ALP) candidates. Candidates equal to 8 times the vacancy will be shortlisted. Must score minimum T-score of 42 in each battery. No negative marking.'
          },
          {
            post_name: 'Document Verification & Medical Exam',
            total_post: 'Final Stage',
            eligibility: 'For candidates qualifying CBT 2 & CBAT. ALP requires A-1 medical fitness (Distant Vision: 6/6, 6/6 without glasses). Technician requires A-3 / B-1 / B-2 standards.'
          }
        ]),
        category_details: JSON.stringify([
          {
            post_name: 'CBT 1 Minimum Qualifying %',
            ur: '40%',
            ews: '40%',
            obc: '30%',
            sc: '30%',
            st: '25%',
            total: 'Screening'
          },
          {
            post_name: 'CBT 2 Part A Qualifying %',
            ur: '40%',
            ews: '40%',
            obc: '30%',
            sc: '30%',
            st: '25%',
            total: 'Merit'
          },
          {
            post_name: 'CBT 2 Part B (Trade Test)',
            ur: '35%',
            ews: '35%',
            obc: '35%',
            sc: '35%',
            st: '35%',
            total: 'Qualifying'
          }
        ]),
        how_to_apply: '1. Railway Recruitment Boards (RRB) Assistant Loco Pilot (ALP) and Technician Recruitment 2026 Examination Scheme and Detailed Syllabus is available online on official regional RRB portals.\n2. Examination Structure: The recruitment process comprises 1st Stage CBT, 2nd Stage CBT (Part A & Part B), Computer Based Aptitude Test (CBAT for ALP only), and Document Verification / Medical Examination.\n3. Negative Marking: There is 1/3rd negative marking for each wrong answer in both CBT 1 and CBT 2. There is no negative marking in the CBAT (Aptitude Test).\n4. CBT 1 consists of 75 objective type questions (60 minutes duration) covering Mathematics, General Intelligence & Reasoning, General Science, and Current Affairs.\n5. CBT 2 Part A has 100 questions (90 minutes) with high weightage on Basic Science & Engineering (40 marks), which determines the merit list.\n6. CBT 2 Part B is a 75 question trade-specific test (60 minutes) to test practical knowledge of chosen ITI/Diploma engineering trade.\n7. Candidates can download the official subject-wise syllabus PDF and Technical Trade syllabus from the direct links provided below.',
        links: JSON.stringify([
          { label: 'Download RRB ALP & Technician CBT 1 Syllabus (PDF)', url: 'https://rrbapply.gov.in', btn_text: 'Click Here' },
          { label: 'Download CBT 2 Part A (Basic Science & Engg) Syllabus', url: 'https://rrbapply.gov.in', btn_text: 'Click Here' },
          { label: 'Download CBT 2 Part B Technical Trade Syllabus (PDF)', url: 'https://rrbapply.gov.in', btn_text: 'Click Here' },
          { label: 'Download Official Exam Pattern & Selection Scheme', url: 'https://rrbapply.gov.in', btn_text: 'Click Here' },
          { label: 'Download Official RRB Notification PDF', url: 'https://rrbapply.gov.in', btn_text: 'Click Here' },
          { label: 'Join Odisha Aspirants Telegram Channel', url: 'https://t.me/odishaaspirantsofficial', btn_text: 'Join Telegram' },
          { label: 'Join Odisha Aspirants WhatsApp Channel', url: 'https://whatsapp.com/channel/0029VbBps5S7dmeYQLDLyB10', btn_text: 'Join WhatsApp' },
          { label: 'RRB Official Recruitment Portal', url: 'https://rrbapply.gov.in', btn_text: 'Official Portal' }
        ]),
        official_website_url: 'https://indianrailways.gov.in'
      },

      // ADMISSION
      {
        title: 'NTA NEET UG 2026 Entrance Examination Online Application Form',
        slug: 'nta-neet-ug-admission-2026',
        category: 'admission',
        department: 'National Testing Agency (NTA)',
        post_date: '19 September 2026',
        last_date: '15/10/2026',
        short_desc: 'National Eligibility Cum Entrance Test NEET (UG) 2026 admission for MBBS, BDS, BAMS, BHMS and allied medical courses across India.',
        links: JSON.stringify([
          { label: 'Apply Online for NEET UG', url: 'https://exams.nta.ac.in/NEET/', btn_text: 'Click Here' },
          { label: 'Download Information Bulletin', url: '/uploads/neet-bulletin.pdf', btn_text: 'Click Here' }
        ])
      },

      {
        title: 'UP B.Ed Joint Entrance Exam JEE 2026 Online Form',
        slug: 'up-bed-joint-entrance-exam-2026',
        category: 'admission',
        department: 'Bundelkhand University Jhansi',
        post_date: '14 September 2026',
        short_desc: 'Uttar Pradesh 2 Year Bachelor of Education (B.Ed) Entrance Examination 2026 online registration.',
        links: [
          { label: 'Apply Online', url: 'https://bujhansi.ac.in', btn_text: 'Click Here' }
        ]
      },

      {
        title: 'Kendriya Vidyalaya KVS Class 1 Online Admission Registration 2026',
        slug: 'kvs-class-1-admission-registration-2026',
        category: 'admission',
        department: 'Kendriya Vidyalaya Sangathan (KVS)',
        post_date: '10 September 2026',
        short_desc: 'KVS online portal opens registration for Class 1 admission across all Kendriya Vidyalayas in India.',
        links: [
          { label: 'Register for Class 1 Online', url: 'https://kvsonlineadmission.kvs.gov.in', btn_text: 'Click Here' }
        ]
      },

      // CERTIFICATE VERIFICATION
      {
        title: 'NTA UGC NET E-Certificate & JRF Award Letter Download 2026',
        slug: 'nta-ugc-net-e-certificate-2026',
        category: 'certificate-verification',
        department: 'National Testing Agency / UGC',
        post_date: '25 September 2026',
        short_desc: 'Qualified candidates can download electronic certificate and Junior Research Fellowship award letter by roll number.',
        links: [
          { label: 'Download E-Certificate', url: 'https://ugcnet.nta.nic.in', btn_text: 'Click Here' }
        ]
      },

      {
        title: 'Pan Card Online Apply, Correction & Status Verification 2026',
        slug: 'pan-card-online-apply-correction-2026',
        category: 'certificate-verification',
        department: 'NSDL / UTIITSL / Income Tax Department',
        post_date: '05 September 2026',
        short_desc: 'Apply new PAN card, link Aadhaar with PAN card, correction in name/DOB, and track dispatch status.',
        links: [
          { label: 'Apply New PAN Card (NSDL)', url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html', btn_text: 'Click Here' },
          { label: 'Link Aadhaar to PAN', url: 'https://eportal.incometax.gov.in', btn_text: 'Click Here' }
        ]
      },

      {
        title: 'Aadhaar Card Download, PVC Card Order & Update Status 2026',
        slug: 'aadhaar-card-download-update-status-2026',
        category: 'certificate-verification',
        department: 'UIDAI',
        post_date: '02 September 2026',
        short_desc: 'Download e-Aadhaar, verify registered mobile number, check biometric lock status, and order Aadhaar PVC card.',
        links: [
          { label: 'Download e-Aadhaar PDF', url: 'https://myaadhaar.uidai.gov.in', btn_text: 'Click Here' },
          { label: 'Order Aadhaar PVC Card', url: 'https://myaadhaar.uidai.gov.in', btn_text: 'Click Here' }
        ]
      },

      // IMPORTANT
      {
        title: 'UP Scholarship 2026-27 Online Form Pre & Post Matric',
        slug: 'up-scholarship-online-form-2026-27',
        category: 'important',
        department: 'Social Welfare Department, Government of Uttar Pradesh',
        post_date: '22 September 2026',
        short_desc: 'Uttar Pradesh Government invites online scholarship applications for Pre-Matric (9th & 10th) and Post-Matric (11th, 12th, Dashmottar, Degree & Diploma).',
        links: [
          { label: 'Apply Online (Fresh Student)', url: 'https://scholarship.up.gov.in', btn_text: 'Click Here' },
          { label: 'Student Login (Renewal)', url: 'https://scholarship.up.gov.in', btn_text: 'Click Here' }
        ]
      },

      {
        title: 'NIELIT CCC Online Form, Exam Admit Card & Result 2026',
        slug: 'nielit-ccc-online-form-admit-card-result-2026',
        category: 'important',
        department: 'National Institute of Electronics and Information Technology (NIELIT)',
        post_date: '15 September 2026',
        short_desc: 'Course on Computer Concepts (CCC) monthly online examination registration, admit card download and certificate verification.',
        links: [
          { label: 'CCC Online Form Registration', url: 'https://student.nielit.gov.in', btn_text: 'Click Here' },
          { label: 'Download CCC Admit Card', url: 'https://student.nielit.gov.in', btn_text: 'Click Here' },
          { label: 'Check CCC Exam Result', url: 'https://student.nielit.gov.in', btn_text: 'Click Here' }
        ]
      }
    ];

    for (const p of posts) {
      const linksStr = typeof p.links === 'string' ? p.links : JSON.stringify(p.links || []);
      await d1.prepare(`
        INSERT INTO posts (
          title, slug, category, department, post_date, last_date,
          short_desc, total_vacancy, important_dates, application_fee,
          age_limit, vacancy_details, category_details, how_to_apply,
          links, notification_pdf, admit_card_url, result_url,
          apply_online_url, official_website_url, is_featured, status
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, 'active'
        )
      `).bind(
        p.title,
        p.slug,
        p.category,
        p.department || null,
        p.post_date || null,
        p.last_date || null,
        p.short_desc || null,
        p.total_vacancy || null,
        p.important_dates || null,
        p.application_fee || null,
        p.age_limit || null,
        p.vacancy_details || null,
        p.category_details || null,
        p.how_to_apply || null,
        linksStr,
        p.notification_pdf || null,
        p.admit_card_url || null,
        p.result_url || null,
        p.apply_online_url || null,
        p.official_website_url || null,
        p.is_featured || 0
      ).run();
    }
    console.log(`✅ Seeded ${posts.length} comprehensive posts across all categories.`);
  }

  console.log('🎉 Database seeding complete!');
}

module.exports = seedDatabase;

if (require.main === module) {
  seedDatabase().then(() => process.exit(0)).catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}
