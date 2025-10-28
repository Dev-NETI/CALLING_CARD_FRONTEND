'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { VirtualCard } from '@/types';
import Button from '@/components/ui/Button';

export default function PublicCardPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [card, setCard] = useState<VirtualCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchCard();
  }, [slug]);

  const fetchCard = async () => {
    try {
      setIsLoading(true);
      const data = await api.getVirtualCard(slug);
      setCard(data);
    } catch (error) {
      setError('Virtual card not found');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadContact = () => {
    if (!card?.employee) return;

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${card.employee.first_name} ${card.employee.middle_name || ''} ${card.employee.last_name}
N:${card.employee.last_name};${card.employee.first_name};${card.employee.middle_name || ''};;
TITLE:${card.employee.position}
ORG:${card.employee.company?.company_name || ''}
EMAIL:${card.employee.email}
TEL:${card.employee.mobile_number || ''}
${card.facebook_url ? `URL;type=Facebook:${card.facebook_url}` : ''}
${card.linkedin_url ? `URL;type=LinkedIn:${card.linkedin_url}` : ''}
${card.twitter_url ? `URL;type=Twitter:${card.twitter_url}` : ''}
${card.instagram_url ? `URL;type=Instagram:${card.instagram_url}` : ''}
NOTE:${card.bio || ''}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${card.employee.first_name}_${card.employee.last_name}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading virtual card...</p>
        </div>
      </div>
    );
  }

  if (error || !card || !card.employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
          <svg
            className="w-20 h-20 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Card Not Found</h2>
          <p className="text-gray-600">
            The virtual calling card you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const employee = card.employee;
  const themeColor = card.theme_color || '#6366f1';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={handleCopyUrl}>
            {copied ? (
              <>
                <svg
                  className="w-4 h-4 mr-2 inline-block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2 inline-block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share
              </>
            )}
          </Button>
          <Button variant="primary" size="sm" onClick={handleDownloadContact}>
            <svg
              className="w-4 h-4 mr-2 inline-block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Save Contact
          </Button>
        </div>

        <div
          className="rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${themeColor}ee, ${themeColor})`,
          }}
        >
          <div className="p-8 md:p-12 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
              <div className="w-32 h-32 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-5xl font-bold mb-6 md:mb-0 md:mr-8 shadow-lg">
                {employee.first_name.charAt(0)}
                {employee.last_name.charAt(0)}
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  {employee.first_name}{' '}
                  {employee.middle_name && employee.middle_name + ' '}
                  {employee.last_name}
                </h1>
                <p className="text-2xl opacity-90 mb-2">{employee.position}</p>
                {employee.department && (
                  <p className="text-lg opacity-80">{employee.department}</p>
                )}
              </div>
            </div>

            {employee.company && (
              <div className="mb-8 pb-6 border-b border-white border-opacity-20">
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-3 opacity-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <div>
                    <p className="text-xl font-semibold">
                      {employee.company.company_name}
                    </p>
                    {employee.company.website && (
                      <a
                        href={employee.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm opacity-80 hover:opacity-100 underline"
                      >
                        {employee.company.website}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <svg
                  className="w-6 h-6 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href={`mailto:${employee.email}`}
                  className="hover:underline break-all"
                >
                  {employee.email}
                </a>
              </div>

              {employee.mobile_number && (
                <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                  <svg
                    className="w-6 h-6 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <a
                    href={`tel:${employee.mobile_number}`}
                    className="hover:underline"
                  >
                    {employee.mobile_number}
                  </a>
                </div>
              )}

              {employee.telephone && (
                <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                  <svg
                    className="w-6 h-6 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <a href={`tel:${employee.telephone}`} className="hover:underline">
                    {employee.telephone}
                  </a>
                </div>
              )}

              {employee.company?.address && (
                <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                  <svg
                    className="w-6 h-6 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{employee.company.address}</span>
                </div>
              )}
            </div>

            {card.bio && (
              <div className="mb-8 p-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg">
                <h3 className="text-xl font-semibold mb-3">About</h3>
                <p className="text-lg opacity-90 leading-relaxed">{card.bio}</p>
              </div>
            )}

            {(card.facebook_url ||
              card.linkedin_url ||
              card.twitter_url ||
              card.instagram_url) && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Connect With Me</h3>
                <div className="flex flex-wrap gap-4">
                  {card.facebook_url && (
                    <a
                      href={card.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Facebook</span>
                    </a>
                  )}
                  {card.linkedin_url && (
                    <a
                      href={card.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {card.twitter_url && (
                    <a
                      href={card.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span>Twitter</span>
                    </a>
                  )}
                  {card.instagram_url && (
                    <a
                      href={card.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span>Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Powered by Virtual Calling Card System &copy; 2025
          </p>
        </div>
      </div>
    </div>
  );
}
