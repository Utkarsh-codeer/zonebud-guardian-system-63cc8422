
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

// TODO: Replace this placeholder with your Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyBxKDLSkzj2K3FsBVp569FkexLTkF5gB38';

const GoogleMap: React.FC<GoogleMapProps> = ({
  center = { lat: 51.5074, lng: -0.1278 }, // London default
  zoom = 13,
  markers = [],
  onLocationSelect,
  className = "h-96 w-full rounded-lg",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);

  useEffect(() => {
    // Check if the API key has been replaced from the placeholder
    if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.trim() !== '') {
      setIsApiKeyValid(true);
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }
      loadGoogleMapsScript();
    }
  }, []);

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

  const loadGoogleMapsScript = () => {
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
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

  if (!isApiKeyValid) {
    return (
      <div className={`${className} flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300`}>
        <div className="text-center p-6">
          <h3 className="text-lg font-semibold mb-4">Google Maps Integration</h3>
          <p className="text-gray-600 mb-4">
            To enable Google Maps functionality, please replace the API key placeholder in the code.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg text-left">
            <p className="text-sm font-mono text-gray-700 mb-2">
              File: src/components/maps/GoogleMap.tsx
            </p>
            <p className="text-sm font-mono text-gray-700">
              Replace: YOUR_GOOGLE_MAPS_API_KEY_HERE
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-4">
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
