
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
    info?: string;
  }>;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center = { lat: 51.5074, lng: -0.1278 }, // London default
  zoom = 13,
  markers = [],
  onLocationSelect,
  className = "h-96 w-full rounded-lg",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Check if API key is available from environment or user input
    const storedApiKey = localStorage.getItem('googleMapsApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsApiKeySet(true);
      loadGoogleMapsScript(storedApiKey);
    }
  }, []);

  useEffect(() => {
    if (isApiKeySet && apiKey) {
      localStorage.setItem('googleMapsApiKey', apiKey);
      loadGoogleMapsScript(apiKey);
    }
  }, [isApiKeySet, apiKey]);

  useEffect(() => {
    if (map && markers.length > 0) {
      // Clear existing markers
      markers.forEach(markerData => {
        const marker = new window.google.maps.Marker({
          position: markerData.position,
          map: map,
          title: markerData.title,
        });

        if (markerData.info) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: markerData.info,
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        }
      });
    }
  }, [map, markers]);

  const loadGoogleMapsScript = (key: string) => {
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    window.initMap = initializeMap;
    
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const googleMap = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });

    if (onLocationSelect) {
      googleMap.addListener('click', (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        onLocationSelect({ lat, lng });
      });
    }

    setMap(googleMap);
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setIsApiKeySet(true);
    }
  };

  const searchLocation = () => {
    if (!map || !searchQuery || !window.google) return;

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      query: searchQuery,
      fields: ['name', 'geometry'],
    };

    service.findPlaceFromQuery(request, (results: any, status: any) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
        const place = results[0];
        map.setCenter(place.geometry.location);
        map.setZoom(15);
        
        new window.google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: place.name,
        });
      }
    });
  };

  if (!isApiKeySet) {
    return (
      <div className={`${className} flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300`}>
        <div className="text-center p-6">
          <h3 className="text-lg font-semibold mb-4">Google Maps Integration</h3>
          <p className="text-gray-600 mb-4">
            Please enter your Google Maps API key to enable map functionality.
          </p>
          <div className="flex gap-2 max-w-md">
            <Input
              type="password"
              placeholder="Enter Google Maps API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleApiKeySubmit}>
              Set Key
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Get your API key from{' '}
            <a 
              href="https://console.cloud.google.com/apis/credentials" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Google Cloud Console
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
          className="flex-1"
        />
        <Button onClick={searchLocation}>
          Search
        </Button>
      </div>
      <div ref={mapRef} className={className} />
    </div>
  );
};

export default GoogleMap;
