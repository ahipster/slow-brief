'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  createCandidates,
  publishCandidate,
  updateCandidate,
  updatePublishedBrief,
} from './actions';
import type {
  CandidateInput,
  CandidateRecord,
  CandidateSection,
  PublishedBriefRecord,
} from './types';

const MAX_FREE_WORDS = 200;

const REQUIRED_HEADERS = {
  slug: ['slug'],
  headline: ['headline', 'title'],
  freeHtml: ['freehtml', 'pre-content', 'precontent', 'pre_content', 'free'],
  paidHtml: ['paidhtml', 'paid'],
  sections: ['sections', 'subsections', 'sectionsjson', 'sections_json'],
  toc: ['toc', 'tableofcontents', 'table_of_contents'],
  publishDate: ['publishdate', 'publish_date', 'date'],
};

interface AdminPanelProps {
  initialCandidates: CandidateRecord[];
  initialPublished: PublishedBriefRecord[];
}

interface CandidateFormState {
  id: string;
  slug: string;
  headline: string;
  freeHtml: string;
  paidHtml: string;
  tocText: string;
  sectionsText: string;
  publishDate: string;
  status: 'candidate' | 'scheduled' | 'published';
}

interface PublishedFormState {
  id: string;
  slug: string;
  headline: string;
  freeHtml: string;
  paidHtml: string;
  tocText: string;
  sectionsText: string;
  publishDate: string;
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let current = '';
  let inQuotes = false;

  const pushValue = () => {
    row.push(current);
    current = '';
  };

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      pushValue();
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        i += 1;
      }
      pushValue();
      if (row.some(value => value.length > 0)) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    current += char;
  }

  pushValue();
  if (row.some(value => value.length > 0)) {
    rows.push(row);
  }

  return rows;
}

function normalizeHeader(header: string) {
  return header.trim().toLowerCase();
}

function findHeaderIndex(headers: string[], options: string[]) {
  const normalizedHeaders = headers.map(normalizeHeader);
  for (const option of options) {
    const index = normalizedHeaders.indexOf(option);
    if (index >= 0) {
      return index;
    }
  }
  return -1;
}

function parseList(value: string) {
  return value
    .split('|')
    .map(item => item.trim())
    .filter(Boolean);
}

function formatList(list: string[]) {
  return list.join('\n');
}

function parseSections(value: string): CandidateSection[] {
  if (!value.trim()) {
    return [];
  }

  const parsed = JSON.parse(value) as CandidateSection[];
  if (!Array.isArray(parsed)) {
    throw new Error('Sections must be a JSON array.');
  }

  return parsed.map(section => ({
    title: section.title ?? '',
    subsections: Array.isArray(section.subsections) ? section.subsections : [],
  }));
}

function formatSections(sections: CandidateSection[]) {
  return JSON.stringify(sections, null, 2);
}

export function AdminPanel({ initialCandidates, initialPublished }: AdminPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [activeCandidate, setActiveCandidate] = useState<CandidateFormState | null>(null);
  const [activePublished, setActivePublished] = useState<PublishedFormState | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const candidateRows = useMemo(() => initialCandidates, [initialCandidates]);
  const publishedRows = useMemo(() => initialPublished, [initialPublished]);

  const handleSelectCandidate = (candidate: CandidateRecord) => {
    setActiveCandidate({
      id: candidate.id,
      slug: candidate.slug,
      headline: candidate.headline,
      freeHtml: candidate.freeHtml,
      paidHtml: candidate.paidHtml,
      tocText: formatList(candidate.toc),
      sectionsText: formatSections(candidate.sections),
      publishDate: candidate.publishDate ?? '',
      status: candidate.status,
    });
    setActionMessage(null);
  };

  const handleSelectPublished = (brief: PublishedBriefRecord) => {
    setActivePublished({
      id: brief.id,
      slug: brief.slug,
      headline: brief.headline,
      freeHtml: brief.freeHtml,
      paidHtml: brief.paidHtml,
      tocText: formatList(brief.toc ?? []),
      sectionsText: formatSections(brief.sections ?? []),
      publishDate: brief.publishDate,
    });
    setActionMessage(null);
  };

  const handleUpload = async (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);

    const text = await file.text();
    const rows = parseCsv(text);
    if (rows.length < 2) {
      setUploadError('CSV must include headers and at least one data row.');
      return;
    }

    const headers = rows[0];
    const slugIndex = findHeaderIndex(headers, REQUIRED_HEADERS.slug);
    const headlineIndex = findHeaderIndex(headers, REQUIRED_HEADERS.headline);
    const freeIndex = findHeaderIndex(headers, REQUIRED_HEADERS.freeHtml);
    const paidIndex = findHeaderIndex(headers, REQUIRED_HEADERS.paidHtml);
    const tocIndex = findHeaderIndex(headers, REQUIRED_HEADERS.toc);
    const sectionsIndex = findHeaderIndex(headers, REQUIRED_HEADERS.sections);
    const publishDateIndex = findHeaderIndex(headers, REQUIRED_HEADERS.publishDate);

    if (slugIndex === -1 || headlineIndex === -1 || freeIndex === -1 || paidIndex === -1 || sectionsIndex === -1) {
      setUploadError('Missing required columns. Required: slug, headline/title, freeHtml/pre-content, paidHtml, sections.');
      return;
    }

    const parsedCandidates: CandidateInput[] = [];
    const errors: string[] = [];

    rows.slice(1).forEach((row, index) => {
      const rowNumber = index + 2;
      const slug = row[slugIndex]?.trim() ?? '';
      const headline = row[headlineIndex]?.trim() ?? '';
      const freeHtml = row[freeIndex]?.trim() ?? '';
      const paidHtml = row[paidIndex]?.trim() ?? '';
      const tocValue = tocIndex >= 0 ? row[tocIndex] ?? '' : '';
      const sectionsValue = row[sectionsIndex] ?? '';
      const publishDateValue = publishDateIndex >= 0 ? row[publishDateIndex]?.trim() ?? '' : '';

      if (!slug || !headline || !freeHtml || !paidHtml) {
        errors.push(`Row ${rowNumber}: missing required fields.`);
        return;
      }

      if (countWords(freeHtml) > MAX_FREE_WORDS) {
        errors.push(`Row ${rowNumber}: free section exceeds ${MAX_FREE_WORDS} words.`);
        return;
      }

      let sections: CandidateSection[] = [];
      try {
        sections = parseSections(sectionsValue);
      } catch (error) {
        errors.push(`Row ${rowNumber}: ${(error as Error).message}`);
        return;
      }

      const toc = tocValue ? parseList(tocValue) : sections.map(section => section.title).filter(Boolean);
      const publishDate = publishDateValue || null;

      parsedCandidates.push({
        slug,
        headline,
        freeHtml,
        paidHtml,
        toc,
        sections,
        publishDate,
      });
    });

    if (errors.length) {
      setUploadError(errors.slice(0, 5).join(' '));
      return;
    }

    try {
      await createCandidates(parsedCandidates);
      setUploadSuccess(`Uploaded ${parsedCandidates.length} candidate${parsedCandidates.length === 1 ? '' : 's'}.`);
      startTransition(() => router.refresh());
    } catch (error) {
      setUploadError((error as Error).message);
    }
  };

  const handleCandidateSave = async () => {
    if (!activeCandidate) {
      return;
    }

    try {
      const sections = parseSections(activeCandidate.sectionsText);
      const toc = activeCandidate.tocText ? activeCandidate.tocText.split('\n').map(item => item.trim()).filter(Boolean) : [];

      await updateCandidate(activeCandidate.id, {
        slug: activeCandidate.slug,
        headline: activeCandidate.headline,
        freeHtml: activeCandidate.freeHtml,
        paidHtml: activeCandidate.paidHtml,
        toc,
        sections,
        publishDate: activeCandidate.publishDate || null,
        status: activeCandidate.status === 'published' ? 'candidate' : activeCandidate.status,
      });
      setActionMessage('Candidate updated.');
      startTransition(() => router.refresh());
    } catch (error) {
      setActionMessage((error as Error).message);
    }
  };

  const handleCandidatePublish = async () => {
    if (!activeCandidate) {
      return;
    }

    try {
      await publishCandidate(activeCandidate.id);
      setActionMessage('Candidate published.');
      setActiveCandidate(null);
      startTransition(() => router.refresh());
    } catch (error) {
      setActionMessage((error as Error).message);
    }
  };

  const handlePublishedSave = async () => {
    if (!activePublished) {
      return;
    }

    try {
      const sections = parseSections(activePublished.sectionsText);
      const toc = activePublished.tocText ? activePublished.tocText.split('\n').map(item => item.trim()).filter(Boolean) : [];

      await updatePublishedBrief(activePublished.id, {
        slug: activePublished.slug,
        headline: activePublished.headline,
        freeHtml: activePublished.freeHtml,
        paidHtml: activePublished.paidHtml,
        toc,
        sections,
        publishDate: activePublished.publishDate,
      });
      setActionMessage('Published brief updated.');
      startTransition(() => router.refresh());
    } catch (error) {
      setActionMessage((error as Error).message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <section style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '0.75rem' }}>CSV Upload</h2>
        <p style={{ marginBottom: '0.75rem', color: '#666' }}>
          Required columns: <strong>slug</strong>, <strong>headline</strong>, <strong>freeHtml</strong> (pre-content),
          <strong> paidHtml</strong>, <strong>sections</strong> (JSON array). Optional: <strong>toc</strong>,
          <strong> publishDate</strong> (UTC ISO string).
        </p>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          Sections format: <code>{`[{"title":"Section","subsections":["Sub 1","Sub 2"]}]`}</code>
        </p>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={event => {
            const file = event.target.files?.[0];
            if (file) {
              handleUpload(file);
            }
          }}
        />
        {uploadError && <p style={{ color: '#b91c1c', marginTop: '0.75rem' }}>{uploadError}</p>}
        {uploadSuccess && <p style={{ color: '#15803d', marginTop: '0.75rem' }}>{uploadSuccess}</p>}
      </section>

      <section>
        <h2 style={{ marginBottom: '0.75rem' }}>Candidate Pool</h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {candidateRows.length === 0 && <p style={{ color: '#666' }}>No candidates yet.</p>}
          {candidateRows.map(candidate => (
            <button
              key={candidate.id}
              onClick={() => handleSelectCandidate(candidate)}
              style={{
                textAlign: 'left',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #ddd',
                background: activeCandidate?.id === candidate.id ? '#f8fafc' : '#fff',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 600 }}>{candidate.headline}</div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>
                {candidate.status.toUpperCase()} · {candidate.publishDate ?? 'No publish date'}
              </div>
            </button>
          ))}
        </div>

        {activeCandidate && (
          <div style={{ marginTop: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Edit Candidate</h3>
            <label style={{ display: 'block', marginBottom: '0.75rem' }}>
              Slug
              <input
                type="text"
                value={activeCandidate.slug}
                onChange={event => setActiveCandidate({ ...activeCandidate, slug: event.target.value })}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '0.75rem' }}>
              Headline
              <input
                type="text"
                value={activeCandidate.headline}
                onChange={event => setActiveCandidate({ ...activeCandidate, headline: event.target.value })}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '0.75rem' }}>
              Free section (max {MAX_FREE_WORDS} words)
              <textarea
                value={activeCandidate.freeHtml}
                onChange={event => setActiveCandidate({ ...activeCandidate, freeHtml: event.target.value })}
                rows={4}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '0.75rem' }}>
              Paid section
              <textarea
                value={activeCandidate.paidHtml}
                onChange={event => setActiveCandidate({ ...activeCandidate, paidHtml: event.target.value })}
                rows={6}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '0.75rem' }}>
              Table of contents (one per line)
              <textarea
                value={activeCandidate.tocText}
                onChange={event => setActiveCandidate({ ...activeCandidate, tocText: event.target.value })}
                rows={4}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '0.75rem' }}>
              Sections JSON
              <textarea
                value={activeCandidate.sectionsText}
                onChange={event => setActiveCandidate({ ...activeCandidate, sectionsText: event.target.value })}
                rows={6}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', fontFamily: 'monospace' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '1rem' }}>
              Publish date (UTC, ISO-8601)
              <input
                type="text"
                placeholder="2025-01-01T08:00:00Z"
                value={activeCandidate.publishDate}
                onChange={event => setActiveCandidate({ ...activeCandidate, publishDate: event.target.value })}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleCandidateSave}
                disabled={isPending}
                style={{
                  padding: '0.6rem 1.5rem',
                  background: '#222',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  opacity: isPending ? 0.7 : 1,
                }}
              >
                Save Candidate
              </button>
              <button
                onClick={handleCandidatePublish}
                disabled={isPending}
                style={{
                  padding: '0.6rem 1.5rem',
                  background: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  opacity: isPending ? 0.7 : 1,
                }}
              >
                Publish to Briefs
              </button>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 style={{ marginBottom: '0.75rem' }}>Published Briefs</h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {publishedRows.length === 0 && <p style={{ color: '#666' }}>No published briefs yet.</p>}
          {publishedRows.map(brief => (
            <button
              key={brief.id}
              onClick={() => handleSelectPublished(brief)}
              style={{
                textAlign: 'left',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #ddd',
                background: activePublished?.id === brief.id ? '#f8fafc' : '#fff',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 600 }}>{brief.headline}</div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>{brief.publishDate}</div>
            </button>
          ))}
        </div>

        {activePublished && (
          <div style={{ marginTop: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Edit Published Brief</h3>
            <label style={{ display: 'block', marginBottom: '0.75rem' }}>
              Slug
              <input
                type="text"
                value={activePublished.slug}
                onChange={event => setActivePublished({ ...activePublished, slug: event.target.value })}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '0.75rem' }}>
              Headline
              <input
                type="text"
                value={activePublished.headline}
                onChange={event => setActivePublished({ ...activePublished, headline: event.target.value })}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '0.75rem' }}>
              Free section (max {MAX_FREE_WORDS} words)
              <textarea
                value={activePublished.freeHtml}
                onChange={event => setActivePublished({ ...activePublished, freeHtml: event.target.value })}
                rows={4}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '0.75rem' }}>
              Paid section
              <textarea
                value={activePublished.paidHtml}
                onChange={event => setActivePublished({ ...activePublished, paidHtml: event.target.value })}
                rows={6}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '0.75rem' }}>
              Table of contents (one per line)
              <textarea
                value={activePublished.tocText}
                onChange={event => setActivePublished({ ...activePublished, tocText: event.target.value })}
                rows={4}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '0.75rem' }}>
              Sections JSON
              <textarea
                value={activePublished.sectionsText}
                onChange={event => setActivePublished({ ...activePublished, sectionsText: event.target.value })}
                rows={6}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', fontFamily: 'monospace' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '1rem' }}>
              Publish date (UTC, ISO-8601)
              <input
                type="text"
                placeholder="2025-01-01T08:00:00Z"
                value={activePublished.publishDate}
                onChange={event => setActivePublished({ ...activePublished, publishDate: event.target.value })}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </label>
            <button
              onClick={handlePublishedSave}
              disabled={isPending}
              style={{
                padding: '0.6rem 1.5rem',
                background: '#222',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                opacity: isPending ? 0.7 : 1,
              }}
            >
              Save Published Brief
            </button>
          </div>
        )}
      </section>

      {actionMessage && (
        <p style={{ color: actionMessage.includes('updated') || actionMessage.includes('published') ? '#15803d' : '#b91c1c' }}>
          {actionMessage}
        </p>
      )}
    </div>
  );
}
