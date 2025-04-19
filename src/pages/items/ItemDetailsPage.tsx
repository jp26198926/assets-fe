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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, ArrowLeft, Loader2, WrenchIcon, Send } from 'lucide-react';
import { useItemsApi } from '@/hooks/useItemsApi';
import { useRepairsApi } from '@/hooks/useRepairsApi';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import BarcodeSearch from '@/components/items/BarcodeSearch';

const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { useItemHistory } = useItemsApi();
  const { useCreateRepair } = useRepairsApi();
  
  const [currentId, setCurrentId] = useState<string>(id || '');
  const { data, isLoading, error } = useItemHistory(currentId);
  const { mutate: createRepair, isPending: isCreatingRepair } = useCreateRepair();
  
  const [showRepairForm, setShowRepairForm] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      problem: '',
    }
  });

  const handleRepair = (data: { problem: string }) => {
    if (!currentId || !user) return;
    
    createRepair({
      date: new Date().toISOString(),
      itemId: currentId,
      problem: data.problem,
      reportBy: user.id
    }, {
      onSuccess: () => {
        reset();
        setShowRepairForm(false);
      }
    });
  };

  const handleItemFound = (item: any) => {
    setCurrentId(item._id);
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
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/items')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">{item?.itemName || 'Item Details'}</h1>
          </div>
          <BarcodeSearch onItemFound={handleItemFound} />
        </div>
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
                <dt className="text-sm font-medium text-gray-500">Barcode ID</dt>
                <dd className="text-base">{item.barcodeId}</dd>
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
              <div className="border-t pt-4 mt-4">
                <dt className="text-sm font-medium text-gray-500 mb-2">Record Information</dt>
                <div className="space-y-3">
                  <div>
                    <dt className="text-xs font-medium text-gray-400">Created</dt>
                    <dd className="text-sm">
                      {item.createdBy ? `${item.createdBy.firstname} ${item.createdBy.lastname}` : 'Unknown'}
                    </dd>
                    <dd className="text-sm text-gray-500">
                      {format(new Date(item.createdAt), 'PPP p')}
                    </dd>
                  </div>
                  
                  {item.updatedBy && (
                    <div>
                      <dt className="text-xs font-medium text-gray-400">Last Updated</dt>
                      <dd className="text-sm">
                        {`${item.updatedBy.firstname} ${item.updatedBy.lastname}`}
                      </dd>
                      <dd className="text-sm text-gray-500">
                        {format(new Date(item.updatedAt || ''), 'PPP p')}
                      </dd>
                    </div>
                  )}
                  
                  {item.deletedBy && (
                    <div>
                      <dt className="text-xs font-medium text-gray-400">Deleted</dt>
                      <dd className="text-sm">
                        {`${item.deletedBy.firstname} ${item.deletedBy.lastname}`}
                      </dd>
                      <dd className="text-sm text-gray-500">
                        {format(new Date(item.deletedAt || ''), 'PPP p')}
                      </dd>
                      {item.deletedReason && (
                        <>
                          <dt className="text-xs font-medium text-gray-400 mt-1">Deletion Reason</dt>
                          <dd className="text-sm whitespace-pre-wrap">{item.deletedReason}</dd>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
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
            <Tabs defaultValue="issuance">
              <TabsList className="mb-4">
                <TabsTrigger value="issuance">Issuance</TabsTrigger>
                <TabsTrigger value="repairs">Repairs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="issuance">
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
                        assignments.map((issuance: any) => (
                          <TableRow key={issuance._id}>
                            <TableCell>{format(new Date(issuance.date), 'PPP')}</TableCell>
                            <TableCell>{issuance.roomId?.room || 'Unknown'}</TableCell>
                            <TableCell>
                              {issuance.assignedBy ? 
                                `${issuance.assignedBy.firstname} ${issuance.assignedBy.lastname}` : 
                                'Unknown'}
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                issuance.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                issuance.status === 'Transferred' ? 'bg-yellow-100 text-yellow-800' : 
                                issuance.status === 'Surrendered' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {issuance.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            No issuance records found for this item.
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
