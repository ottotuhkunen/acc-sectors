import React, { useState, useMemo } from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import firsJson from './firs.json';

import sectors2026 from './acc2026.geojson';
import sectors2027 from './acc2027.geojson';
import tma2026 from './tma2026.geojson';
import tma2027 from './tma2027_empty.geojson';

const mapboxToken = 'pk.eyJ1Ijoib3R0b3R1aGt1bmVuIiwiYSI6ImNtcTZmaW5qczAwdm8yc3M5a2trazluemsifQ.26_Ibhcm3a2nyUT4CLA4aQ';

const controllerList = [
  'A', 'B', 'C', 'D', 'E', 
  'F', 'G', 'H', 'J', 'K',
  'L', 'M', 'N', 'V'
];

export const sectorsOwnership = {
  sector1: ['A', 'D', 'C'],                         // SECT A
  sector2: ['B', 'C', 'D'],                         // SECT B
  sector3: ['C', 'D'],                              // SECT C
  sector4: ['D', 'C'],                              // SECT D
  sector5: ['E', 'F', 'D', 'C'],                    // SECT E
  sector6: ['F', 'D', 'C'],                         // SECT F
  sector7: ['G', 'F', 'D', 'C'],                    // SECT G
  sector8: ['H', 'V', 'M', 'G', 'F', 'D'],          // SECT H
  sector9: ['J', 'H', 'V', 'M', 'G', 'F', 'D'],     // SECT J
  sector10: ['K', 'M', 'A', 'G', 'F','D', 'C'],     // SECT K
  sector11: ['L', 'N', 'M', 'A', 'G', 'F', 'D', 'C'], // SECT L
  sector12: ['M', 'A', 'G', 'F', 'D', 'C'],         // SECT M
  sector13: ['N', 'M', 'A', 'G', 'F', 'D', 'C'],    // SECT N
  sector14: ['V', 'M', 'G', 'F', 'D', 'C']          // SECT V
};

// A sector not combined:
const oldSectorsOwnership = {
  sector1: ['A', 'D', 'C'],
  sector2: ['B', 'C', 'D'],
  sector3: ['C', 'D'],
  sector4: ['D', 'C'],
  sector5: ['E', 'F', 'D', 'C'],
  sector6: ['F', 'D', 'C'],
  sector7: ['G', 'F', 'D', 'C'],
  sector8: ['H', 'V', 'M', 'G', 'F', 'D'],
  sector9: ['J', 'H', 'V', 'M', 'G', 'F', 'D'],
  sector10: ['K', 'M', 'G', 'F', 'D', 'C'],
  sector11: ['L', 'N', 'M', 'G', 'F', 'D', 'C'],
  sector12: ['M', 'G', 'F', 'D', 'C'],
  sector13: ['N', 'M', 'G', 'F', 'D', 'C'],
  sector14: ['V', 'M', 'G', 'F', 'D', 'C']
};

const presets = [
    { name: 'D+F', controllers: ['D', 'F'] },
    { name: 'D+G', controllers: ['D', 'G'] },
    { name: 'D+M', controllers: ['D', 'M'] },
    { name: 'D+V', controllers: ['D', 'V'] },
    { name: 'D+F+V', controllers: ['D', 'F', 'V'] },
    { name: 'D+G+V', controllers: ['D', 'G', 'V'] },
    { name: 'D+M+V', controllers: ['D', 'M', 'V'] },
    { name: 'D+F+M', controllers: ['D', 'F', 'M'] },
    { name: 'D+F+M+V', controllers: ['D', 'F', 'M', 'V'] },
    { name: 'SANTA', controllers: ['D', 'A', 'V', 'J'] },
];

// Dark-themed colors for controllers
const controllerColors = {
  'A': '#FF006E',  // Bright blue
  'B': '#3A86FF',  // Vibrant pink
  'C': '#FFBE0B',  // Golden yellow
  'D': '#00BBF9',  // Sky blue
  'E': '#FB5607',  // Orange
  'F': '#38B000',  // Green
  'G': '#8338EC',  // Purple
  'H': '#9B5DE5',  // Light purple
  'J': '#F15BB5',  // Pink
  'K': '#FEE440',  // Lemon yellow
  'L': '#00F5D4',  // Teal
  'M': '#E36414',  // Rust orange
  'N': '#0A9396',  // Deep teal
  'V': '#9B2226'   // Deep red
};

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
  const [version, setVersion] = useState('2026');

  const sectorsGeoJson = version === '2026' ? sectors2026 : sectors2027;
  const tmaGeoJson = version === '2026' ? tma2026 : tma2027;

  const toggleController = (callsign) => {
      setSelectedPreset(null);
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

    const sectorColors = useMemo(() => {
        return Object.fromEntries(
            Object.keys(sectorsOwnership).map(sector => [
                sector,
                getSectorFillColor(sector)
            ])
        );
    }, [onlineControllers, version]);

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
          <button
              onClick={() => setVersion(v => (v === '2026' ? '2027' : '2026'))}
              style={{
                  margin: '3px',
                  padding: '4px',
                  width: '60px',
                  background: '#555555',
                  color: '#ffffff',
                  fontWeight: 'normal',
                  border: 'none',
                  cursor: 'pointer'
              }}
          >{version}
          </button>
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
        <Source type="geojson" data={tmaGeoJson}>
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
        <Source type="geojson" data={firsJson}>
          <Layer
            id="firs-lines"
            type="line"
            paint={{
              'line-color': '#006400',
              'line-width': 1.5
            }}
          />
        </Source>

        <Source type="geojson" data={sectorsGeoJson}>
          <Layer
            id="sectors-fill"
            type="fill"
            paint={{
              'fill-color': [
                'match',
                ['get', 'code'],
                  'sector1', sectorColors.sector1,
                  'sector2', sectorColors.sector2,
                  'sector3', sectorColors.sector3,
                  'sector4', sectorColors.sector4,
                  'sector5', sectorColors.sector5,
                  'sector6', sectorColors.sector6,
                  'sector7', sectorColors.sector7,
                  'sector8', sectorColors.sector8,
                  'sector9', sectorColors.sector9,
                  'sector10', sectorColors.sector10,
                  'sector11', sectorColors.sector11,
                  'sector12', sectorColors.sector12,
                  'sector13', sectorColors.sector13,
                  'sector14', sectorColors.sector14,
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
