import { useState } from 'react';
import Map from 'react-map-gl/mapbox';
import { Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

import {
    controllerList,
    sectorsOwnership,
    controllerColors,
    presets
} from './mapConfig';

const mapboxToken = 'pk.eyJ1Ijoib3R0b3R1aGt1bmVuIiwiYSI6ImNtcTZmaW5qczAwdm8yc3M5a2trazluemsifQ.26_Ibhcm3a2nyUT4CLA4aQ';

// Determine which controller owns the sector
const getSectorOwner = (sectorCode, onlineControllers) => {
  const sectorControllers = sectorsOwnership[sectorCode];
  for (let controller of sectorControllers) {
    const callsign = `${controller}`;
    if (onlineControllers.includes(callsign)) {
      return callsign;
    }
  }
  return null;
};

const App = () => {
  const [onlineControllers, setOnlineControllers] = useState(['D']);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const toggleController = (callsign) => {
    setSelectedPreset();
    setOnlineControllers(prev =>
        prev.includes(callsign)
            ? prev.filter(c => c !== callsign)
            : [...prev, callsign]
    );
  };

  const applyPreset = (presetControllers, presetName) => {
    setOnlineControllers(presetControllers);
    setSelectedPreset(presetName);
  };

  // Determine the color for each sector based on the controller
  const getSectorFillColor = (sectorCode) => {
    const owner = getSectorOwner(sectorCode, onlineControllers);
    return owner ? controllerColors[owner] : 'transparent';
  };

  return (
      <div style={{ height: '100vh', width: '100vw', position: 'fixed', backgroundColor: '#1e1e1e', color: '#ffffff' }}>
        {/* Controller buttons */}
        <div style={{
          padding: '0px 2px',
          display: 'flex',
          flexWrap: 'wrap',
          background: 'gray',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {controllerList.map((controller) => (
              <button
                  key={controller}
                  style={{
                    margin: '3px',
                    padding: '4px',
                    width: '40px',
                    background: onlineControllers.includes(controller) ? controllerColors[controller] : '#555555',
                    color: onlineControllers.includes(controller) ? '#000000' : '#ffffff',
                    fontWeight: onlineControllers.includes(controller) ? 'bold' : 'normal',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleController(controller)}
              >
                {controller}
              </button>
          ))}
        </div>


        {/* Map and sectors */}
        <Map
            initialViewState={{
              longitude: 25,
              latitude: 65,
              zoom: 4
            }}
            style={{ width: '100%', height: '100%', zIndex: '0' }}
            mapStyle="mapbox://styles/ottotuhkunen/cm8g2jfyj00yv01sa0tvx4vof"
            mapboxAccessToken={mapboxToken}
        >
          {/* TMA geojson */}
          <Source type="geojson" data="/tma2.geojson">
            <Layer
                id="tma-lines"
                type="line"
                paint={{
                  'line-color': '#aaa',
                  'line-width': 1,
                }}
            />
            <Layer
                id="tma-labels"
                type="symbol"
                layout={{
                  'text-field': ['get', 'name'],
                  'text-font': ['Open Sans Bold'],
                  'text-size': 8,
                }}
                paint={{
                  'text-color': 'darkblue',
                  'text-halo-color': 'white',
                  'text-halo-width': 1
                }}
                minzoom={5}
            />

          </Source>

          {/* FIRs geojson */}
          <Source type="geojson" data="/firs.json">
            <Layer
                id="firs-lines"
                type="line"
                paint={{
                  'line-color': '#006400',
                  'line-width': 1.5
                }}
            />
          </Source>

          <Source type="geojson" data="/sectors.geojson">
            <Layer
                id="sectors-fill"
                type="fill"
                paint={{
                  'fill-color': [
                    'match',
                    ['get', 'code'],
                    'sector1', getSectorFillColor('sector1'),
                    'sector2', getSectorFillColor('sector2'),
                    'sector3', getSectorFillColor('sector3'),
                    'sector4', getSectorFillColor('sector4'),
                    'sector5', getSectorFillColor('sector5'),
                    'sector6', getSectorFillColor('sector6'),
                    'sector7', getSectorFillColor('sector7'),
                    'sector8', getSectorFillColor('sector8'),
                    'sector9', getSectorFillColor('sector9'),
                    'sector10', getSectorFillColor('sector10'),
                    'sector11', getSectorFillColor('sector11'),
                    'sector12', getSectorFillColor('sector12'),
                    'sector13', getSectorFillColor('sector13'),
                    'sector14', getSectorFillColor('sector14'),
                    'rgb(50, 50, 50)' // Default color (dark gray)
                  ],
                  'fill-opacity': 0.3
                }}
            />
            <Layer
                id="sectors-border"
                type="line"
                paint={{
                  'line-color': 'gray',
                  'line-width': 1.5
                }}
            />
            <Layer
                id="acc-labels"
                type="symbol"
                layout={{
                  'text-field': ['get', 'name'],
                  'text-font': ['Open Sans Bold'],
                  'text-size': 9,
                }}
                paint={{
                  'text-color': 'black',
                  'text-halo-color': 'white',
                  'text-halo-width': 0.4
                }}
                minzoom={3}
            />
          </Source>

        </Map>

        {/* Preset buttons */}
        <div style={{
          padding: '0px 2px',
          display: 'flex',
          flexWrap: 'wrap',
          background: 'gray',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          width: '100%',
          bottom: '0',
        }}>
          {presets.map((preset, index) => (
              <button
                  key={index}
                  style={{
                    margin: '3px',
                    padding: '8px',
                    background: selectedPreset === preset.name ? '#1a475f' : '#555555',
                    color: '#ffffff',
                    fontWeight: 'normal',
                    border: 'none',
                    cursor: 'pointer',
                    letterSpacing: '2px'
                  }}
                  onClick={() => applyPreset(preset.controllers, preset.name)}
              >
                {preset.name}
              </button>
          ))}
        </div>

      </div>
  );
};

export default App;
