import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import firsJson from './assets/firs.json';
import sectors2026 from './airspaces/acc2026.json';
import sectors2027 from './airspaces/acc2027.json';
import tma2026 from './airspaces/tma2026.json';
import tma2027 from './airspaces/tma2027_empty.json';

mapboxgl.accessToken =
    'pk.eyJ1Ijoib3R0b3R1aGt1bmVuIiwiYSI6ImNtcTZmaW5qczAwdm8yc3M5a2trazluemsifQ.26_Ibhcm3a2nyUT4CLA4aQ';

const controllerList = [
  'A','B','C','D','E',
  'F','G','H','J','K',
  'L','M','N','V'
];

const sectorsOwnership = {
  sector1: ['A','D','C'],
  sector2: ['B','C','D'],
  sector3: ['C','D'],
  sector4: ['D','C'],
  sector5: ['E','F','D','C'],
  sector6: ['F','D','C'],
  sector7: ['G','F','D','C'],
  sector8: ['H','V','M','G','F','D'],
  sector9: ['J','H','V','M','G','F','D'],
  sector10: ['K','M','A','G','F','D','C'],
  sector11: ['L','N','M','A','G','F','D','C'],
  sector12: ['M','A','G','F','D','C'],
  sector13: ['N','M','A','G','F','D','C'],
  sector14: ['V','M','G','F','D','C']
};

const presets = [
  { name: 'D+F', controllers: ['D','F'] },
  { name: 'D+G', controllers: ['D','G'] },
  { name: 'D+M', controllers: ['D','M'] },
  { name: 'D+V', controllers: ['D','V'] },
  { name: 'D+F+V', controllers: ['D','F','V'] },
  { name: 'D+G+V', controllers: ['D','G','V'] },
  { name: 'D+M+V', controllers: ['D','M','V'] },
  { name: 'D+F+M', controllers: ['D','F','M'] },
  { name: 'D+F+M+V', controllers: ['D','F','M','V'] },
  { name: 'SANTA', controllers: ['D','A','V','J'] }
];

const controllerColors = {
  A:'#FF006E', B:'#3A86FF', C:'#FFBE0B', D:'#00BBF9',
  E:'#FB5607', F:'#38B000', G:'#8338EC', H:'#9B5DE5',
  J:'#F15BB5', K:'#FEE440', L:'#00F5D4', M:'#E36414',
  N:'#0A9396', V:'#9B2226'
};

const getOwner = (sectorCode, online) => {
  const list = sectorsOwnership[sectorCode] || [];
  return list.find(c => online.includes(c)) || null;
};

export default function App() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  const [onlineControllers, setOnlineControllers] = useState(['']);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [version, setVersion] = useState('2026');

  const sectorsGeoJson = version === '2026' ? sectors2026 : sectors2027;
  const tmaGeoJson = version === '2026' ? tma2026 : tma2027;

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateSources = () => {
      const sectors = map.getSource('sectors');
      const tma = map.getSource('tma');

      if (sectors) {
        sectors.setData(
            version === '2026' ? sectors2026 : sectors2027
        );
      }

      if (tma) {
        tma.setData(
            version === '2026' ? tma2026 : tma2027
        );
      }
    };

    if (map.isStyleLoaded()) {
      updateSources();
    } else {
      map.once('load', updateSources);
    }
  }, [version]);

  // ---------------- INIT MAP ----------------
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/ottotuhkunen/cm8g2jfyj00yv01sa0tvx4vof',
      center: [25, 65],
      zoom: 4
    });

    const map = mapRef.current;

    map.on('load', () => {
      map.addSource('tma', { type: 'geojson', data: tmaGeoJson });
      map.addSource('firs', { type: 'geojson', data: firsJson });
      map.addSource('sectors', { type: 'geojson', data: sectorsGeoJson });

      map.addLayer({
        id: 'tma-lines',
        type: 'line',
        source: 'tma',
        paint: {
          'line-color': '#aaa',
          'line-width': 1
        }
      });

      map.addLayer({
        id: 'firs-lines',
        type: 'line',
        source: 'firs',
        paint: {
          'line-color': '#006400',
          'line-width': 1
        }
      });

      map.addLayer({
        id: 'sectors-fill',
        type: 'fill',
        source: 'sectors',
        paint: {
          'fill-color': '#ffffff',
          'fill-opacity': 0.3
        }
      });

      map.addLayer({
        id: 'sectors-lines',
        type: 'line',
        source: 'sectors',
        paint: {
          'line-color': '#006400',
          'line-width': 0.6
        }
      });
    });

    return () => map.remove();
  }, []);

  // ---------------- UPDATE COLORS ----------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const colors = Object.fromEntries(
        Object.keys(sectorsOwnership).map(sector => {
          const owner = getOwner(sector, onlineControllers);
          return [
            sector,
            owner ? controllerColors[owner] : '#ffffff'
          ];
        })
    );

    if (!map.getLayer('sectors-fill')) return;

    map.setPaintProperty('sectors-fill', 'fill-color', [
      'match',
      ['get', 'code'],
      'sector1', colors.sector1,
      'sector2', colors.sector2,
      'sector3', colors.sector3,
      'sector4', colors.sector4,
      'sector5', colors.sector5,
      'sector6', colors.sector6,
      'sector7', colors.sector7,
      'sector8', colors.sector8,
      'sector9', colors.sector9,
      'sector10', colors.sector10,
      'sector11', colors.sector11,
      'sector12', colors.sector12,
      'sector13', colors.sector13,
      'sector14', colors.sector14,
      '#ffffff'
    ]);
  }, [onlineControllers, version]);

  // ---------------- UI LOGIC ----------------
  const toggle = (c) => {
    setSelectedPreset(null);
    setOnlineControllers(prev =>
        prev.includes(c)
            ? prev.filter(x => x !== c)
            : [...prev, c]
    );
  };

  const applyPreset = (list, name) => {
    setOnlineControllers(list);
    setSelectedPreset(name);
  };

  return (
      <div style={{
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        backgroundColor: '#1e1e1e',
        color: '#ffffff'
      }}>

        {/* TOP BAR (UNCHANGED STYLE) */}
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
          >
            {version}
          </button>

          {controllerList.map(c => (
              <button
                  key={c}
                  style={{
                    margin: '3px',
                    padding: '4px',
                    width: '40px',
                    background: onlineControllers.includes(c)
                        ? controllerColors[c]
                        : '#555555',
                    color: onlineControllers.includes(c)
                        ? '#000000'
                        : '#ffffff',
                    fontWeight: onlineControllers.includes(c)
                        ? 'bold'
                        : 'normal',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggle(c)}
              >
                {c}
              </button>
          ))}
        </div>

        {/* MAP (UNCHANGED STRUCTURE) */}
        <div
            ref={mapContainer}
            style={{ width: '100%', height: '100%', zIndex: 0 }}
        />

        {/* BOTTOM BAR (UNCHANGED STYLE) */}
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
}