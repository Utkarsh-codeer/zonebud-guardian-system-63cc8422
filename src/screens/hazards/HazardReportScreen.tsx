
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useToast } from '../../components/ui/use-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useZone } from '../../contexts/ZoneContext';

const HazardReportScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { zones } = useZone();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: '',
    zoneId: '',
    category: '',
    location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Hazard Reported",
        description: "Your hazard report has been submitted successfully.",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        severity: '',
        zoneId: '',
        category: '',
        location: '',
      });
      setSelectedImages([]);

      navigate('/hazards/log');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit hazard report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const userZones = zones.filter(zone => 
    user?.zoneIds.includes(zone.id) || zone.managerId === user?.id
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Report Hazard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Report safety hazards to keep your team safe
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hazard Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Hazard Title *
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Brief description of the hazard"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="severity" className="block text-sm font-medium mb-2">
                    Severity Level *
                  </label>
                  <Select onValueChange={(value) => handleInputChange('severity', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Minor concern</SelectItem>
                      <SelectItem value="medium">Medium - Moderate risk</SelectItem>
                      <SelectItem value="high">High - Immediate attention required</SelectItem>
                      <SelectItem value="critical">Critical - Emergency situation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2">
                    Category *
                  </label>
                  <Select onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slip-trip-fall">Slip, Trip & Fall</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="chemical">Chemical/Hazardous Materials</SelectItem>
                      <SelectItem value="fire">Fire Safety</SelectItem>
                      <SelectItem value="structural">Structural Damage</SelectItem>
                      <SelectItem value="equipment">Equipment Malfunction</SelectItem>
                      <SelectItem value="environmental">Environmental</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="zone" className="block text-sm font-medium mb-2">
                    Zone *
                  </label>
                  <Select onValueChange={(value) => handleInputChange('zoneId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {userZones.map(zone => (
                        <SelectItem key={zone.id} value={zone.id}>
                          {zone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-2">
                  Specific Location
                </label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Building A, 2nd floor, near elevator"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Detailed Description *
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide a detailed description of the hazard, including what happened, potential risks, and any immediate actions taken..."
                  rows={6}
                  required
                />
              </div>

              <div>
                <label htmlFor="images" className="block text-sm font-medium mb-2">
                  Photos/Videos
                </label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleImageSelect}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload photos or videos of the hazard (optional)
                </p>
                {selectedImages.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      {selectedImages.length} file(s) selected:
                    </p>
                    <ul className="text-xs text-muted-foreground">
                      {selectedImages.map((file, index) => (
                        <li key={index}>• {file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  ⚠️ Important Safety Reminder
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  If this is an emergency situation requiring immediate attention, 
                  do not rely solely on this form. Contact emergency services (999) 
                  or your site supervisor immediately.
                </p>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.title || !formData.description || !formData.severity}
                  className="flex-1"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Hazard Report'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/hazards/log')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default HazardReportScreen;
