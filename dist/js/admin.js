// Admin helper functions

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard: ' + text);
    }).catch(err => {
      prompt('Copy link:', text);
    });
  } else {
    prompt('Copy link:', text);
  }
}

// Mobile Sidebar Drawer Toggle & Live Clock
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('adminSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const bottomMenuBtn = document.getElementById('bottomMenuTrigger');
  const closeBtn = document.getElementById('sidebarCloseBtn');

  function openSidebar() {
    if (sidebar && backdrop) {
      sidebar.classList.add('open');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSidebar() {
    if (sidebar && backdrop) {
      sidebar.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
  if (bottomMenuBtn) {
    bottomMenuBtn.addEventListener('click', function() {
      if (sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);
  if (sidebar) {
    sidebar.querySelectorAll('a.nav-item').forEach(function(link) {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 992) closeSidebar();
      });
    });
  }

  // Live Clock
  function updateClock() {
    const clockEl = document.getElementById('clockTime');
    if (!clockEl) return;
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('en-IN', { hour12: true });
  }
  setInterval(updateClock, 1000);
  updateClock();
});

// Interactive Table Row Builders for Post Form
document.addEventListener('DOMContentLoaded', function() {
  const postForm = document.querySelector('form[action*="/posts/"]');
  if (!postForm) return;

  // 1. Important Dates Builder
  const datesContainer = document.getElementById('dates-rows-container');
  const addDateBtn = document.getElementById('btn-add-date');
  const datesJsonInput = document.getElementById('important_dates');

  if (datesContainer && datesJsonInput) {
    try {
      const initialDates = JSON.parse(datesJsonInput.value || '[]');
      if (Array.isArray(initialDates) && initialDates.length > 0) {
        initialDates.forEach(d => addDateRow(d.event, d.date));
      } else {
        addDateRow('Application Begin', '');
        addDateRow('Last Date for Apply Online', '');
        addDateRow('Pay Exam Fee Last Date', '');
        addDateRow('Exam Date', 'As per Schedule');
        addDateRow('Admit Card Available', 'Before Exam');
      }
    } catch (e) {
      addDateRow('Application Begin', '');
      addDateRow('Last Date for Apply Online', '');
      addDateRow('Pay Exam Fee Last Date', '');
      addDateRow('Exam Date', 'As per Schedule');
      addDateRow('Admit Card Available', 'Before Exam');
    }

    if (addDateBtn) {
      addDateBtn.addEventListener('click', () => addDateRow('', ''));
    }
  }

  function addDateRow(eventVal = '', dateVal = '') {
    const row = document.createElement('div');
    row.className = 'dynamic-row dynamic-row-dates';
    row.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px; align-items: center; min-width: 320px;';
    row.innerHTML = `
      <input type="text" placeholder="Event (e.g. Application Begin)" value="${eventVal || ''}" class="form-control date-event" style="flex: 1;">
      <input type="text" placeholder="Date (e.g. 25/10/2026)" value="${dateVal || ''}" class="form-control date-value" style="flex: 1;">
      <button type="button" class="btn btn-danger btn-sm" style="padding: 6px 10px;" onclick="this.parentElement.remove()" title="Remove row">✕</button>
    `;
    datesContainer.appendChild(row);
  }

  // 2. Application Fee Builder
  const feeContainer = document.getElementById('fee-rows-container');
  const addFeeBtn = document.getElementById('btn-add-fee');
  const feeJsonInput = document.getElementById('application_fee');

  if (feeContainer && feeJsonInput) {
    try {
      const initialFees = JSON.parse(feeJsonInput.value || '[]');
      if (Array.isArray(initialFees) && initialFees.length > 0) {
        initialFees.forEach(f => addFeeRow(f.category, f.fee));
      } else {
        addFeeRow('General / OBC / EWS', '');
        addFeeRow('SC / ST / PH', '');
        addFeeRow('Payment Mode', 'Online Debit Card, Credit Card, Net Banking or UPI');
      }
    } catch (e) {
      addFeeRow('General / OBC / EWS', '');
      addFeeRow('SC / ST / PH', '');
      addFeeRow('Payment Mode', 'Online Debit Card, Credit Card, Net Banking or UPI');
    }

    if (addFeeBtn) {
      addFeeBtn.addEventListener('click', () => addFeeRow('', ''));
    }
  }

  function addFeeRow(catVal = '', feeVal = '') {
    const row = document.createElement('div');
    row.className = 'dynamic-row dynamic-row-fees';
    row.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px; align-items: center; min-width: 320px;';
    row.innerHTML = `
      <input type="text" placeholder="Category (e.g. General / OBC)" value="${catVal || ''}" class="form-control fee-category" style="flex: 1;">
      <input type="text" placeholder="Fee Amount (e.g. ₹ 100/-)" value="${feeVal || ''}" class="form-control fee-amount" style="flex: 1;">
      <button type="button" class="btn btn-danger btn-sm" style="padding: 6px 10px;" onclick="this.parentElement.remove()" title="Remove row">✕</button>
    `;
    feeContainer.appendChild(row);
  }

  // 3. Vacancy Details Builder
  const vacContainer = document.getElementById('vac-rows-container');
  const addVacBtn = document.getElementById('btn-add-vac');
  const vacJsonInput = document.getElementById('vacancy_details');

  if (vacContainer && vacJsonInput) {
    try {
      const initialVac = JSON.parse(vacJsonInput.value || '[]');
      if (Array.isArray(initialVac) && initialVac.length > 0) {
        initialVac.forEach(v => addVacRow(v.post_name, v.total_post, v.eligibility));
      } else {
        addVacRow('', '', '');
      }
    } catch (e) {
      addVacRow('', '', '');
    }

    if (addVacBtn) {
      addVacBtn.addEventListener('click', () => addVacRow('', '', ''));
    }
  }

  function addVacRow(nameVal = '', totalVal = '', eligVal = '') {
    const row = document.createElement('div');
    row.className = 'dynamic-row dynamic-row-vac';
    row.style.cssText = 'display: grid; grid-template-columns: 2fr 1fr 3fr auto; gap: 8px; margin-bottom: 8px; align-items: center; min-width: 520px;';
    row.innerHTML = `
      <input type="text" placeholder="Post Name" value="${nameVal || ''}" class="form-control vac-name">
      <input type="text" placeholder="Total Posts" value="${totalVal || ''}" class="form-control vac-total">
      <input type="text" placeholder="Eligibility Criteria" value="${eligVal || ''}" class="form-control vac-elig">
      <button type="button" class="btn btn-danger btn-sm" style="padding: 6px 10px;" onclick="this.parentElement.remove()" title="Remove row">✕</button>
    `;
    vacContainer.appendChild(row);
  }

  // 4. Category-Wise Vacancy Distribution Builder (Dynamic Rows & Columns)
  const catContainer = document.getElementById('cat-rows-container');
  const addCatBtn = document.getElementById('btn-add-cat');
  const addCatColBtn = document.getElementById('btn-add-cat-col');
  const catJsonInput = document.getElementById('category_details');

  let catColumns = ['Post / Group Name', 'UR / Gen', 'EWS', 'OBC', 'SC', 'ST', 'Total'];
  let catRows = [];

  function normalizeRowLength(row, len) {
    const out = Array.isArray(row) ? row.slice(0, len) : [];
    while (out.length < len) out.push('');
    return out;
  }

  function renderCatTable() {
    if (!catContainer) return;
    catContainer.innerHTML = '';

    const table = document.createElement('table');
    table.style.cssText = 'width: 100%; border-collapse: separate; border-spacing: 4px; min-width: ' + Math.max(420, catColumns.length * 115 + 50) + 'px;';

    // Header row with editable column titles and delete column buttons
    const thead = document.createElement('thead');
    const headTr = document.createElement('tr');
    catColumns.forEach((colName, colIdx) => {
      const th = document.createElement('th');
      th.style.cssText = 'padding: 2px; vertical-align: middle; font-weight: 600;';
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display: flex; align-items: center; gap: 4px;';

      const colInput = document.createElement('input');
      colInput.type = 'text';
      colInput.className = 'form-control cat-col-header';
      colInput.style.cssText = 'font-weight: 700; font-size: 12px; background: #eff6ff; border-color: #93c5fd; padding: 6px 8px;';
      colInput.placeholder = 'Col ' + (colIdx + 1);
      colInput.value = colName || '';
      colInput.addEventListener('input', () => {
        catColumns[colIdx] = colInput.value;
      });
      wrap.appendChild(colInput);

      if (catColumns.length > 1) {
        const delColBtn = document.createElement('button');
        delColBtn.type = 'button';
        delColBtn.className = 'btn btn-danger btn-sm';
        delColBtn.style.cssText = 'padding: 4px 7px; font-size: 11px; flex-shrink: 0;';
        delColBtn.title = 'Remove column';
        delColBtn.textContent = '✕';
        delColBtn.addEventListener('click', () => {
          if (catColumns.length <= 1) return;
          catColumns.splice(colIdx, 1);
          catRows = catRows.map(r => r.filter((_, i) => i !== colIdx));
          renderCatTable();
        });
        wrap.appendChild(delColBtn);
      }

      th.appendChild(wrap);
      headTr.appendChild(th);
    });

    const actionTh = document.createElement('th');
    actionTh.style.cssText = 'width: 38px; text-align: center; font-size: 11px; color: #64748b;';
    actionTh.textContent = 'Row';
    headTr.appendChild(actionTh);
    thead.appendChild(headTr);
    table.appendChild(thead);

    // Body rows
    const tbody = document.createElement('tbody');
    catRows.forEach((rowVals, rowIdx) => {
      const tr = document.createElement('tr');
      catColumns.forEach((_, colIdx) => {
        const td = document.createElement('td');
        td.style.cssText = 'padding: 2px;';
        const cellInput = document.createElement('input');
        cellInput.type = 'text';
        cellInput.className = 'form-control cat-cell';
        cellInput.placeholder = catColumns[colIdx] || 'Value';
        cellInput.value = rowVals[colIdx] || '';
        cellInput.addEventListener('input', () => {
          catRows[rowIdx][colIdx] = cellInput.value;
        });
        td.appendChild(cellInput);
        tr.appendChild(td);
      });

      const delTd = document.createElement('td');
      delTd.style.cssText = 'text-align: center; padding: 2px;';
      const delRowBtn = document.createElement('button');
      delRowBtn.type = 'button';
      delRowBtn.className = 'btn btn-danger btn-sm';
      delRowBtn.style.cssText = 'padding: 6px 10px;';
      delRowBtn.title = 'Remove row';
      delRowBtn.textContent = '✕';
      delRowBtn.addEventListener('click', () => {
        catRows.splice(rowIdx, 1);
        if (catRows.length === 0) {
          catRows.push(new Array(catColumns.length).fill(''));
        }
        renderCatTable();
      });
      delTd.appendChild(delRowBtn);
      tr.appendChild(delTd);
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    catContainer.appendChild(table);
  }

  if (catContainer && catJsonInput) {
    try {
      const parsedCat = JSON.parse(catJsonInput.value || '[]');
      if (parsedCat && !Array.isArray(parsedCat) && Array.isArray(parsedCat.columns) && parsedCat.columns.length > 0) {
        catColumns = parsedCat.columns.map(c => String(c || ''));
        catRows = Array.isArray(parsedCat.rows) && parsedCat.rows.length > 0
          ? parsedCat.rows.map(r => normalizeRowLength(r, catColumns.length))
          : [new Array(catColumns.length).fill('')];
      } else if (Array.isArray(parsedCat) && parsedCat.length > 0) {
        catRows = parsedCat.map(c => [
          c.post_name || '', c.ur || '', c.ews || '', c.obc || '', c.sc || '', c.st || '', c.total || ''
        ]);
      } else {
        catRows = [new Array(catColumns.length).fill('')];
      }
    } catch (e) {
      catRows = [new Array(catColumns.length).fill('')];
    }

    renderCatTable();

    if (addCatBtn) {
      addCatBtn.addEventListener('click', () => {
        catRows.push(new Array(catColumns.length).fill(''));
        renderCatTable();
      });
    }

    if (addCatColBtn) {
      addCatColBtn.addEventListener('click', () => {
        catColumns.push('Col ' + (catColumns.length + 1));
        catRows = catRows.map(r => [...r, '']);
        renderCatTable();
      });
    }
  }

  // 4B. Post Thumbnail Preview & Remove Controls
  const thumbFileInput = document.getElementById('thumbnail_file');
  const thumbUrlInput = document.getElementById('thumbnail_url');
  const thumbPreviewImg = document.getElementById('thumbPreviewImg');
  const thumbNoImgText = document.getElementById('thumbNoImgText');
  const removeThumbBtn = document.getElementById('removeThumbBtn');

  if (thumbFileInput && thumbPreviewImg) {
    thumbFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        thumbPreviewImg.src = evt.target.result;
        thumbPreviewImg.style.display = 'block';
        if (thumbNoImgText) thumbNoImgText.style.display = 'none';
      };
      reader.readAsDataURL(file);
    });
  }

  if (thumbUrlInput && thumbPreviewImg) {
    thumbUrlInput.addEventListener('input', () => {
      const val = thumbUrlInput.value.trim();
      if (val) {
        thumbPreviewImg.src = val;
        thumbPreviewImg.style.display = 'block';
        if (thumbNoImgText) thumbNoImgText.style.display = 'none';
      } else {
        thumbPreviewImg.src = '';
        thumbPreviewImg.style.display = 'none';
        if (thumbNoImgText) thumbNoImgText.style.display = 'inline-block';
      }
    });
  }

  if (removeThumbBtn && thumbUrlInput) {
    removeThumbBtn.addEventListener('click', () => {
      thumbUrlInput.value = '';
      if (thumbFileInput) thumbFileInput.value = '';
      if (thumbPreviewImg) {
        thumbPreviewImg.src = '';
        thumbPreviewImg.style.display = 'none';
      }
      if (thumbNoImgText) thumbNoImgText.style.display = 'inline-block';
    });
  }

  // 5. Category-Wise Age Limit Builder
  const ageContainer = document.getElementById('age-rows-container');
  const addAgeBtn = document.getElementById('btn-add-age');
  const ageJsonInput = document.getElementById('age_limit');

  function addAgeRow(catVal = '', minVal = '', maxVal = '') {
    if (!ageContainer) return;
    const row = document.createElement('div');
    row.className = 'dynamic-row dynamic-row-age';
    row.style.cssText = 'display: grid; grid-template-columns: 2fr 1.2fr 1.2fr auto; gap: 8px; margin-bottom: 8px; align-items: center; min-width: 440px;';

    const catInput = document.createElement('input');
    catInput.type = 'text';
    catInput.placeholder = 'Category (e.g. General / UR, OBC, SC / ST)';
    catInput.className = 'form-control age-cat';
    catInput.value = catVal || '';

    const minInput = document.createElement('input');
    minInput.type = 'text';
    minInput.placeholder = 'Min Age (e.g. 18 Years)';
    minInput.className = 'form-control age-min';
    minInput.value = minVal || '';

    const maxInput = document.createElement('input');
    maxInput.type = 'text';
    maxInput.placeholder = 'Max Age (e.g. 27 Years)';
    maxInput.className = 'form-control age-max';
    maxInput.value = maxVal || '';

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn btn-danger btn-sm';
    delBtn.style.cssText = 'padding: 6px 10px;';
    delBtn.title = 'Remove row';
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', () => row.remove());

    row.appendChild(catInput);
    row.appendChild(minInput);
    row.appendChild(maxInput);
    row.appendChild(delBtn);
    ageContainer.appendChild(row);
  }

  if (ageJsonInput) {
    try {
      const ageVal = ageJsonInput.value ? JSON.parse(ageJsonInput.value) : {};
      if (document.getElementById('age_as_on')) document.getElementById('age_as_on').value = ageVal.as_on || '';
      if (document.getElementById('age_relaxation')) document.getElementById('age_relaxation').value = ageVal.relaxation || '';

      if (ageContainer) {
        if (Array.isArray(ageVal.categories) && ageVal.categories.length > 0) {
          ageVal.categories.forEach(item => addAgeRow(item.category, item.min_age, item.max_age));
        } else if (ageVal.min_age || ageVal.max_age) {
          addAgeRow('General / All Categories', ageVal.min_age || '', ageVal.max_age || '');
        } else {
          addAgeRow('General / UR', '', '');
          addAgeRow('OBC', '', '');
          addAgeRow('SC / ST', '', '');
        }
      }
    } catch (e) {
      console.error('Error parsing age_limit:', e);
      if (ageContainer) {
        addAgeRow('General / UR', '', '');
        addAgeRow('OBC', '', '');
        addAgeRow('SC / ST', '', '');
      }
    }

    if (addAgeBtn) {
      addAgeBtn.addEventListener('click', () => addAgeRow('', '', ''));
    }
  }

  // 6. Useful Important Links Builder
  const linksContainer = document.getElementById('links-rows-container');
  const addLinkBtn = document.getElementById('btn-add-link');
  const linksJsonInput = document.getElementById('links');

  if (linksContainer && linksJsonInput) {
    try {
      const initialLinks = JSON.parse(linksJsonInput.value || '[]');
      if (Array.isArray(initialLinks) && initialLinks.length > 0) {
        initialLinks.forEach(l => addLinkRow(l.label, l.url, l.btn_text));
      } else {
        addLinkRow('Apply Online', '', 'Click Here');
        addLinkRow('Download Notification', '', 'Click Here');
        addLinkRow('Official Website', '', 'Click Here');
      }
    } catch (e) {
      addLinkRow('Apply Online', '', 'Click Here');
      addLinkRow('Download Notification', '', 'Click Here');
      addLinkRow('Official Website', '', 'Click Here');
    }

    if (addLinkBtn) {
      addLinkBtn.addEventListener('click', () => addLinkRow('', '', 'Click Here'));
    }
  }

  function addLinkRow(labelVal = '', urlVal = '', btnVal = 'Click Here') {
    const row = document.createElement('div');
    row.className = 'dynamic-row dynamic-row-links';
    row.style.cssText = 'display: grid; grid-template-columns: 2fr 3fr 1fr auto; gap: 8px; margin-bottom: 8px; align-items: center; min-width: 480px;';
    row.innerHTML = `
      <input type="text" placeholder="Link Title (e.g. Apply Online)" value="${labelVal || ''}" class="form-control link-label">
      <input type="text" placeholder="URL (e.g. https://... or /uploads/...)" value="${urlVal || ''}" class="form-control link-url">
      <input type="text" placeholder="Button Text" value="${btnVal || 'Click Here'}" class="form-control link-btn">
      <button type="button" class="btn btn-danger btn-sm" style="padding: 6px 10px;" onclick="this.parentElement.remove()" title="Remove row">✕</button>
    `;
    linksContainer.appendChild(row);
  }

  // On form submission, synchronize all visual builders into JSON inputs
  function syncAllBuilders() {
    // Sync dates
    if (datesContainer && datesJsonInput) {
      const dateRows = datesContainer.querySelectorAll('.dynamic-row');
      const datesArr = [];
      dateRows.forEach(r => {
        const ev = r.querySelector('.date-event')?.value.trim();
        const dt = r.querySelector('.date-value')?.value.trim();
        if (ev || dt) datesArr.push({ event: ev, date: dt });
      });
      datesJsonInput.value = JSON.stringify(datesArr);
    }

    // Sync fees
    if (feeContainer && feeJsonInput) {
      const feeRows = feeContainer.querySelectorAll('.dynamic-row');
      const feeArr = [];
      feeRows.forEach(r => {
        const cat = r.querySelector('.fee-category')?.value.trim();
        const amt = r.querySelector('.fee-amount')?.value.trim();
        if (cat || amt) feeArr.push({ category: cat, fee: amt });
      });
      feeJsonInput.value = JSON.stringify(feeArr);
    }

    // Sync vacancies
    if (vacContainer && vacJsonInput) {
      const vacRows = vacContainer.querySelectorAll('.dynamic-row');
      const vacArr = [];
      vacRows.forEach(r => {
        const nm = r.querySelector('.vac-name')?.value.trim();
        const tot = r.querySelector('.vac-total')?.value.trim();
        const el = r.querySelector('.vac-elig')?.value.trim();
        if (nm || tot || el) vacArr.push({ post_name: nm, total_post: tot, eligibility: el });
      });
      vacJsonInput.value = JSON.stringify(vacArr);
    }

    // Sync category details (dynamic columns & rows)
    if (catContainer && catJsonInput) {
      const cleanCols = catColumns.map((c, idx) => (c || '').trim() || ('Column ' + (idx + 1)));
      const nonEmptyRows = catRows
        .map(r => normalizeRowLength(r, cleanCols.length).map(cell => (cell || '').trim()))
        .filter(r => r.some(cell => cell.length > 0));

      catJsonInput.value = nonEmptyRows.length > 0
        ? JSON.stringify({ columns: cleanCols, rows: nonEmptyRows })
        : '[]';
    }

    // Sync age limit (category-wise rows + optional as_on & relaxation note)
    if (ageJsonInput) {
      const asOn = document.getElementById('age_as_on')?.value.trim() || '';
      const relax = document.getElementById('age_relaxation')?.value.trim() || '';
      const categoriesArr = [];
      if (ageContainer) {
        ageContainer.querySelectorAll('.dynamic-row-age').forEach(r => {
          const cat = r.querySelector('.age-cat')?.value.trim() || '';
          const minAge = r.querySelector('.age-min')?.value.trim() || '';
          const maxAge = r.querySelector('.age-max')?.value.trim() || '';
          if (minAge || maxAge) {
            categoriesArr.push({
              category: cat || 'General',
              min_age: minAge,
              max_age: maxAge
            });
          }
        });
      }

      if (asOn || relax || categoriesArr.length > 0) {
        ageJsonInput.value = JSON.stringify({
          as_on: asOn,
          relaxation: relax,
          categories: categoriesArr
        });
      } else {
        ageJsonInput.value = '{}';
      }
    }

    // Sync links
    if (linksContainer && linksJsonInput) {
      const linkRows = linksContainer.querySelectorAll('.dynamic-row');
      const linkArr = [];
      linkRows.forEach(r => {
        const lb = r.querySelector('.link-label')?.value.trim();
        const ur = r.querySelector('.link-url')?.value.trim();
        const bt = r.querySelector('.link-btn')?.value.trim() || 'Click Here';
        if (lb || ur) {
          linkArr.push({ label: lb, url: ur, btn_text: bt });
        }
      });
      linksJsonInput.value = JSON.stringify(linkArr);
    }

    // Sync TinyMCE content to underlying textarea before submit
    if (typeof tinymce !== 'undefined' && !window.__isArticleRawHtmlMode) {
      const ed = tinymce.get('article_content');
      if (ed) {
        try {
          document.getElementById('article_content').value = ed.getContent();
        } catch (e) {}
      }
    }
  }

  window.__syncAllBuilders = syncAllBuilders;
  postForm.addEventListener('submit', syncAllBuilders);
  postForm.querySelectorAll('button[type="submit"], button[data-preview-btn]').forEach(btn => {
    btn.addEventListener('click', syncAllBuilders);
  });

  // Category History & Preserved Section Titles Controller
  const historyPanel = document.getElementById('categoryHistoryPanel');
  const titleField = document.getElementById('title');
  const categorySelect = document.getElementById('category');
  const bumpPrimaryCheckbox = document.getElementById('bumpPrimaryCheckbox');

  if (historyPanel && titleField && categorySelect) {
    const initialPrimaryCat = historyPanel.getAttribute('data-initial-primary') || '';
    let activePrimaryCat = categorySelect.value;

    const getCatElements = (catKey) => ({
      row: historyPanel.querySelector(`.cat-history-row[data-cat-key="${catKey}"]`),
      cb: historyPanel.querySelector(`.cat-history-checkbox[data-cat-key="${catKey}"]`),
      badge: historyPanel.querySelector(`.cat-primary-badge[data-cat-key="${catKey}"]`),
      input: historyPanel.querySelector(`.cat-history-title-input[data-cat-key="${catKey}"]`)
    });

    historyPanel.querySelectorAll('.cat-history-title-input').forEach(inp => {
      inp.addEventListener('input', () => {
        inp.dataset.manualEdit = '1';
      });
    });

    titleField.addEventListener('input', () => {
      const { input } = getCatElements(activePrimaryCat);
      if (input && input.dataset.manualEdit !== '1') {
        input.value = titleField.value;
      }
    });

    categorySelect.addEventListener('change', () => {
      const prevPrimary = activePrimaryCat;
      const nextPrimary = categorySelect.value;
      if (prevPrimary === nextPrimary) return;

      // Freeze & preserve previous primary category's saved section title
      const prevEls = getCatElements(prevPrimary);
      if (prevEls.cb) prevEls.cb.checked = true;
      if (prevEls.row) prevEls.row.style.borderColor = '#e2e8f0';
      if (prevEls.input && prevPrimary === initialPrimaryCat && prevEls.input.dataset.manualEdit !== '1') {
        const saved = prevEls.input.getAttribute('data-saved-title') || '';
        if (saved) prevEls.input.value = saved;
      }
      if (prevEls.badge) {
        prevEls.badge.textContent = (prevEls.input && prevEls.input.value.trim()) ? 'Preserved' : 'Optional';
        prevEls.badge.style.background = '#dcfce7';
        prevEls.badge.style.color = '#15803d';
      }

      // Activate new primary category & sync it to current Post Title (if not manually customized)
      const nextEls = getCatElements(nextPrimary);
      if (nextEls.cb) nextEls.cb.checked = true;
      if (nextEls.row) nextEls.row.style.borderColor = '#3b82f6';
      if (nextEls.badge) {
        nextEls.badge.textContent = 'Primary';
        nextEls.badge.style.background = '#dbeafe';
        nextEls.badge.style.color = '#1d4ed8';
      }
      if (nextEls.input && nextEls.input.dataset.manualEdit !== '1') {
        nextEls.input.value = titleField.value;
      }
      if (bumpPrimaryCheckbox && initialPrimaryCat && nextPrimary !== initialPrimaryCat) {
        bumpPrimaryCheckbox.checked = true;
      }

      activePrimaryCat = nextPrimary;
    });
  }
});

// TinyMCE 6 WYSIWYG Rich Text Editor Initialization for #article_content
document.addEventListener('DOMContentLoaded', function() {
  const articleEl = document.getElementById('article_content');
  if (!articleEl) return;

  window.__isArticleRawHtmlMode = false;
  let isTinyMceReady = false;
  let tinyMceRetries = 0;
  const uploadEndpoint = articleEl.getAttribute('data-upload-url') || '/admin/r2/upload-json';

  function initArticleTinyMce() {
    if (typeof tinymce === 'undefined') {
      if (tinyMceRetries < 20) {
        tinyMceRetries++;
        setTimeout(initArticleTinyMce, 400);
      }
      return;
    }

    try {
      if (tinymce.get('article_content')) {
        tinymce.get('article_content').remove();
      }
      tinymce.init({
        selector: '#article_content',
        height: (window.innerWidth <= 768 ? 320 : 450),
        menubar: false,
        toolbar_mode: 'sliding',
        plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
        toolbar: 'undo redo | blocks | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table link image code | removeformat preview fullscreen',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 15px; color: #334155; line-height: 1.7; padding: 14px; } h2, h3 { color: #0f172a; margin-top: 18px; margin-bottom: 8px; } table { width: 100%; border-collapse: collapse; margin: 14px 0; } th, td { border: 1px solid #93c5fd; padding: 8px 12px; } th { background: #f0f7ff; color: #1e40af; } blockquote { border-left: 4px solid #0066ff; padding-left: 14px; color: #334155; background: #f8fafc; padding: 10px 14px; } a { color: #0066ff; }',
        automatic_uploads: true,
        images_upload_handler: function(blobInfo) {
          return new Promise(function(resolve, reject) {
            const formData = new FormData();
            formData.append('file', blobInfo.blob(), blobInfo.filename());

            fetch(uploadEndpoint, {
              method: 'POST',
              body: formData
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
              if (data && data.url) {
                resolve(data.url);
              } else if (data && data.location) {
                resolve(data.location);
              } else {
                reject((data && data.error) || 'Image upload failed');
              }
            })
            .catch(function(err) {
              reject('Upload error: ' + err.message);
            });
          });
        },
        setup: function(editor) {
          editor.on('init', function() {
            isTinyMceReady = true;
            if (articleEl.value) {
              try { editor.setContent(articleEl.value); } catch (e) {}
            }
          });
          editor.on('change keyup input', function() {
            articleEl.value = editor.getContent();
          });
        }
      });
    } catch (e) {
      console.warn('TinyMCE init skipped:', e);
    }
  }

  initArticleTinyMce();

  const toggleBtn = document.getElementById('toggleArticleModeBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      if (!isTinyMceReady || typeof tinymce === 'undefined') return;
      const ed = tinymce.get('article_content');
      if (!ed) return;

      if (!window.__isArticleRawHtmlMode) {
        const html = ed.getContent();
        ed.hide();
        articleEl.style.display = 'block';
        articleEl.value = html;
        toggleBtn.innerHTML = '🎨 Visual Editor';
        window.__isArticleRawHtmlMode = true;
      } else {
        const html = articleEl.value;
        ed.show();
        ed.setContent(html);
        toggleBtn.innerHTML = '💻 HTML Code';
        window.__isArticleRawHtmlMode = false;
      }
    });
  }
});
