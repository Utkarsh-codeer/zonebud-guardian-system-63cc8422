
import React, { useState } from 'react';
import Navigation from '../../components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/use-toast';

const ProfileScreen: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(profileData);
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
    
    setIsEditing(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'client_admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'zone_manager':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'zone_worker':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            View and manage your personal information
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row">
                <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 flex flex-col items-center">
                  <Avatar className="w-32 h-32">
                    {(previewUrl || user.profileImage) ? (
                      <AvatarImage src={previewUrl || user.profileImage} alt={user.name} />
                    ) : (
                      <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
                    )}
                  </Avatar>

                  {isEditing && (
                    <div className="mt-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="max-w-[200px] text-sm"
                      />
                    </div>
                  )}

                  <div className="mt-4">
                    <Badge className={`${getRoleBadgeColor(user.role)} text-xs font-medium px-3 py-1`}>
                      {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-gray-200">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-gray-200">{user.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-gray-200">{user.phone}</p>
                    )}
                  </div>

                  <div className="pt-4">
                    {isEditing ? (
                      <div className="flex space-x-4">
                        <Button type="submit">Save Changes</Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setProfileData({
                              name: user.name,
                              phone: user.phone,
                              email: user.email,
                            });
                            setPreviewUrl(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Change Password</h3>
                <p className="text-muted-foreground mb-4">
                  Regularly updating your password helps keep your account secure.
                </p>
                <Button>Change Password</Button>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                <p className="text-muted-foreground mb-4">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
                <div className="flex items-center">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 mr-4">
                    Enabled
                  </Badge>
                  <Button variant="outline">Configure 2FA</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account ID:</span>
                <span>{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Login:</span>
                <span>Today at 09:15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Created:</span>
                <span>15 January 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfileScreen;
