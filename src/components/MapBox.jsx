import React, { useState } from 'react';
import Map, { 
  NavigationControl, 
  Marker, 
  Popup, 
  GeolocateControl 
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const neighborhoodColors = {
  'Downtown': 'bg-purple-600/70',
  'Plateau': 'bg-blue-500/70',
  'Mile End': 'bg-indigo-700/70',
  'West Island': 'bg-violet-500/70'
};

const MapBox = () => {
  const [viewport, setViewport] = useState({
    latitude: 45.5017,
    longitude: -73.5673,
    zoom: 11
  });

  const [neighborhoods, setNeighborhoods] = useState([
    { 
      name: 'Downtown', 
      latitude: 45.5017, 
      longitude: -73.5673,
      description: 'Urban center of Montreal'
    },
    { 
      name: 'Plateau', 
      latitude: 45.5125, 
      longitude: -73.5800,
      description: 'Artistic neighborhood'
    }
  ]);

  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="relative w-[70vw] h-[70vh] rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-900/30 mt-8 mb-8">
        <Map
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          initialViewState={viewport}
          style={{ 
            width: '100%', 
            height: '100%',
            borderRadius: '1.5rem'
          }}
          mapStyle="mapbox://styles/mapbox/streets-v11" // Changed from dark to streets style
          className="absolute inset-0 z-10"
        >
          <NavigationControl position="top-right" />
          <GeolocateControl position="top-left" />

          {neighborhoods.map((hood) => (
            <Marker
              key={hood.name}
              latitude={hood.latitude}
              longitude={hood.longitude}
              onClick={() => setSelectedNeighborhood(hood)}
              className="z-20"
            >
              <div 
                className={`
                  ${neighborhoodColors[hood.name]} 
                  px-3 py-1 rounded-full 
                  text-white text-sm 
                  cursor-pointer 
                  hover:scale-110 transition-transform
                `}
              >
                {hood.name}
              </div>
            </Marker>
          ))}

          {selectedNeighborhood && (
            <Popup
              latitude={selectedNeighborhood.latitude}
              longitude={selectedNeighborhood.longitude}
              onClose={() => setSelectedNeighborhood(null)}
              closeButton={true}
              closeOnClick={false}
              className="z-30"
            >
              <div className="bg-gradient-to-br from-purple-800 to-blue-800 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-2">
                  {selectedNeighborhood.name}
                </h3>
                <p className="text-white">
                  {selectedNeighborhood.description}
                </p>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
};

export default MapBox;