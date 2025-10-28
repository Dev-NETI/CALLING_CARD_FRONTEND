'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';
import { Employee, VirtualCardFormData } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Link from 'next/link';

export default function VirtualCardPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = Number(params.id);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cardSlug, setCardSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState<VirtualCardFormData>({
    bio: '',
    theme_color: '#6366f1',
    facebook_url: '',
    linkedin_url: '',
    twitter_url: '',
    instagram_url: '',
  });
  const { logout } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetchEmployee();
  }, [employeeId]);

  const fetchEmployee = async () => {
    try {
      setIsLoading(true);
      const data = await api.getEmployee(employeeId);
      setEmployee(data);
    } catch (error) {
      showToast('Failed to load employee', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await api.createVirtualCard(employeeId, formData);
      setCardSlug(result.slug);
      showToast('Virtual card created successfully!', 'success');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to create virtual card',
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyUrl = () => {
    if (cardSlug) {
      const url = `${window.location.origin}/card/${cardSlug}`;
      navigator.clipboard.writeText(url);
      showToast('URL copied to clipboard!', 'success');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Card>
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Employee not found
            </h2>
            <Link href="/employees">
              <Button>Back to Employees</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
                  Virtual Cards
                </h1>
              </Link>
              <div className="hidden md:flex gap-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/employees">
                  <Button variant="outline" size="sm">
                    Back to Employees
                  </Button>
                </Link>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Virtual Card
          </h2>
          <p className="text-gray-600">
            Design a virtual calling card for{' '}
            <span className="font-semibold">
              {employee.first_name} {employee.last_name}
            </span>
          </p>
        </div>

        {cardSlug ? (
          <Card>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
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
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Virtual Card Created!
              </h3>
              <p className="text-gray-600 mb-6">
                Your virtual calling card has been successfully created
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
                <p className="text-sm text-gray-600 mb-2">Card URL:</p>
                <p className="text-blue-600 font-mono text-sm break-all">
                  {window.location.origin}/card/{cardSlug}
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={handleCopyUrl}>
                  <svg
                    className="w-5 h-5 mr-2 inline-block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy URL
                </Button>
                <Link href={`/card/${cardSlug}`} target="_blank">
                  <Button variant="outline">
                    <svg
                      className="w-5 h-5 mr-2 inline-block"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    View Card
                  </Button>
                </Link>
                <Link href="/employees">
                  <Button variant="outline">Back to Employees</Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Card Details
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <TextArea
                    label="Bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme Color
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={formData.theme_color}
                        onChange={(e) =>
                          setFormData({ ...formData, theme_color: e.target.value })
                        }
                        className="h-10 w-20 rounded border border-gray-300"
                      />
                      <Input
                        type="text"
                        value={formData.theme_color}
                        onChange={(e) =>
                          setFormData({ ...formData, theme_color: e.target.value })
                        }
                        placeholder="#6366f1"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-4">
                      Social Media Links
                    </h4>
                    <div className="space-y-4">
                      <Input
                        label="Facebook URL"
                        value={formData.facebook_url}
                        onChange={(e) =>
                          setFormData({ ...formData, facebook_url: e.target.value })
                        }
                        placeholder="https://facebook.com/username"
                      />
                      <Input
                        label="LinkedIn URL"
                        value={formData.linkedin_url}
                        onChange={(e) =>
                          setFormData({ ...formData, linkedin_url: e.target.value })
                        }
                        placeholder="https://linkedin.com/in/username"
                      />
                      <Input
                        label="Twitter URL"
                        value={formData.twitter_url}
                        onChange={(e) =>
                          setFormData({ ...formData, twitter_url: e.target.value })
                        }
                        placeholder="https://twitter.com/username"
                      />
                      <Input
                        label="Instagram URL"
                        value={formData.instagram_url}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            instagram_url: e.target.value,
                          })
                        }
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full" isLoading={isSaving}>
                      Generate Virtual Card
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            <div>
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Card Preview
                </h3>
                <div
                  className="rounded-lg overflow-hidden shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${formData.theme_color}ee, ${formData.theme_color})`,
                  }}
                >
                  <div className="p-8 text-white">
                    <div className="flex items-center mb-6">
                      <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-3xl font-bold">
                        {employee.first_name.charAt(0)}
                        {employee.last_name.charAt(0)}
                      </div>
                      <div className="ml-6">
                        <h3 className="text-2xl font-bold">
                          {employee.first_name}{' '}
                          {employee.middle_name && employee.middle_name + ' '}
                          {employee.last_name}
                        </h3>
                        <p className="text-lg opacity-90">{employee.position}</p>
                      </div>
                    </div>

                    {employee.company && (
                      <div className="mb-4 pb-4 border-b border-white border-opacity-20">
                        <p className="opacity-90">{employee.company.company_name}</p>
                      </div>
                    )}

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-3 opacity-90"
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
                        <span className="text-sm">{employee.email}</span>
                      </div>
                      {employee.mobile_number && (
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 mr-3 opacity-90"
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
                          <span className="text-sm">{employee.mobile_number}</span>
                        </div>
                      )}
                    </div>

                    {formData.bio && (
                      <div className="mb-6 p-4 bg-white bg-opacity-10 rounded-lg">
                        <p className="text-sm opacity-90">{formData.bio}</p>
                      </div>
                    )}

                    {(formData.facebook_url ||
                      formData.linkedin_url ||
                      formData.twitter_url ||
                      formData.instagram_url) && (
                      <div className="flex gap-3">
                        {formData.facebook_url && (
                          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">f</span>
                          </div>
                        )}
                        {formData.linkedin_url && (
                          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">in</span>
                          </div>
                        )}
                        {formData.twitter_url && (
                          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">𝕏</span>
                          </div>
                        )}
                        {formData.instagram_url && (
                          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">IG</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
