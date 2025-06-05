
import React, { useState } from 'react';
import Navigation from '../../components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/use-toast';

const DocumentsScreen: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFolder, setCurrentFolder] = useState('root');

  // Mock folder structure and documents
  const mockFolders = [
    { id: 'safety', name: 'Safety Documents', parent: 'root', itemCount: 5 },
    { id: 'procedures', name: 'Procedures', parent: 'root', itemCount: 8 },
    { id: 'emergency', name: 'Emergency Protocols', parent: 'safety', itemCount: 3 },
    { id: 'training', name: 'Training Materials', parent: 'root', itemCount: 12 },
  ];

  const mockDocuments = [
    {
      id: 'doc-1',
      name: 'Site Safety Guidelines.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadedAt: new Date('2024-01-15'),
      uploadedBy: 'Safety Manager',
      folder: 'safety',
      zoneAccess: ['zone-1', 'zone-2'],
      tags: ['safety', 'guidelines', 'mandatory'],
    },
    {
      id: 'doc-2',
      name: 'Emergency Evacuation Plan.docx',
      type: 'Document',
      size: '1.8 MB',
      uploadedAt: new Date('2024-01-20'),
      uploadedBy: 'Emergency Coordinator',
      folder: 'emergency',
      zoneAccess: ['zone-1'],
      tags: ['emergency', 'evacuation', 'critical'],
    },
    {
      id: 'doc-3',
      name: 'Site Layout Plan.jpg',
      type: 'Image',
      size: '5.2 MB',
      uploadedAt: new Date('2024-02-01'),
      uploadedBy: 'Project Manager',
      folder: 'root',
      zoneAccess: ['zone-1', 'zone-2', 'zone-3'],
      tags: ['layout', 'reference'],
    },
    {
      id: 'doc-4',
      name: 'Equipment Operation Manual.pdf',
      type: 'PDF',
      size: '3.7 MB',
      uploadedAt: new Date('2024-02-10'),
      uploadedBy: 'Technical Lead',
      folder: 'procedures',
      zoneAccess: ['zone-1'],
      tags: ['equipment', 'manual', 'operations'],
    },
    {
      id: 'doc-5',
      name: 'First Aid Procedures.mp4',
      type: 'Video',
      size: '45.8 MB',
      uploadedAt: new Date('2024-02-15'),
      uploadedBy: 'Safety Officer',
      folder: 'training',
      zoneAccess: ['zone-1', 'zone-2'],
      tags: ['first-aid', 'training', 'video'],
    },
  ];

  const currentFolders = mockFolders.filter(folder => folder.parent === currentFolder);
  const currentDocuments = mockDocuments.filter(doc => 
    doc.folder === currentFolder && 
    (searchTerm === '' || doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return '📄';
      case 'document': return '📝';
      case 'image': return '🖼️';
      case 'video': return '🎥';
      default: return '📁';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  const handleDownload = (doc: any) => {
    toast({
      title: "Download Started",
      description: `Downloading ${doc.name}...`,
    });
  };

  const handleUpload = () => {
    if (user?.role === 'zone_worker') {
      toast({
        title: "Access Restricted",
        description: "You don't have permission to upload documents.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Upload Feature",
      description: "Document upload functionality would be implemented here.",
    });
  };

  const breadcrumbPath = () => {
    const paths = [];
    let current = currentFolder;
    
    while (current !== 'root') {
      const folder = mockFolders.find(f => f.id === current);
      if (folder) {
        paths.unshift(folder);
        current = folder.parent;
      } else {
        break;
      }
    }
    
    return paths;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documents</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Access and manage zone documents
              </p>
            </div>
            {(user?.role === 'zone_manager' || user?.role === 'super_admin') && (
              <Button onClick={handleUpload}>📁 Upload Document</Button>
            )}
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => setCurrentFolder('root')}
              className={`hover:text-primary ${currentFolder === 'root' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
            >
              📁 Root
            </button>
            {breadcrumbPath().map((folder, index) => (
              <React.Fragment key={folder.id}>
                <span className="text-muted-foreground">/</span>
                <button
                  onClick={() => setCurrentFolder(folder.id)}
                  className="hover:text-primary text-muted-foreground"
                >
                  {folder.name}
                </button>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search documents by name or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="space-y-6">
          {/* Folders */}
          {currentFolders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Folders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentFolders.map(folder => (
                    <div
                      key={folder.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => setCurrentFolder(folder.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">📁</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{folder.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {folder.itemCount} items
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {currentDocuments.length > 0 ? (
                <div className="space-y-4">
                  {currentDocuments.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="text-2xl">{getFileIcon(doc.type)}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{doc.name}</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {doc.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {doc.type} • {formatFileSize(doc.size)} • Uploaded by {doc.uploadedBy} on {formatDate(doc.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}>
                          Download
                        </Button>
                        {(user?.role === 'zone_manager' || user?.role === 'super_admin') && (
                          <Button size="sm" variant="ghost">Share</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📂</div>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'No documents found matching your search' : 'No documents in this folder'}
                  </p>
                  {(user?.role === 'zone_manager' || user?.role === 'super_admin') && (
                    <Button onClick={handleUpload}>Upload First Document</Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DocumentsScreen;
