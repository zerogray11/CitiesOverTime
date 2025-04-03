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
import { PlusCircle, Layers, Save, Share2, PenTool, MapPin, Eye, EyeOff, Compass, Building } from 'lucide-react';
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
  { id: 'streets', name: 'Streets', light: 'mapbox://styles/mapbox/streets-v11', dark: 'mapbox://styles/mapbox/streets-v11' },
  { id: 'satellite', name: 'Satellite', light: 'mapbox://styles/mapbox/satellite-streets-v11', dark: 'mapbox://styles/mapbox/satellite-streets-v11' },
  { id: 'light', name: 'Light', light: 'mapbox://styles/mapbox/light-v10', dark: 'mapbox://styles/mapbox/light-v10' },
  { id: 'dark', name: 'Dark', light: 'mapbox://styles/mapbox/light-v10', dark: 'mapbox://styles/mapbox/light-v10' },
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
  
  const getMapStyleUrl = (style) => style.light;

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
    <div className={`flex flex-col items-center min-h-screen ${theme === 'dark' ? 'bg-n-8' : 'bg-gradient-to-b from-n-1 to-n-2'} transition-colors duration-300 p-4 md:p-6`}>
      {/* Header - Balanced and centered */}
      <div className="w-full max-w-6xl text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="hidden md:block h-[2px] flex-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          <div className="flex items-center mx-4 px-4">
            <Building className={`w-6 h-6 mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`} />
            <span className={`text-sm uppercase tracking-widest ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>
              Urban Explorer
            </span>
          </div>
          <div className="hidden md:block h-[2px] flex-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        </div>
        
        <h1 className={`text-3xl font-bold mb-3 ${theme === 'dark' ? 'text-n-1' : 'text-n-9'}`}>
          <span className="block mb-2 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500">
            Montreal Urban Canvas
          </span>
          <span className="relative inline-block text-lg">
            Design Your <span className="font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">Future City</span>
          </span>
        </h1>
        
        <p className={`text-sm ${theme === 'dark' ? 'text-n-4' : 'text-n-7'} flex items-center justify-center`}>
          <Compass className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`} />
          For urban planners and city dreamers
          <MapPin className={`w-4 h-4 ml-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`} />
        </p>
      </div>
      
      {/* Map Container - Perfectly proportioned */}
      <div className={`relative w-full max-w-6xl h-[70vh] rounded-2xl overflow-hidden shadow-xl ${theme === 'dark' ? 'border border-n-6' : 'border border-n-4/30'} mb-6`}>
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
          
          {/* Map Style Controls - Centered and elegant */}
          <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-20 ${theme === 'dark' ? 'bg-n-7/90' : 'bg-white/90'} px-3 py-1 rounded-full shadow-md flex gap-2 backdrop-blur-sm`}>
            {mapStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setCurrentMapStyle(style)}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  currentMapStyle.id === style.id 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-inner' 
                    : theme === 'dark' 
                      ? 'text-n-2 hover:bg-n-6/80' 
                      : 'text-gray-700 hover:bg-gray-200/80'
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
          
          {/* Drawing Tools - Symmetrical and balanced */}
          <div className={`absolute bottom-6 left-6 z-20 ${theme === 'dark' ? 'bg-n-7/90' : 'bg-white/90'} p-2 rounded-xl shadow-md flex items-center gap-2`}>
            <button
              onClick={() => setDrawingMode(!drawingMode)}
              className={`p-2 rounded-lg transition-all ${
                drawingMode 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md' 
                  : theme === 'dark' 
                    ? 'bg-n-6 text-n-2 hover:bg-n-5' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <PenTool size={18} />
            </button>
            
            <button
              onClick={() => setShowLayers(!showLayers)}
              className={`p-2 rounded-lg transition-all ${
                showLayers 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md' 
                  : theme === 'dark' 
                    ? 'bg-n-6 text-n-2 hover:bg-n-5' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Layers size={18} />
            </button>
            
            {drawingMode && (
              <button
                onClick={saveDrawing}
                disabled={currentDrawing.length === 0}
                className={`p-2 rounded-lg transition-all ${
                  currentDrawing.length > 0 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md' 
                    : theme === 'dark' 
                      ? 'bg-n-6 text-n-4 cursor-not-allowed' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Save size={18} />
              </button>
            )}
          </div>
          
          {/* Stories Panel Toggle - Perfectly positioned */}
          <button
            onClick={() => setShowStoriesPanel(!showStoriesPanel)}
            className={`absolute top-1/2 right-4 transform -translate-y-1/2 z-20 p-3 rounded-full shadow-md transition-all ${
              showStoriesPanel 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                : theme === 'dark' 
                  ? 'bg-n-7/90 text-n-2 hover:bg-n-6/90' 
                  : 'bg-white/90 text-purple-700 hover:bg-gray-100/90'
            }`}
          >
            {showStoriesPanel ? '→' : '←'}
          </button>

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
          
          {/* Popup - Refined proportions */}
          {selectedNeighborhood && (
            <Popup
              latitude={selectedNeighborhood.latitude}
              longitude={selectedNeighborhood.longitude}
              onClose={() => setSelectedNeighborhood(null)}
              closeButton={true}
              closeOnClick={false}
              className="z-30"
              maxWidth="300px"
              anchor="bottom"
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
        
        {/* Stories Panel - Refined proportions */}
        <div 
          className={`absolute right-0 top-0 bottom-0 ${theme === 'dark' ? 'bg-n-8/95 border-l border-n-6' : 'bg-white/95 border-l border-n-4/30'} w-80 z-30 p-5 transition-transform duration-300 shadow-2xl ${
            showStoriesPanel ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className={`flex justify-between items-center mb-5 pb-3 ${theme === 'dark' ? 'border-b border-n-6' : 'border-b border-n-4/30'}`}>
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>Urban Stories</h3>
            <button 
              onClick={() => setShowStoriesPanel(!showStoriesPanel)}
              className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-n-7' : 'hover:bg-gray-100'}`}
            >
              {showStoriesPanel ? '→' : '←'}
            </button>
          </div>
          
          <div className="space-y-4 h-[calc(100%-4rem)] overflow-y-auto pr-2">
            {userStories.length === 0 ? (
              <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-n-7' : 'bg-gray-50'}`}>
                <p className={`${theme === 'dark' ? 'text-n-4' : 'text-gray-500'}`}>
                  Draw on the map to start creating urban stories!
                </p>
              </div>
            ) : (
              userStories.map((story) => (
                <div 
                  key={story.id} 
                  className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-n-7' : 'bg-purple-50'} shadow-sm`}
                >
                  <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-900'}`}>{story.name}</h4>
                  <textarea
                    placeholder="What's your vision for this area?"
                    value={story.description}
                    onChange={(e) => {
                      const updatedStories = userStories.map(s => 
                        s.id === story.id ? {...s, description: e.target.value} : s
                      );
                      setUserStories(updatedStories);
                    }}
                    className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-n-8 border-n-6 text-n-2 focus:ring-purple-400' : 'bg-white border-gray-300 focus:ring-purple-600'} focus:outline-none focus:ring-1`}
                    rows={3}
                  />
                  <div className="flex justify-between mt-3 items-center">
                    <span className={`text-xs ${theme === 'dark' ? 'text-n-4' : 'text-gray-500'}`}>
                      {new Date().toLocaleDateString()}
                    </span>
                    <button className={`px-3 py-1 rounded-full text-xs ${theme === 'dark' ? 'bg-n-6 text-purple-400 hover:bg-n-5' : 'bg-white text-purple-700 hover:bg-gray-100'} transition-colors`}>
                      <Share2 size={14} className="inline mr-1" /> Share
                    </button>
                  </div>
                </div>
              ))
            )}
            
            <button className={`w-full py-3 rounded-xl transition-colors shadow-md ${theme === 'dark' ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'} text-white flex items-center justify-center`}>
              <PlusCircle size={18} className="mr-2" /> Add New Vision
            </button>
          </div>
        </div>
      </div>
      
      {/* Community Tools - Balanced grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-5 rounded-xl ${theme === 'dark' ? 'bg-n-7' : 'bg-white'} shadow-md`}>
          <h3 className={`text-lg font-bold mb-3 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>Community Challenges</h3>
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-n-6' : 'bg-purple-50'}`}>
            <h4 className={`font-medium mb-1 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>Green Transit Corridors</h4>
            <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-n-4' : 'text-gray-700'}`}>Design bike-friendly routes connecting neighborhoods</p>
            <button className={`w-full py-2 rounded-lg ${theme === 'dark' ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'} text-white text-sm`}>
              Join Challenge
            </button>
          </div>
        </div>
        
        <div className={`p-5 rounded-xl ${theme === 'dark' ? 'bg-n-7' : 'bg-white'} shadow-md`}>
          <h3 className={`text-lg font-bold mb-3 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>Trending Designs</h3>
          <div className="space-y-3">
            {['Urban Garden Network', 'Pedestrian Friendly Market', 'Riverside Amphitheater'].map((item, index) => (
              <div key={index} className={`p-3 rounded-lg ${theme === 'dark' ? 'hover:bg-n-6' : 'hover:bg-purple-50'} transition-colors flex justify-between items-center`}>
                <span className={`font-medium ${theme === 'dark' ? 'text-n-2' : 'text-gray-800'}`}>{item}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-n-5 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                  {[128, 97, 84][index]} likes
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`p-5 rounded-xl ${theme === 'dark' ? 'bg-n-7' : 'bg-white'} shadow-md`}>
          <h3 className={`text-lg font-bold mb-3 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>Upcoming Events</h3>
          <div className="space-y-4">
            {[
              { title: 'Urban Planning Workshop', date: 'Apr 15, 2025', location: 'Downtown Community Center' },
              { title: 'Public Space Design Contest', date: 'May 2, 2025', location: 'Online' }
            ].map((event, index) => (
              <div key={index} className={`p-3 rounded-lg ${theme === 'dark' ? 'hover:bg-n-6' : 'hover:bg-purple-50'} transition-colors`}>
                <h4 className={`font-medium ${theme === 'dark' ? 'text-n-2' : 'text-gray-800'}`}>{event.title}</h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-n-4' : 'text-gray-600'}`}>
                  {event.date} • {event.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapBox;