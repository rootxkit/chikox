'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Alert from '@/components/Alert';
import api from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, updateUser } = useAuth();
  const { t } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (user) {
      setName(user.name || '');
      setEmail(user.email);
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.updateProfile({ name, email });
      if (response.success && response.data) {
        updateUser(response.data);
        setSuccess(t('profile.updateSuccess'));
        setEditing(false);
      } else {
        setError(response.error?.message || t('profile.updateError'));
      }
    } catch (err) {
      setError(t('profile.updateError'));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 8) {
      setError(t('profile.passwordMinLength'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('profile.passwordMismatch'));
      return;
    }

    setLoading(true);

    try {
      const response = await api.changePassword({
        currentPassword,
        newPassword
      });

      if (response.success) {
        setSuccess(t('profile.passwordChangeSuccess'));
        setChangingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(response.error?.message || t('profile.passwordChangeError'));
      }
    } catch (err) {
      setError(t('profile.passwordChangeError'));
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background-primary">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto flex justify-center items-center h-64">
            <div className="text-text-primary">{t('common.loading') || 'Loading...'}</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-primary">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-text-primary mb-8">{t('profile.title')}</h1>

          {error && <Alert variant="error" message={error} className="mb-6" />}
          {success && <Alert variant="success" message={success} className="mb-6" />}

          {/* Profile Information Card */}
          <div className="bg-background-alternative rounded-lg border border-border-primary p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary">
                {t('profile.personalInfo')}
              </h2>
              {!editing && !changingPassword && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                >
                  {t('profile.edit')}
                </button>
              )}
            </div>

            {!editing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-text-secondary">{t('profile.name')}</label>
                  <p className="text-text-primary font-medium">
                    {user.name || t('profile.notSet')}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-text-secondary">{t('profile.email')}</label>
                  <p className="text-text-primary font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-text-secondary">{t('profile.role')}</label>
                  <p className="text-text-primary font-medium">{user.role}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    {t('profile.name')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-border-primary rounded-lg bg-background-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    {t('profile.email')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-border-primary rounded-lg bg-background-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? t('profile.saving') : t('profile.save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setName(user.name || '');
                      setEmail(user.email);
                    }}
                    className="px-4 py-2 border border-border-primary text-text-primary rounded-lg hover:bg-background-secondary transition-colors"
                  >
                    {t('profile.cancel')}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Change Password Card */}
          {!editing && (
            <div className="bg-background-alternative rounded-lg border border-border-primary p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">{t('profile.security')}</h2>
                {!changingPassword && (
                  <button
                    onClick={() => setChangingPassword(true)}
                    className="px-4 py-2 border border-border-primary text-text-primary rounded-lg hover:bg-background-secondary transition-colors"
                  >
                    {t('profile.changePassword')}
                  </button>
                )}
              </div>

              {!changingPassword ? (
                <p className="text-text-secondary">{t('profile.passwordHint')}</p>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      {t('profile.currentPassword')}
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-border-primary rounded-lg bg-background-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      {t('profile.newPassword')}
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-border-primary rounded-lg bg-background-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      {t('profile.passwordMinLength')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      {t('profile.confirmPassword')}
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-border-primary rounded-lg bg-background-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
                    >
                      {loading ? t('profile.changing') : t('profile.changePassword')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setChangingPassword(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="px-4 py-2 border border-border-primary text-text-primary rounded-lg hover:bg-background-secondary transition-colors"
                    >
                      {t('profile.cancel')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
