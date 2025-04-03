import React, { useState, useEffect, useRef, useContext } from 'react';
import Map, {
  NavigationControl,
  Marker,
  Popup,
  GeolocateControl,
  Source,
  Layer
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PlusCircle, Layers, Save, Share2, PenTool, MapPin, Eye, EyeOff, Compass, Building, ChevronLeft } from 'lucide-react';
import { ThemeContext } from '../components/ThemeContext';

const neighborhoodColors = {
  light: {
    'Downtown': 'bg-purple-600/80',
    'Plateau': 'bg-blue-500/80',
    'Mile End': 'bg-indigo-700/80',
    'West Island': 'bg-violet-500/80',
    'Old Montreal': 'bg-pink-500/80',
    'Griffintown': 'bg-emerald-500/80',
    'Little Italy': 'bg-amber-500/80'
  },
  dark: {
    'Downtown': 'bg-purple-400/90',
    'Plateau': 'bg-blue-300/90',
    'Mile End': 'bg-indigo-300/90',
    'West Island': 'bg-violet-300/90',
    'Old Montreal': 'bg-pink-300/90',
    'Griffintown': 'bg-emerald-300/90',
    'Little Italy': 'bg-amber-300/90'
  }
};

const mapStyles = [
  { id: 'streets', name: 'Streets', light: 'mapbox://styles/mapbox/streets-v11', dark: 'mapbox://styles/mapbox/dark-v10' },
  { id: 'satellite', name: 'Satellite', light: 'mapbox://styles/mapbox/satellite-streets-v11', dark: 'mapbox://styles/mapbox/satellite-streets-v11' },
  { id: 'light', name: 'Light', light: 'mapbox://styles/mapbox/light-v10', dark: 'mapbox://styles/mapbox/light-v10' },
  { id: 'dark', name: 'Dark', light: 'mapbox://styles/mapbox/dark-v10', dark: 'mapbox://styles/mapbox/dark-v10' },
  { id: 'outdoors', name: 'Outdoors', light: 'mapbox://styles/mapbox/outdoors-v11', dark: 'mapbox://styles/mapbox/outdoors-v11' }
];

const MapBox = () => {
  const { theme } = useContext(ThemeContext);
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
  
  const generateId = () => Math.random().toString(36).substring(2, 9);
  
  const getMapStyleUrl = (style) => {
    return theme === 'dark' ? style.dark : style.light;
  };

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
  
  const updateNeighborhood = (id, updatedData) => {
    const updatedNeighborhoods = neighborhoods.map(hood => 
      hood.id === id ? { ...hood, ...updatedData } : hood
    );
    setNeighborhoods(updatedNeighborhoods);
    
    if (selectedNeighborhood && selectedNeighborhood.id === id) {
      setSelectedNeighborhood({ ...selectedNeighborhood, ...updatedData });
    }
  };
  
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
      
      setUserStories([...userStories, {
        id: newDrawing.id,
        name: newDrawing.name,
        description: '',
        complete: false
      }]);
      
      setShowStoriesPanel(true);
    }
  };
  
  const handleMapClick = (e) => {
    if (drawingMode) {
      const { lngLat } = e;
      setCurrentDrawing([...currentDrawing, [lngLat.lng, lngLat.lat]]);
    }
  };

  return (
    <div className={`flex flex-col items-center min-h-screen ${theme === 'dark' ? 'bg-n-8' : 'bg-gradient-to-b from-n-1 to-n-2'} transition-colors duration-300 p-4`}>
      {/* Header */}
      <div className="w-full max-w-6xl text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="hidden md:block h-[2px] w-16 bg-gradient-to-r from-purple-500 to-transparent"></div>
          <div className="flex items-center mx-4">
            <Building className={`w-6 h-6 mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`} />
            <span className={`text-sm uppercase tracking-widest ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>
              Urban Explorer
            </span>
          </div>
          <div className="hidden md:block h-[2px] w-16 bg-gradient-to-l from-purple-500 to-transparent"></div>
        </div>
        
        <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-n-1' : 'text-n-9'}`}>
          <span className="block mb-2 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500">
            Montreal Urban Canvas
          </span>
          <span className="relative inline-block">
            Design Your 
            <span className="relative font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Future City
            </span>
          </span>
        </h1>
        
        <p className={`${theme === 'dark' ? 'text-n-4' : 'text-n-7'} mb-4 flex items-center justify-center`}>
          <Compass className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`} />
          For urban planners and city dreamers
          <MapPin className={`w-4 h-4 ml-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`} />
        </p>
      </div>
      
      {/* Map Container */}
      <div className={`relative w-full max-w-6xl h-[75vh] rounded-2xl overflow-hidden shadow-xl ${theme === 'dark' ? 'border border-n-6' : 'border border-n-4/30'} mb-6`}>
        <Map
          ref={mapRef}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          initialViewState={viewport}
          onClick={handleMapClick}
          onDblClick={addNewPOI}
          style={{ width: '100%', height: '100%' }}
          mapStyle={getMapStyleUrl(currentMapStyle)}
          className="absolute inset-0 z-10"
        >
          <NavigationControl position="top-right" showCompass={false} />
          <GeolocateControl position="top-left" />
          
          {/* Map Style Controls */}
          <div className={`absolute top-4 left-4 z-20 ${theme === 'dark' ? 'bg-n-7/90' : 'bg-white/90'} p-1 rounded-lg shadow-md flex gap-1`}>
            {mapStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setCurrentMapStyle(style)}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  currentMapStyle.id === style.id 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                    : theme === 'dark' 
                      ? 'bg-n-6 text-n-2 hover:bg-n-5' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
          
          {/* Drawing Tools */}
          <div className={`absolute bottom-4 left-4 z-20 ${theme === 'dark' ? 'bg-n-7/90' : 'bg-white/90'} p-2 rounded-lg shadow-md`}>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setDrawingMode(!drawingMode)}
                className={`p-2 rounded-full transition-all ${
                  drawingMode 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                    : theme === 'dark' 
                      ? 'bg-n-6 text-n-2 hover:bg-n-5' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={drawingMode ? "Exit drawing mode" : "Enter drawing mode"}
              >
                <PenTool size={18} />
              </button>
              
              <button
                onClick={() => setShowLayers(!showLayers)}
                className={`p-2 rounded-full transition-all ${
                  showLayers 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                    : theme === 'dark' 
                      ? 'bg-n-6 text-n-2 hover:bg-n-5' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Toggle layers"
              >
                <Layers size={18} />
              </button>
              
              {drawingMode && (
                <>
                  <button
                    onClick={saveDrawing}
                    disabled={currentDrawing.length === 0}
                    className={`p-2 rounded-full transition-all ${
                      currentDrawing.length > 0 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                        : theme === 'dark' 
                          ? 'bg-n-6 text-n-4 cursor-not-allowed' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    title="Save drawing"
                  >
                    <Save size={18} />
                  </button>
                  
                  <div className={`text-xs font-medium ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>
                    {drawingMode ? "Click to add points, double-click to add locations" : ""}
                  </div>
                </>
              )}
            </div>
            
            {/* Layers Panel */}
            {showLayers && (
              <div className={`mt-2 p-2 rounded-lg border shadow-lg ${theme === 'dark' ? 'bg-n-7 border-n-6' : 'bg-white border-gray-200'}`}>
                <h4 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>Map Layers</h4>
                
                <div className="space-y-1">
                  {Object.entries(activeLayers).map(([layer, active]) => (
                    <div key={layer} className="flex items-center">
                      <button
                        onClick={() => setActiveLayers({
                          ...activeLayers,
                          [layer]: !active
                        })}
                        className={`flex items-center gap-2 w-full px-2 py-1 rounded ${theme === 'dark' ? 'hover:bg-n-6' : 'hover:bg-purple-50'}`}
                      >
                        {active ? <Eye size={16} className={theme === 'dark' ? 'text-purple-400' : 'text-purple-700'} /> : <EyeOff size={16} className={theme === 'dark' ? 'text-n-4' : 'text-gray-400'} />}
                        <span className={`text-xs ${active ? (theme === 'dark' ? 'text-n-2 font-medium' : 'text-purple-700 font-medium') : (theme === 'dark' ? 'text-n-4' : 'text-gray-500')}`}>
                          {layer.charAt(0).toUpperCase() + layer.slice(1).replace(/([A-Z])/g, ' $1')}
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
                  ${theme === 'dark' ? neighborhoodColors.dark[hood.name] || 'bg-gray-400/90' : neighborhoodColors.light[hood.name] || 'bg-gray-600/80'}
                  px-3 py-1 rounded-full
                  text-white text-xs font-medium
                  cursor-pointer
                  hover:scale-110 transition-transform
                  ${hood.userCreated ? 'border border-white/50' : ''}
                  shadow-md
                `}
              >
                {hood.name}
              </div>
            </Marker>
          ))}
          
          {/* Current drawing */}
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
                  'line-color': theme === 'dark' ? '#a78bfa' : '#7c3aed',
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
                  'fill-color': theme === 'dark' ? '#a78bfa' : '#8b5cf6',
                  'fill-opacity': 0.3
                }}
              />
              <Layer
                id={`drawing-line-${drawing.id}`}
                type="line"
                paint={{
                  'line-color': theme === 'dark' ? '#a78bfa' : '#7c3aed',
                  'line-width': 2
                }}
              />
            </Source>
          ))}
          
          {/* Popup */}
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
              <div className={`p-4 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gradient-to-br from-n-7 to-n-8 border border-n-6' : 'bg-gradient-to-br from-purple-50 to-blue-50 border border-n-4/30'}`}>
                {selectedNeighborhood.userCreated ? (
                  <input
                    type="text"
                    value={selectedNeighborhood.name}
                    onChange={(e) => updateNeighborhood(selectedNeighborhood.id, { name: e.target.value })}
                    className={`w-full bg-transparent border-b ${theme === 'dark' ? 'border-n-5 text-n-1 focus:border-purple-400' : 'border-n-4/50 text-n-9 focus:border-purple-600'} text-lg font-bold mb-2 focus:outline-none`}
                  />
                ) : (
                  <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-n-1' : 'text-n-9'}`}>
                    {selectedNeighborhood.name}
                  </h3>
                )}
                
                {selectedNeighborhood.userCreated ? (
                  <textarea
                    value={selectedNeighborhood.description}
                    onChange={(e) => updateNeighborhood(selectedNeighborhood.id, { description: e.target.value })}
                    className={`w-full p-2 rounded focus:outline-none ${theme === 'dark' ? 'bg-n-7 border-n-6 text-n-2 focus:ring-purple-400' : 'bg-white border-n-4/30 text-n-8 focus:ring-purple-600'} border focus:ring-1`}
                    rows={3}
                  />
                ) : (
                  <p className={theme === 'dark' ? 'text-n-3' : 'text-n-7'}>
                    {selectedNeighborhood.description}
                  </p>
                )}
                
                <div className={`flex items-center mt-3 text-xs ${theme === 'dark' ? 'text-n-4' : 'text-n-6'}`}>
                  <button className="flex items-center mr-3 hover:text-purple-500 transition-colors">
                    <span className="mr-1">👍</span> {selectedNeighborhood.likes}
                  </button>
                  <button className="flex items-center hover:text-purple-500 transition-colors">
                    <span className="mr-1">💬</span> {selectedNeighborhood.comments}
                  </button>
                </div>
              </div>
            </Popup>
          )}
        </Map>
        
        {/* Urban Stories Panel */}
        <div 
          className={`absolute right-0 top-0 bottom-0 ${theme === 'dark' ? 'bg-n-8/95 border-l border-n-6' : 'bg-white/95 border-l border-n-4/30'} w-72 z-30 p-4 transition-transform duration-300 shadow-lg ${
            showStoriesPanel ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className={`flex justify-between items-center mb-4 pb-2 ${theme === 'dark' ? 'border-b border-n-6' : 'border-b border-n-4/30'}`}>
            <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>Urban Stories</h3>
            <button 
              onClick={() => setShowStoriesPanel(!showStoriesPanel)}
              className={theme === 'dark' ? 'text-n-4 hover:text-purple-400' : 'text-gray-500 hover:text-purple-700'}
            >
              {showStoriesPanel ? '→' : '←'}
            </button>
          </div>
          
          <div className="space-y-4 max-h-[90%] overflow-y-auto">
            {userStories.length === 0 ? (
              <p className={`text-sm ${theme === 'dark' ? 'text-n-4' : 'text-gray-500'}`}>
                Draw on the map to start creating urban stories!
              </p>
            ) : (
              userStories.map((story) => (
                <div 
                  key={story.id} 
                  className={`p-3 rounded-lg border shadow-sm ${theme === 'dark' ? 'bg-n-7 border-n-6' : 'bg-purple-50 border-purple-200'}`}
                >
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-purple-400' : 'text-purple-900'}`}>{story.name}</h4>
                  <textarea
                    placeholder="What's your vision for this area?"
                    value={story.description}
                    onChange={(e) => {
                      const updatedStories = userStories.map(s => 
                        s.id === story.id ? {...s, description: e.target.value} : s
                      );
                      setUserStories(updatedStories);
                    }}
                    className={`w-full mt-2 p-2 text-sm border rounded focus:outline-none focus:ring-1 ${theme === 'dark' ? 'bg-n-7 border-n-6 text-n-2 focus:ring-purple-400' : 'bg-white border-gray-300 focus:ring-purple-600'}`}
                    rows={3}
                  />
                  <div className="flex justify-between mt-2">
                    <span className={`text-xs ${theme === 'dark' ? 'text-n-4' : 'text-gray-500'}`}>Created: {new Date().toLocaleDateString()}</span>
                    <button className={`text-xs ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-700 hover:text-purple-900'} transition-colors`}>
                      <Share2 size={14} className="inline mr-1" /> Share
                    </button>
                  </div>
                </div>
              ))
            )}
            
            <button className={`w-full py-2 rounded-lg transition-colors shadow-md ${theme === 'dark' ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'} text-white`}>
              <PlusCircle size={16} className="inline mr-1" /> Add New Vision
            </button>
          </div>
        </div>
        
        {/* Toggle for Stories Panel */}
        <button
          onClick={() => setShowStoriesPanel(!showStoriesPanel)}
          className={`absolute top-4 right-4 z-20 p-2 rounded-full shadow-md transition-all ${
            showStoriesPanel 
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
              : theme === 'dark' 
                ? 'bg-n-7 text-n-2 hover:bg-n-6' 
                : 'bg-white text-purple-700 hover:bg-gray-100'
          }`}
        >
          {showStoriesPanel ? '→' : '←'}
        </button>
      </div>
      
      {/* Community Tools */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={`p-4 rounded-xl shadow-sm ${theme === 'dark' ? 'bg-n-7 border border-n-6' : 'bg-white border border-n-4/30'}`}>
          <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>Community Challenges</h3>
          <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-n-4' : 'text-gray-600'}`}>Join this week's urban design challenge:</p>
          <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-n-6 border-n-5' : 'bg-purple-100 border-purple-200/50'}`}>
            <h4 className={`font-medium ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>Green Transit Corridors</h4>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-n-4' : 'text-gray-700'}`}>Design bike-friendly routes connecting neighborhoods</p>
            <button className={`mt-2 px-3 py-1 text-xs rounded-full transition-colors ${theme === 'dark' ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'} text-white`}>
              Join Challenge
            </button>
          </div>
        </div>
        
        <div className={`p-4 rounded-xl shadow-sm ${theme === 'dark' ? 'bg-n-7 border border-n-6' : 'bg-white border border-n-4/30'}`}>
          <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>Trending Designs</h3>
          <div className="space-y-2">
            <div className={`flex items-center justify-between px-2 py-1 rounded ${theme === 'dark' ? 'hover:bg-n-6' : 'hover:bg-purple-50'} transition-colors`}>
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-n-2' : 'text-gray-800'}`}>Urban Garden Network</span>
              <span className={`text-xs ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>128 likes</span>
            </div>
            <div className={`flex items-center justify-between px-2 py-1 rounded ${theme === 'dark' ? 'hover:bg-n-6' : 'hover:bg-purple-50'} transition-colors`}>
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-n-2' : 'text-gray-800'}`}>Pedestrian Friendly Market</span>
              <span className={`text-xs ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>97 likes</span>
            </div>
            <div className={`flex items-center justify-between px-2 py-1 rounded ${theme === 'dark' ? 'hover:bg-n-6' : 'hover:bg-purple-50'} transition-colors`}>
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-n-2' : 'text-gray-800'}`}>Riverside Amphitheater</span>
              <span className={`text-xs ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>84 likes</span>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-xl shadow-sm ${theme === 'dark' ? 'bg-n-7 border border-n-6' : 'bg-white border border-n-4/30'}`}>
          <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>Upcoming Events</h3>
          <div className="space-y-3">
            <div className={`px-2 py-1 rounded ${theme === 'dark' ? 'hover:bg-n-6' : 'hover:bg-purple-50'} transition-colors`}>
              <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-n-2' : 'text-gray-800'}`}>Urban Planning Workshop</h4>
              <p className={`text-xs ${theme === 'dark' ? 'text-n-4' : 'text-gray-600'}`}>Apr 15, 2025 • Downtown Community Center</p>
            </div>
            <div className={`px-2 py-1 rounded ${theme === 'dark' ? 'hover:bg-n-6' : 'hover:bg-purple-50'} transition-colors`}>
              <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-n-2' : 'text-gray-800'}`}>Public Space Design Contest</h4>
              <p className={`text-xs ${theme === 'dark' ? 'text-n-4' : 'text-gray-600'}`}>May 2, 2025 • Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Back button for mobile */}
      <div className="lg:hidden fixed bottom-4 left-4">
        <button
          onClick={() => window.history.back()}
          className={`p-3 rounded-full shadow-md border ${theme === 'dark' ? 'bg-n-7 border-n-6 text-n-2' : 'bg-white border-n-4/30 text-purple-700'}`}
        >
          <ChevronLeft size={20} />
        </button>
      </div>
    </div>
  );
};

export default MapBox;