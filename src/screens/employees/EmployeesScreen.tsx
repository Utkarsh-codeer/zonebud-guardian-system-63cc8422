
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  joinDate: string;
  zones: number;
}

const EmployeesScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock employee data
  const employees: Employee[] = [
    {
      id: 'EMP001',
      name: 'John Smith',
      email: 'john.smith@zonebud.com',
      phone: '+1 (555) 123-4567',
      role: 'Zone Manager',
      status: 'Active',
      joinDate: '2024-01-15',
      zones: 3
    },
    {
      id: 'EMP002',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@zonebud.com',
      phone: '+1 (555) 234-5678',
      role: 'Zone Worker',
      status: 'Active',
      joinDate: '2024-02-01',
      zones: 1
    },
    {
      id: 'EMP003',
      name: 'Mike Davis',
      email: 'mike.davis@zonebud.com',
      phone: '+1 (555) 345-6789',
      role: 'Zone Worker',
      status: 'Inactive',
      joinDate: '2024-01-20',
      zones: 0
    },
    {
      id: 'EMP004',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@zonebud.com',
      phone: '+1 (555) 456-7890',
      role: 'Zone Manager',
      status: 'Active',
      joinDate: '2024-03-01',
      zones: 2
    },
    {
      id: 'EMP005',
      name: 'David Wilson',
      email: 'david.wilson@zonebud.com',
      phone: '+1 (555) 567-8901',
      role: 'Zone Worker',
      status: 'Pending',
      joinDate: '2024-03-15',
      zones: 0
    }
  ];

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'bg-green-100 text-green-800 border-green-200',
      'Inactive': 'bg-gray-100 text-gray-800 border-gray-200',
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.Inactive}>
        {status}
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
            <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          </div>
          <Link to="/employees/onboard">
            <Button className="bg-[#E87070] hover:bg-[#d86060] text-white">
              + Add Employee
            </Button>
          </Link>
        </header>
        
        <main className="flex-1 px-8 py-6">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900 font-bold">Employee Directory</CardTitle>
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Search employees..."
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
                    <TableHead className="font-semibold text-gray-700">Name</TableHead>
                    <TableHead className="font-semibold text-gray-700">Email</TableHead>
                    <TableHead className="font-semibold text-gray-700">Phone</TableHead>
                    <TableHead className="font-semibold text-gray-700">Role</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Zones</TableHead>
                    <TableHead className="font-semibold text-gray-700">Join Date</TableHead>
                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEmployees.map((employee, index) => (
                    <TableRow 
                      key={employee.id} 
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                    >
                      <TableCell className="font-medium">{employee.id}</TableCell>
                      <TableCell className="font-medium text-gray-900">{employee.name}</TableCell>
                      <TableCell className="text-gray-600">{employee.email}</TableCell>
                      <TableCell className="text-gray-600">{employee.phone}</TableCell>
                      <TableCell className="text-gray-600">{employee.role}</TableCell>
                      <TableCell>{getStatusBadge(employee.status)}</TableCell>
                      <TableCell className="text-gray-600">{employee.zones}</TableCell>
                      <TableCell className="text-gray-600">{employee.joinDate}</TableCell>
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
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} employees
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

export default EmployeesScreen;
