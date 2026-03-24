import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { User as UserIcon, Lock, Save } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, login, token } = useAuth();
  
  // Profile Update State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });

  // Password Change State
  const [pwdData, setPwdData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [pwdMsg, setPwdMsg] = useState({ text: '', type: '' });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.put('/profile', profileData);
      login(token as string, { ...user!, name: response.data.name, email: response.data.email });
      setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => setProfileMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      setProfileMsg({ text: 'Failed to update profile.', type: 'error' });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      setPwdMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    
    try {
      await api.put('/change-password', {
        oldPassword: pwdData.oldPassword,
        newPassword: pwdData.newPassword
      });
      setPwdData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setPwdMsg({ text: 'Password updated successfully!', type: 'success' });
      setTimeout(() => setPwdMsg({ text: '', type: '' }), 3000);
    } catch (err: any) {
      const respMsg = err.response?.data || 'Failed to change password.';
      setPwdMsg({ text: typeof respMsg === 'string' ? respMsg : 'Failed to change password.', type: 'error' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

      <div className="bg-white shadow rounded-lg mb-8 outline outline-1 outline-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <UserIcon className="w-5 h-5 mr-2" /> Profile Information
          </h3>
          <div className="mt-5">
            <form onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={e => setProfileData({...profileData, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <label className="block text-sm font-medium text-gray-700">Email address</label>
                  <input
                    type="email"
                    required
                    value={profileData.email}
                    onChange={e => setProfileData({...profileData, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              {profileMsg.text && (
                <div className={`mt-4 text-sm ${profileMsg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                  {profileMsg.text}
                </div>
              )}
              <div className="mt-5">
                <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Save className="w-4 h-4 mr-2" /> Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg outline outline-1 outline-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Lock className="w-5 h-5 mr-2" /> Change Password
          </h3>
          <div className="mt-5">
            <form onSubmit={handlePasswordChange}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    required
                    value={pwdData.oldPassword}
                    onChange={e => setPwdData({...pwdData, oldPassword: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    required
                    value={pwdData.newPassword}
                    onChange={e => setPwdData({...pwdData, newPassword: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={pwdData.confirmPassword}
                    onChange={e => setPwdData({...pwdData, confirmPassword: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              {pwdMsg.text && (
                <div className={`mt-4 text-sm ${pwdMsg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                  {pwdMsg.text}
                </div>
              )}
              <div className="mt-5">
                <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Save className="w-4 h-4 mr-2" /> Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
