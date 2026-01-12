// src/components/policies/api.ts

import { IAMPolicy } from './components/PolicyEditor';

const API_URL = "http://127.0.0.1:8000/api"; // Using absolute path for proxying

// Helper to get the auth token from local storage
const getAuthToken = () => {
  // We are storing the 'access' token in localStorage
  // This is a common practice for JWT-based auth
  return localStorage.getItem('access');
};

// 1. GET all policies for the current user
export const getPolicies = async (): Promise<IAMPolicy[]> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/policies/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch policies');
  }

  return response.json();
};

// 2. UPDATE a specific policy's document
export const updatePolicy = async (id: number | string, updatedDoc: object): Promise<IAMPolicy> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/policies/${id}/`, {
    method: 'PATCH', // Using PATCH to only update the document
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ document: updatedDoc }),
  });

  if (!response.ok) {
    // Try to get a more specific error message from the backend
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update policy');
  }

  return response.json();
};

// 3. DELETE a policy
export const deletePolicy = async (id: number | string): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/policies/${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete policy');
  }

  // No content is returned on a successful delete (204)
};
