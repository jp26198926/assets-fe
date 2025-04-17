
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ModelsDocsContent = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Data Models</h2>
      
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-blue-700">User Model</h3>
        <Card>
          <CardHeader>
            <CardTitle>user_tbl</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-100 p-3 rounded-md overflow-x-auto text-sm">
{`{
  id: ObjectId,
  email: String,            // Unique, required
  password: String,         // Hashed, required
  firstname: String,        // Required
  lastname: String,         // Required
  role: String,             // "admin" or "user", required
  createdAt: Date,          // Automatically set
  createdBy: ObjectId,      // Reference to user
  updatedAt: Date,          // Automatically updated
  updatedBy: ObjectId,      // Reference to user
  deletedAt: Date,          // Set when soft deleted
  deletedBy: ObjectId,      // Reference to user who deleted
  deletedReason: String,    // Optional reason for deletion
  status: String            // "active" or "deleted"
}`}
            </pre>
          </CardContent>
        </Card>
      </section>
      
      <section className="space-y-4 mt-6">
        <h3 className="text-xl font-bold text-blue-700">Item Type Model</h3>
        <Card>
          <CardHeader>
            <CardTitle>item_type_tbl</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-100 p-3 rounded-md overflow-x-auto text-sm">
{`{
  id: ObjectId,
  type: String             // Required, unique
}`}
            </pre>
          </CardContent>
        </Card>
      </section>
      
      <section className="space-y-4 mt-6">
        <h3 className="text-xl font-bold text-blue-700">Item Model</h3>
        <Card>
          <CardHeader>
            <CardTitle>item_tbl</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-100 p-3 rounded-md overflow-x-auto text-sm">
{`{
  id: ObjectId,
  typeId: ObjectId,         // Reference to item_type_tbl
  itemName: String,         // Required
  brand: String,            // Required
  serialNo: String,         // Required, unique
  otherDetails: String,     // Optional
  createdAt: Date,          // Automatically set
  createdBy: ObjectId,      // Reference to user
  updatedAt: Date,          // Automatically updated
  updatedBy: ObjectId,      // Reference to user
  deletedAt: Date,          // Set when soft deleted
  deletedBy: ObjectId,      // Reference to user who deleted
  deletedReason: String,    // Optional reason for deletion
  status: String            // "active", "deleted", "defective", or "assigned"
}`}
            </pre>
          </CardContent>
        </Card>
      </section>
      
      <section className="space-y-4 mt-6">
        <h3 className="text-xl font-bold text-blue-700">Room Model</h3>
        <Card>
          <CardHeader>
            <CardTitle>room_tbl</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-100 p-3 rounded-md overflow-x-auto text-sm">
{`{
  id: ObjectId,
  room: String,             // Required, unique
  createdAt: Date,          // Automatically set
  createdBy: ObjectId,      // Reference to user
  updatedAt: Date,          // Automatically updated
  updatedBy: ObjectId,      // Reference to user
  deletedAt: Date,          // Set when soft deleted
  deletedBy: ObjectId,      // Reference to user who deleted
  deletedReason: String,    // Optional reason for deletion
  status: String            // "active" or "deleted"
}`}
            </pre>
          </CardContent>
        </Card>
      </section>
      
      <section className="space-y-4 mt-6">
        <h3 className="text-xl font-bold text-blue-700">Assignment Model</h3>
        <Card>
          <CardHeader>
            <CardTitle>assign_tbl</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-100 p-3 rounded-md overflow-x-auto text-sm">
{`{
  id: ObjectId,
  date: Date,               // Required
  itemId: ObjectId,         // Reference to item_tbl
  roomId: ObjectId,         // Reference to room_tbl
  assignedBy: ObjectId,     // Reference to user (logged in user)
  createdAt: Date,          // Automatically set
  createdBy: ObjectId,      // Reference to user
  updatedAt: Date,          // Automatically updated
  updatedBy: ObjectId,      // Reference to user
  deletedAt: Date,          // Set when soft deleted
  deletedBy: ObjectId,      // Reference to user who deleted
  deletedReason: String,    // Optional reason for deletion
  status: String            // "active", "deleted", "transferred", or "surrendered"
}`}
            </pre>
          </CardContent>
        </Card>
      </section>
      
      <section className="space-y-4 mt-6">
        <h3 className="text-xl font-bold text-blue-700">Repair Model</h3>
        <Card>
          <CardHeader>
            <CardTitle>repair_tbl</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-100 p-3 rounded-md overflow-x-auto text-sm">
{`{
  id: ObjectId,
  date: Date,               // Required
  itemId: ObjectId,         // Reference to item_tbl
  problem: String,          // Required
  diagnosis: String,        // Optional
  reportBy: ObjectId,       // Reference to user
  checkedBy: ObjectId,      // Reference to user
  createdAt: Date,          // Automatically set
  createdBy: ObjectId,      // Reference to user
  updatedAt: Date,          // Automatically updated
  updatedBy: ObjectId,      // Reference to user
  deletedAt: Date,          // Set when soft deleted
  deletedBy: ObjectId,      // Reference to user who deleted
  deletedReason: String,    // Optional reason for deletion
  status: String            // "ongoing", "completed", or "deleted"
}`}
            </pre>
          </CardContent>
        </Card>
      </section>
      
      <section className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-md">
        <h3 className="text-lg font-bold mb-2">Implementation Notes</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li>All IDs use MongoDB's ObjectId type</li>
          <li>Timestamps (createdAt, updatedAt) are automatically managed</li>
          <li>Foreign keys are implemented as references to their respective collections</li>
          <li>Soft delete pattern is implemented across all models</li>
          <li>Status fields use enumerated values for consistency</li>
        </ul>
      </section>
    </div>
  );
};

export default ModelsDocsContent;
