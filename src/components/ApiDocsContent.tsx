
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ApiDocsContent = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">API Endpoints</h2>
      
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-blue-700">User Endpoints</h3>
        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 py-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="px-2 py-1 bg-green-500 text-white rounded text-xs font-mono">POST</span>
              /api/users/register
            </CardTitle>
            <CardDescription>Register a new user</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <pre className="bg-slate-100 p-3 rounded-md overflow-x-auto text-sm">
{`// Request Body
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstname": "John",
  "lastname": "Doe",
  "role": "user"  // "admin" or "user"
}`}
            </pre>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 py-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-mono">GET</span>
              /api/users
            </CardTitle>
            <CardDescription>Get all users (Admin only)</CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold text-blue-700">Item Endpoints</h3>
        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 py-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="px-2 py-1 bg-green-500 text-white rounded text-xs font-mono">POST</span>
              /api/items
            </CardTitle>
            <CardDescription>Create a new item</CardDescription>
          </CardHeader>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 py-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-mono">GET</span>
              /api/items
            </CardTitle>
            <CardDescription>Get all items</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 py-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-mono">GET</span>
              /api/items/:id
            </CardTitle>
            <CardDescription>Get item by ID</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 py-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="px-2 py-1 bg-yellow-500 text-white rounded text-xs font-mono">PUT</span>
              /api/items/:id
            </CardTitle>
            <CardDescription>Update an item</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 py-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-mono">DELETE</span>
              /api/items/:id
            </CardTitle>
            <CardDescription>Delete an item (soft delete)</CardDescription>
          </CardHeader>
        </Card>
      </section>
      
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-blue-700">Room Endpoints</h3>
        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 py-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="px-2 py-1 bg-green-500 text-white rounded text-xs font-mono">POST</span>
              /api/rooms
            </CardTitle>
            <CardDescription>Create a new room</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 py-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-mono">GET</span>
              /api/rooms
            </CardTitle>
            <CardDescription>Get all rooms</CardDescription>
          </CardHeader>
        </Card>
      </section>
      
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-blue-700">Assignment Endpoints</h3>
        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 py-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="px-2 py-1 bg-green-500 text-white rounded text-xs font-mono">POST</span>
              /api/assignments
            </CardTitle>
            <CardDescription>Assign an item to a room</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 py-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-mono">GET</span>
              /api/assignments
            </CardTitle>
            <CardDescription>Get all assignments</CardDescription>
          </CardHeader>
        </Card>
      </section>
      
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-blue-700">Repair Endpoints</h3>
        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 py-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="px-2 py-1 bg-green-500 text-white rounded text-xs font-mono">POST</span>
              /api/repairs
            </CardTitle>
            <CardDescription>Create a repair record</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 py-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-mono">GET</span>
              /api/repairs
            </CardTitle>
            <CardDescription>Get all repairs</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 py-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="px-2 py-1 bg-yellow-500 text-white rounded text-xs font-mono">PUT</span>
              /api/repairs/:id/complete
            </CardTitle>
            <CardDescription>Mark a repair as complete</CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
};

export default ApiDocsContent;
