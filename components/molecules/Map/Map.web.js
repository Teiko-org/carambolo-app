/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet } from 'react-native';

// ── HTML do Leaflet (executado dentro do iframe) ──────────
const buildLeafletHTML = (initialRegion) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView(
      [${initialRegion.latitude}, ${initialRegion.longitude}],
      ${Math.round(14 - initialRegion.latitudeDelta * 10)}
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    window.addEventListener('message', function(event) {
      try {
        var msg = JSON.parse(event.data);
        
        if (msg.type === 'SET_MARKERS' && Array.isArray(msg.markers)) {
          map.eachLayer(function(layer) {
            if (layer instanceof L.Marker) map.removeLayer(layer);
          });

          var bounds = [];
          msg.markers.forEach(function(m) {
            if (m.latitude && m.longitude) {
              var statusColor = {
                'PENDENTE': '#f59e0b',
                'PAGO': '#3b82f6',
                'CONCLUIDO': '#10b981',
                'CANCELADO': '#ef4444',
              }[m.status] || '#A47032';

              var icon = L.divIcon({
                className: 'custom-marker',
                html: '<div style="background:' + statusColor + ';width:30px;height:30px;border-radius:50%;border:3px solid #103464;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.35);cursor:pointer;"><div style="width:10px;height:10px;background:#fff;border-radius:50%;"></div></div>',
                iconSize: [30, 30],
                iconAnchor: [15, 15],
                popupAnchor: [0, -18],
              });

              var popup = '<div style="font-family:system-ui,sans-serif;min-width:220px;padding:4px;">'
                + '<div style="font-weight:700;font-size:15px;color:#103464;margin-bottom:6px;">' + (m.nomeCliente || '') + '</div>'
                + '<div style="font-size:13px;color:#555;margin-bottom:3px;">' + String.fromCodePoint(0x1F4CD) + ' ' + (m.enderecoCompleto || '') + '</div>'
                + '<div style="font-size:13px;color:#555;margin-bottom:3px;">' + String.fromCodePoint(0x1F4DE) + ' ' + (m.telefoneCliente || '') + '</div>'
                + '<div style="display:flex;gap:8px;margin-top:6px;">'
                + '<span style="background:' + statusColor + ';color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;">' + (m.status || '') + '</span>'
                + '<span style="background:#103464;color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;">' + (m.tipoPedido || '') + '</span>'
                + '</div>'
                + (m.observacoes ? '<div style="font-size:12px;color:#777;margin-top:6px;font-style:italic;">' + String.fromCodePoint(0x1F4DD) + ' ' + m.observacoes + '</div>' : '')
                + '</div>';

              L.marker([m.latitude, m.longitude], { icon: icon })
                .bindPopup(popup, { maxWidth: 300 })
                .addTo(map);

              bounds.push([m.latitude, m.longitude]);
            }
          });

          if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
          }
        }
        
        if (msg.type === 'FOCUS_MARKER' && msg.latitude && msg.longitude) {
          map.setView([msg.latitude, msg.longitude], 16);
          map.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
              var latlng = layer.getLatLng();
              if (Math.abs(latlng.lat - msg.latitude) < 0.001 && Math.abs(latlng.lng - msg.longitude) < 0.001) {
                layer.openPopup();
              }
            }
          });
        }
      } catch(e) { console.error('Leaflet message error:', e); }
    });

    parent.postMessage(JSON.stringify({ type: 'MAP_READY' }), '*');
  </script>
</body>
</html>
`;

// ── MapView (Web) ─────────────────────────────────────────
const MapView = forwardRef(({ children, style, initialRegion, deliveries, provider, ...rest }, ref) => {
  const iframeRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // Expor a função focusMarker imperativamente via ref
  useImperativeHandle(ref, () => ({
    focusMarker: (latitude, longitude) => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ type: 'FOCUS_MARKER', latitude, longitude }),
          '*'
        );
      }
    }
  }));

  const region = initialRegion || {
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  // Ouvir MAP_READY do iframe
  useEffect(() => {
    const handler = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'MAP_READY') {
          setMapReady(true);
        }
      } catch (e) { /* ignorar */ }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Enviar marcadores ao iframe quando o mapa estiver pronto e os dados mudarem
  useEffect(() => {
    if (mapReady && deliveries && iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ type: 'SET_MARKERS', markers: deliveries }),
        '*'
      );
    }
  }, [mapReady, deliveries]);

  return (
    <View style={[webStyles.container, style]}>
      <iframe
        ref={iframeRef}
        srcDoc={buildLeafletHTML(region)}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: 20,
        }}
        title="Mapa de Entregas"
      />
    </View>
  );
});

MapView.displayName = 'MapView';

// ── Marker e Callout stubs (necessários para manter compatibilidade com o nativo) ──
const Marker = () => null;
const Callout = () => null;
const PROVIDER_GOOGLE = "google";

export { Marker, Callout, PROVIDER_GOOGLE };
export default MapView;

const webStyles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 20,
  },
});
