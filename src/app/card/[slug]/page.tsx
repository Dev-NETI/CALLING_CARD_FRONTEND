'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { VirtualCard } from '@/types';
import Button from '@/components/ui/Button';
import FlippableCard from '@/components/virtualcard/FlippableCard';

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

        <FlippableCard card={card} />

        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Powered by Virtual Calling Card System &copy; 2025
          </p>
        </div>
      </div>
    </div>
  );
}
