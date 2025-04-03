import React, { useState, useEffect, useRef } from 'react';
import Map, {
  NavigationControl,
  Marker,
  Popup,
  GeolocateControl,
  Source,
  Layer
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PlusCircle, Layers, Save, Share2, PenTool, MapPin, Eye, EyeOff, Download } from 'lucide-react';

const neighborhoodColors = {
  'Downtown': 'bg-purple-600/70',
  'Plateau': 'bg-blue-500/70',
  'Mile End': 'bg-indigo-700/70',
  'West Island': 'bg-violet-500/70',
  'Old Montreal': 'bg-pink-500/70',
  'Griffintown': 'bg-emerald-500/70',
  'Little Italy': 'bg-amber-500/70'
};

const mapStyles = [
  { id: 'streets', name: 'Streets', url: 'mapbox://styles/mapbox/streets-v11' },
  { id: 'satellite', name: 'Satellite', url: 'mapbox://styles/mapbox/satellite-streets-v11' },
  { id: 'light', name: 'Light', url: 'mapbox://styles/mapbox/light-v10' },
  { id: 'dark', name: 'Dark', url: 'mapbox://styles/mapbox/dark-v10' },
  { id: 'outdoors', name: 'Outdoors', url: 'mapbox://styles/mapbox/outdoors-v11' }
];

const MapBox = () => {
  const [viewport, setViewport] = useState({
    latitude: 45.5017,
    longitude: -73.5673,
    zoom: 11
  });
  
  const [neighborhoods, setNeighborhoods] = useState([
    {
      id: '1',
      name: 'Downtown',
      latitude: 45.5017,
      longitude: -73.5673,
      description: 'Urban center of Montreal',
      userCreated: false,
      likes: 24,
      comments: 5
    },
    {
      id: '2',
      name: 'Plateau',
      latitude: 45.5125,
      longitude: -73.5800,
      description: 'Artistic neighborhood with colorful houses and cafes',
      userCreated: false,
      likes: 37,
      comments: 8
    },
    {
      id: '3',
      name: 'Mile End',
      latitude: 45.5225,
      longitude: -73.5900,
      description: 'Hip area known for art galleries and music venues',
      userCreated: false,
      likes: 29,
      comments: 6
    },
    {
      id: '4',
      name: 'Old Montreal',
      latitude: 45.5075,
      longitude: -73.5530,
      description: 'Historic district with cobblestone streets',
      userCreated: false,
      likes: 42,
      comments: 12
    }
  ]);
  
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [currentMapStyle, setCurrentMapStyle] = useState(mapStyles[0]);
  const [showLayers, setShowLayers] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    neighborhoods: true,
    transit: false,
    greenSpaces: false,
    heatmap: false
  });
  const [userDrawings, setUserDrawings] = useState([]);
  const [currentDrawing, setCurrentDrawing] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [showStoriesPanel, setShowStoriesPanel] = useState(false);
  
  const mapRef = useRef();
  
  // Generate a unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9);
  
  // Create a new point of interest
  const addNewPOI = (e) => {
    if (!drawingMode) return;
    
    const { lngLat } = e;
    const newNeighborhood = {
      id: generateId(),
      name: `New Place ${neighborhoods.length + 1}`,
      latitude: lngLat.lat,
      longitude: lngLat.lng,
      description: 'Click to edit description',
      userCreated: true,
      likes: 0,
      comments: 0
    };
    
    setNeighborhoods([...neighborhoods, newNeighborhood]);
    setSelectedNeighborhood(newNeighborhood);
  };
  
  // Update neighborhood info
  const updateNeighborhood = (id, updatedData) => {
    const updatedNeighborhoods = neighborhoods.map(hood => 
      hood.id === id ? { ...hood, ...updatedData } : hood
    );
    setNeighborhoods(updatedNeighborhoods);
    
    // Update selected neighborhood if it's the one being edited
    if (selectedNeighborhood && selectedNeighborhood.id === id) {
      setSelectedNeighborhood({ ...selectedNeighborhood, ...updatedData });
    }
  };
  
  // Save user drawing
  const saveDrawing = () => {
    if (currentDrawing.length > 0) {
      const newDrawing = {
        id: generateId(),
        name: `Urban Concept ${userDrawings.length + 1}`,
        coordinates: currentDrawing,
        createdAt: new Date().toISOString()
      };
      
      setUserDrawings([...userDrawings, newDrawing]);
      setCurrentDrawing([]);
      
      // Add story prompt
      setUserStories([...userStories, {
        id: newDrawing.id,
        name: newDrawing.name,
        description: '',
        complete: false
      }]);
      
      setShowStoriesPanel(true);
    }
  };
  
  // Handle drawing
  const handleMapClick = (e) => {
    if (drawingMode) {
      const { lngLat } = e;
      setCurrentDrawing([...currentDrawing, [lngLat.lng, lngLat.lat]]);
    }
  };
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 p-4">
      <h1 className="text-3xl font-bold text-purple-900 mb-2">Montreal Urban Canvas</h1>
      <p className="text-gray-700 mb-4">Design, discover, and dream about your city</p>
      
      <div className="relative w-full max-w-6xl h-[75vh] rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-900/30 mb-4">
        {/* Map Component */}
        <Map
          ref={mapRef}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          initialViewState={viewport}
          onClick={handleMapClick}
          onDblClick={addNewPOI}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '1.5rem'
          }}
          mapStyle={currentMapStyle.url}
          className="absolute inset-0 z-10"
        >
          <NavigationControl position="top-right" />
          <GeolocateControl position="top-left" />
          
          {/* Map Style Controls */}
          <div className="absolute top-4 left-4 z-20 bg-white/90 p-2 rounded-lg shadow-md flex gap-2">
            {mapStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setCurrentMapStyle(style)}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  currentMapStyle.id === style.id 
                    ? 'bg-purple-700 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
          
          {/* Drawing Tools */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/90 p-2 rounded-lg shadow-md">
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setDrawingMode(!drawingMode)}
                className={`p-2 rounded-full ${drawingMode ? 'bg-purple-700 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                title={drawingMode ? "Exit drawing mode" : "Enter drawing mode"}
              >
                <PenTool size={20} />
              </button>
              
              <button
                onClick={() => setShowLayers(!showLayers)}
                className={`p-2 rounded-full ${showLayers ? 'bg-purple-700 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                title="Toggle layers"
              >
                <Layers size={20} />
              </button>
              
              {drawingMode && (
                <>
                  <button
                    onClick={saveDrawing}
                    disabled={currentDrawing.length === 0}
                    className={`p-2 rounded-full ${
                      currentDrawing.length > 0 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    title="Save drawing"
                  >
                    <Save size={20} />
                  </button>
                  
                  <div className="text-xs text-purple-900 font-medium">
                    {drawingMode ? "Click to add points, double-click to add locations" : ""}
                  </div>
                </>
              )}
            </div>
            
            {/* Layers Panel */}
            {showLayers && (
              <div className="mt-2 p-2 bg-white rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-purple-900 mb-2">Map Layers</h4>
                
                <div className="space-y-1">
                  {Object.entries(activeLayers).map(([layer, active]) => (
                    <div key={layer} className="flex items-center">
                      <button
                        onClick={() => setActiveLayers({
                          ...activeLayers,
                          [layer]: !active
                        })}
                        className="flex items-center gap-2"
                      >
                        {active ? <Eye size={16} className="text-purple-700" /> : <EyeOff size={16} className="text-gray-400" />}
                        <span className={`text-xs ${active ? 'text-purple-900 font-medium' : 'text-gray-500'}`}>
                          {layer.charAt(0).toUpperCase() + layer.slice(1)}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Neighborhood Markers */}
          {activeLayers.neighborhoods && neighborhoods.map((hood) => (
            <Marker
              key={hood.id}
              latitude={hood.latitude}
              longitude={hood.longitude}
              onClick={() => setSelectedNeighborhood(hood)}
              className="z-20"
            >
              <div
                className={`
                  ${neighborhoodColors[hood.name] || 'bg-gray-600/70'}
                  px-3 py-1 rounded-full
                  text-white text-sm
                  cursor-pointer
                  hover:scale-110 transition-transform
                  ${hood.userCreated ? 'border-2 border-white' : ''}
                `}
              >
                {hood.name}
              </div>
            </Marker>
          ))}
          
          {/* Display current drawing */}
          {currentDrawing.length > 0 && (
            <Source
              id="current-drawing"
              type="geojson"
              data={{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: currentDrawing
                }
              }}
            >
              <Layer
                id="drawing-line"
                type="line"
                paint={{
                  'line-color': '#6d28d9',
                  'line-width': 4,
                  'line-dasharray': [1, 1]
                }}
              />
            </Source>
          )}
          
          {/* Saved drawings */}
          {userDrawings.map((drawing) => (
            <Source
              key={drawing.id}
              id={`drawing-${drawing.id}`}
              type="geojson"
              data={{
                type: 'Feature',
                properties: {
                  name: drawing.name
                },
                geometry: {
                  type: 'LineString',
                  coordinates: drawing.coordinates
                }
              }}
            >
              <Layer
                id={`drawing-fill-${drawing.id}`}
                type="fill"
                paint={{
                  'fill-color': '#8b5cf6',
                  'fill-opacity': 0.3
                }}
              />
              <Layer
                id={`drawing-line-${drawing.id}`}
                type="line"
                paint={{
                  'line-color': '#6d28d9',
                  'line-width': 2
                }}
              />
            </Source>
          ))}
          
          {/* Popup for selected neighborhood */}
          {selectedNeighborhood && (
            <Popup
              latitude={selectedNeighborhood.latitude}
              longitude={selectedNeighborhood.longitude}
              onClose={() => setSelectedNeighborhood(null)}
              closeButton={true}
              closeOnClick={false}
              className="z-30"
              maxWidth="300px"
            >
              <div className="bg-gradient-to-br from-purple-800 to-blue-800 p-4 rounded-lg">
                {selectedNeighborhood.userCreated ? (
                  <input
                    type="text"
                    value={selectedNeighborhood.name}
                    onChange={(e) => updateNeighborhood(selectedNeighborhood.id, { name: e.target.value })}
                    className="w-full bg-transparent border-b border-white/50 text-xl font-bold text-white mb-2 focus:outline-none focus:border-white"
                  />
                ) : (
                  <h3 className="text-xl font-bold text-white mb-2">
                    {selectedNeighborhood.name}
                  </h3>
                )}
                
                {selectedNeighborhood.userCreated ? (
                  <textarea
                    value={selectedNeighborhood.description}
                    onChange={(e) => updateNeighborhood(selectedNeighborhood.id, { description: e.target.value })}
                    className="w-full bg-transparent border border-white/30 text-white p-2 rounded focus:outline-none focus:border-white"
                    rows={3}
                  />
                ) : (
                  <p className="text-white">
                    {selectedNeighborhood.description}
                  </p>
                )}
                
                <div className="flex items-center mt-3 text-white/80 text-xs">
                  <button className="flex items-center mr-3">
                    <span className="mr-1">👍</span> {selectedNeighborhood.likes}
                  </button>
                  <button className="flex items-center">
                    <span className="mr-1">💬</span> {selectedNeighborhood.comments}
                  </button>
                </div>
              </div>
            </Popup>
          )}
        </Map>
        
        {/* Urban Stories Panel */}
        <div 
          className={`absolute right-0 top-0 bottom-0 bg-white/95 w-72 z-30 p-4 transition-transform duration-300 shadow-lg ${
            showStoriesPanel ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-purple-900">Urban Stories</h3>
            <button 
              onClick={() => setShowStoriesPanel(!showStoriesPanel)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showStoriesPanel ? '→' : '←'}
            </button>
          </div>
          
          <div className="space-y-4 max-h-[90%] overflow-y-auto">
            {userStories.length === 0 ? (
              <p className="text-sm text-gray-500">
                Draw on the map to start creating urban stories!
              </p>
            ) : (
              userStories.map((story) => (
                <div 
                  key={story.id} 
                  className="p-3 bg-purple-50 rounded-lg border border-purple-200"
                >
                  <h4 className="font-medium text-purple-900">{story.name}</h4>
                  <textarea
                    placeholder="What's your vision for this area?"
                    value={story.description}
                    onChange={(e) => {
                      const updatedStories = userStories.map(s => 
                        s.id === story.id ? {...s, description: e.target.value} : s
                      );
                      setUserStories(updatedStories);
                    }}
                    className="w-full mt-2 p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                    rows={3}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">Created: {new Date().toLocaleDateString()}</span>
                    <button className="text-xs text-purple-700 hover:text-purple-900">
                      <Share2 size={14} className="inline mr-1" /> Share
                    </button>
                  </div>
                </div>
              ))
            )}
            
            <button className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <PlusCircle size={16} className="inline mr-1" /> Add New Vision
            </button>
          </div>
        </div>
        
        {/* Toggle for Stories Panel */}
        <button
          onClick={() => setShowStoriesPanel(!showStoriesPanel)}
          className={`absolute top-4 right-4 z-20 bg-white p-2 rounded-full shadow-md ${
            showStoriesPanel ? 'bg-purple-700 text-white' : 'bg-white text-purple-900'
          }`}
        >
          {showStoriesPanel ? '→' : '←'}
        </button>
      </div>
      
      {/* Community Tools */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-purple-900 mb-2">Community Challenges</h3>
          <p className="text-sm text-gray-600 mb-3">Join this week's urban design challenge:</p>
          <div className="bg-purple-100 p-3 rounded-lg">
            <h4 className="font-medium text-purple-800">Green Transit Corridors</h4>
            <p className="text-xs text-gray-700 mt-1">Design bike-friendly routes connecting neighborhoods</p>
            <button className="mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded-full hover:bg-purple-700">
              Join Challenge
            </button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-purple-900 mb-2">Trending Designs</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">Urban Garden Network</span>
              <span className="text-xs text-purple-600">128 likes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">Pedestrian Friendly Market</span>
              <span className="text-xs text-purple-600">97 likes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">Riverside Amphitheater</span>
              <span className="text-xs text-purple-600">84 likes</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-purple-900 mb-2">Upcoming Events</h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Urban Planning Workshop</h4>
              <p className="text-xs text-gray-600">Apr 15, 2025 • Downtown Community Center</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800">Public Space Design Contest</h4>
              <p className="text-xs text-gray-600">May 2, 2025 • Online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapBox;