import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🎨 marker color by severity
const getMarkerIcon = (severity) => {
  let color = "green";

  if (severity === "CRITICAL") color = "red";
  else if (severity === "HIGH") color = "orange";
  else if (severity === "MEDIUM") color = "yellow";

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });
};

// 📍 map click handler
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    }
  });
  return null;
}

export default function MapView({ risks, onSelect }) {
  return (
    <div style={{ position: "relative" }}>
      <MapContainer center={[12.9, 77.6]} zoom={10} style={{ height: 400 }}>
        
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 📍 click anywhere */}
        <MapClickHandler onMapClick={onSelect} />

        {/* 📦 clustered markers */}
        <MarkerClusterGroup>
          {risks
            .filter(risk => risk.latitude && risk.longitude)
            .map(risk => (
              <Marker
                key={risk.id}
                position={[risk.latitude, risk.longitude]}
                icon={getMarkerIcon(risk.severity)}
                eventHandlers={{
                  click: () => onSelect(risk)
                }}
              >
                <Popup>
                  <b>{risk.description}</b> <br />
                  Severity: {risk.severity}
                </Popup>
              </Marker>
            ))}
        </MarkerClusterGroup>

      </MapContainer>

      {/* 🎨 legend */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          background: "#1e293b",
          padding: "10px",
          borderRadius: "8px",
          color: "white",
          fontSize: "12px"
        }}
      >
        🔴 Critical <br />
        🟠 High <br />
        🟡 Medium <br />
        🟢 Low
      </div>
    </div>
  );
}