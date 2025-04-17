
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, ArrowLeft, Loader2, WrenchIcon, Send } from 'lucide-react';
import { useItemsApi } from '@/hooks/useItemsApi';
import { useRepairsApi } from '@/hooks/useRepairsApi';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';

const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { useItemHistory } = useItemsApi();
  const { useCreateRepair } = useRepairsApi();
  
  const { data, isLoading, error } = useItemHistory(id || '');
  const { mutate: createRepair, isPending: isCreatingRepair } = useCreateRepair();
  
  const [showRepairForm, setShowRepairForm] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      problem: '',
    }
  });

  const handleRepair = (data: { problem: string }) => {
    if (!id || !user) return;
    
    createRepair({
      date: new Date().toISOString(),
      itemId: id,
      problem: data.problem,
      reportBy: user.id
    }, {
      onSuccess: () => {
        reset();
        setShowRepairForm(false);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load item details. The item might not exist or you may not have permission to view it.
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/items')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Items
        </Button>
      </div>
    );
  }

  const { item, repairs = [], assignments = [] } = data;

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/items')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">{item.itemName}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>Basic information about this item</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Item Type</dt>
                <dd className="text-base">{item.typeId.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Brand</dt>
                <dd className="text-base">{item.brand}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Serial Number</dt>
                <dd className="text-base">{item.serialNo}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="text-base">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'active' ? 'bg-green-100 text-green-800' : 
                    item.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 
                    item.status === 'defective' ? 'bg-red-100 text-red-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </dd>
              </div>
              {item.otherDetails && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Other Details</dt>
                  <dd className="text-base whitespace-pre-wrap">{item.otherDetails}</dd>
                </div>
              )}
            </dl>
          </CardContent>
          <CardFooter>
            {item.status === 'active' && (
              <Button 
                onClick={() => setShowRepairForm(true)} 
                variant="outline"
                className="w-full"
              >
                <WrenchIcon className="mr-2 h-4 w-4" />
                Report Defect
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Item History</CardTitle>
            <CardDescription>Activity history for this item</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="assignments">
              <TabsList className="mb-4">
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="repairs">Repairs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="assignments">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Assigned By</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments && assignments.length > 0 ? (
                        assignments.map((assignment: any) => (
                          <TableRow key={assignment._id}>
                            <TableCell>{format(new Date(assignment.date), 'PPP')}</TableCell>
                            <TableCell>{assignment.roomId?.room || 'Unknown'}</TableCell>
                            <TableCell>
                              {assignment.assignedBy ? 
                                `${assignment.assignedBy.firstname} ${assignment.assignedBy.lastname}` : 
                                'Unknown'}
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                assignment.status === 'active' ? 'bg-green-100 text-green-800' : 
                                assignment.status === 'transferred' ? 'bg-yellow-100 text-yellow-800' : 
                                assignment.status === 'surrendered' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {assignment.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            No assignment records found for this item.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="repairs">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Problem</TableHead>
                        <TableHead>Reported By</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Diagnosis</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {repairs && repairs.length > 0 ? (
                        repairs.map((repair: any) => (
                          <TableRow key={repair._id}>
                            <TableCell>{format(new Date(repair.date), 'PPP')}</TableCell>
                            <TableCell>{repair.problem}</TableCell>
                            <TableCell>
                              {repair.reportBy ? 
                                `${repair.reportBy.firstname} ${repair.reportBy.lastname}` : 
                                'Unknown'}
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                repair.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                repair.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {repair.status}
                              </span>
                            </TableCell>
                            <TableCell>{repair.diagnosis || '-'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No repair records found for this item.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showRepairForm} onOpenChange={setShowRepairForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Item Defect</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleRepair)} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="problem" className="text-sm font-medium">
                Problem Description
              </label>
              <Textarea
                id="problem"
                placeholder="Describe the issue with this item..."
                {...register("problem", { required: "Problem description is required" })}
                className={errors.problem ? "border-red-500" : ""}
                rows={4}
              />
              {errors.problem && (
                <p className="text-red-500 text-sm">{errors.problem.message}</p>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowRepairForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingRepair}>
                {isCreatingRepair ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Submit Report
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemDetailsPage;
