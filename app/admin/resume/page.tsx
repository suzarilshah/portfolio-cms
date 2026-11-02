'use client';

import { useEffect, useState } from 'react';
import { Mail, Calendar, Download, TrendingUp } from 'lucide-react';

interface ResumeDownload {
  id: number;
  email: string;
  downloaded_at: string;
  created_at: string;
}

export default function ResumeDownloadsPage() {
  const [downloads, setDownloads] = useState<ResumeDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const response = await fetch('/api/cms/resume-downloads');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setDownloads(data);
    } catch (err) {
      setError('Failed to load downloads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTotalDownloads = () => downloads.length;
  const getRecentDownloads = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return downloads.filter(d => new Date(d.downloaded_at) >= weekAgo).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--raised)] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[var(--raised)] rounded w-64" />
            <div className="h-4 bg-[var(--raised)] rounded w-96" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-[var(--raised)] rounded-[4px]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--raised)] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">
            Resume Downloads
          </h1>
          <p className="text-[var(--dim)]">
            Track email submissions for resume downloads
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--surface)] rounded-[4px] border border-[var(--line)] p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-[4px]">
                <Download className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-[var(--dim)]">Total Downloads</p>
                <p className="text-2xl font-bold text-[var(--text)]">{getTotalDownloads()}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--surface)] rounded-[4px] border border-[var(--line)] p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[var(--raised)] rounded-[4px]">
                <TrendingUp className="w-6 h-6 text-[var(--ok)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--dim)]">This Week</p>
                <p className="text-2xl font-bold text-[var(--text)]">{getRecentDownloads()}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--surface)] rounded-[4px] border border-[var(--line)] p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[var(--raised)] rounded-[4px]">
                <Mail className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--dim)]">Unique Emails</p>
                <p className="text-2xl font-bold text-[var(--text)]">{getTotalDownloads()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Downloads Table */}
        <div className="bg-[var(--surface)] rounded-[4px] border border-[var(--line)] overflow-hidden">
          <div className="p-6 border-b border-[var(--line)]">
            <h2 className="text-xl font-semibold text-[var(--text)]">Recent Downloads</h2>
          </div>

          {error ? (
            <div className="p-8 text-center text-[var(--danger)]">{error}</div>
          ) : downloads.length === 0 ? (
            <div className="p-8 text-center text-[var(--faint)]">
              No downloads yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--raised)] border-b border-[var(--line)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--dim)] uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--dim)] uppercase tracking-wider">
                      Downloaded At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--dim)] uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line-soft)]">
                  {downloads.map((download) => (
                    <tr key={download.id} className="hover:bg-[var(--hover)] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[var(--raised)] rounded-[4px]">
                            <Mail className="w-4 h-4 text-[var(--dim)]" />
                          </div>
                          <span className="text-sm font-medium text-[var(--text)]">
                            {download.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-[var(--dim)]">
                          <Calendar className="w-4 h-4" />
                          {formatDate(download.downloaded_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--raised)] text-[var(--ok)]">
                          Downloaded
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
