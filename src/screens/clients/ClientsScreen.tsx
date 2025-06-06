
import React, { useState } from 'react';
import { SidebarInset, SidebarTrigger } from '../../components/ui/sidebar';
import AppSidebar from '../../components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

interface Client {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Trial';
  plan: string;
  zones: number;
  contactPerson: string;
}

const ClientsScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock client data
  const clients: Client[] = [
    {
      id: 'CLI001',
      companyName: 'TechCorp Industries',
      email: 'admin@techcorp.com',
      phone: '+1 (555) 111-2222',
      status: 'Active',
      plan: 'Enterprise',
      zones: 15,
      contactPerson: 'Alice Johnson'
    },
    {
      id: 'CLI002',
      companyName: 'BuildRight Construction',
      email: 'contact@buildright.com',
      phone: '+1 (555) 333-4444',
      status: 'Active',
      plan: 'Professional',
      zones: 8,
      contactPerson: 'Bob Smith'
    },
    {
      id: 'CLI003',
      companyName: 'SecureGuard Services',
      email: 'info@secureguard.com',
      phone: '+1 (555) 555-6666',
      status: 'Trial',
      plan: 'Trial',
      zones: 3,
      contactPerson: 'Carol Williams'
    },
    {
      id: 'CLI004',
      companyName: 'LogiFlow Logistics',
      email: 'admin@logiflow.com',
      phone: '+1 (555) 777-8888',
      status: 'Active',
      plan: 'Standard',
      zones: 5,
      contactPerson: 'David Brown'
    },
    {
      id: 'CLI005',
      companyName: 'GreenSpace Parks',
      email: 'contact@greenspace.com',
      phone: '+1 (555) 999-0000',
      status: 'Inactive',
      plan: 'Basic',
      zones: 0,
      contactPerson: 'Emma Davis'
    }
  ];

  const filteredClients = clients.filter(client =>
    client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'bg-green-100 text-green-800 border-green-200',
      'Inactive': 'bg-gray-100 text-gray-800 border-gray-200',
      'Trial': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.Inactive}>
        {status}
      </Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const variants = {
      'Enterprise': 'bg-purple-100 text-purple-800 border-purple-200',
      'Professional': 'bg-blue-100 text-blue-800 border-blue-200',
      'Standard': 'bg-green-100 text-green-800 border-green-200',
      'Basic': 'bg-gray-100 text-gray-800 border-gray-200',
      'Trial': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    return (
      <Badge className={variants[plan as keyof typeof variants] || variants.Basic}>
        {plan}
      </Badge>
    );
  };

  return (
    <div className="flex min-h-screen w-full" style={{ backgroundColor: '#F9EDED' }}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-8">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          </div>
          <Button className="bg-[#E87070] hover:bg-[#d86060] text-white">
            + Add Client
          </Button>
        </header>
        
        <main className="flex-1 px-8 py-6">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900 font-bold">Client Directory</CardTitle>
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">ID</TableHead>
                    <TableHead className="font-semibold text-gray-700">Company Name</TableHead>
                    <TableHead className="font-semibold text-gray-700">Contact Person</TableHead>
                    <TableHead className="font-semibold text-gray-700">Email</TableHead>
                    <TableHead className="font-semibold text-gray-700">Phone</TableHead>
                    <TableHead className="font-semibold text-gray-700">Plan</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Zones</TableHead>
                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedClients.map((client, index) => (
                    <TableRow 
                      key={client.id} 
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                    >
                      <TableCell className="font-medium">{client.id}</TableCell>
                      <TableCell className="font-medium text-gray-900">{client.companyName}</TableCell>
                      <TableCell className="text-gray-600">{client.contactPerson}</TableCell>
                      <TableCell className="text-gray-600">{client.email}</TableCell>
                      <TableCell className="text-gray-600">{client.phone}</TableCell>
                      <TableCell>{getPlanBadge(client.plan)}</TableCell>
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
                      <TableCell className="text-gray-600">{client.zones}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="text-[#E87070] border-[#E87070] hover:bg-[#E87070] hover:text-white">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-100">
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredClients.length)} of {filteredClients.length} clients
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-[#E87070] hover:bg-[#d86060]" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </div>
  );
};

export default ClientsScreen;
