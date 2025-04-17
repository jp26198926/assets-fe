
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AuthDocsContent = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Authentication</h2>
      
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-blue-700">Authentication Endpoints</h3>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 py-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="px-2 py-1 bg-green-500 text-white rounded text-xs font-mono">POST</span>
              /api/auth/login
            </CardTitle>
            <CardDescription>Login and get access token</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <pre className="bg-slate-100 p-3 rounded-md overflow-x-auto text-sm">
{`// Request Body
{
  "email": "user@example.com",
  "password": "securepassword"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d4a32c9f7d7c5678a1b5e3",
    "email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "role": "user"
  }
}`}
            </pre>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 py-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-mono">GET</span>
              /api/auth/profile
            </CardTitle>
            <CardDescription>Get current user profile</CardDescription>
          </CardHeader>
        </Card>
      </section>
      
      <section className="space-y-4 mt-8">
        <h3 className="text-xl font-bold text-blue-700">Using JWT Authentication</h3>
        <p className="mb-4">All protected endpoints require a valid JWT token in the Authorization header:</p>
        
        <div className="bg-slate-100 p-4 rounded-md">
          <p className="font-mono text-sm">Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</p>
        </div>
        
        <h4 className="text-lg font-semibold mt-6 mb-2">Token Expiration</h4>
        <p>Tokens expire after 24 hours. You'll need to login again to get a new token.</p>
        
        <h4 className="text-lg font-semibold mt-6 mb-2">Role-Based Access Control</h4>
        <p>The API implements role-based access control:</p>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li><span className="font-semibold">Admin users</span> have full access to all endpoints</li>
          <li><span className="font-semibold">Regular users</span> have limited access based on their permissions</li>
        </ul>
      </section>
      
      <section className="space-y-4 mt-8">
        <h3 className="text-xl font-bold text-blue-700">Implementation Details</h3>
        <Card>
          <CardHeader>
            <CardTitle>Authentication Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal ml-6 space-y-3">
              <li>
                <p className="font-medium">User Registration</p>
                <p className="text-slate-600">A new user account is created with a hashed password</p>
              </li>
              <li>
                <p className="font-medium">User Login</p>
                <p className="text-slate-600">User provides credentials, server validates and returns JWT token</p>
              </li>
              <li>
                <p className="font-medium">Protected Routes</p>
                <p className="text-slate-600">Client includes JWT token in requests to access protected endpoints</p>
              </li>
              <li>
                <p className="font-medium">Authorization</p>
                <p className="text-slate-600">Server validates token and checks user permissions for the requested resource</p>
              </li>
            </ol>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AuthDocsContent;
