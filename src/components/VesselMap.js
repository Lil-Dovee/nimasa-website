"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "@/lib/constants";

function MapRefSetter({ onMapReady }) {
  const map = useMap();
  useEffect(() => {
    if (onMapReady) onMapReady(map);
  }, [map, onMapReady]);
  return null;
}

export default function VesselMap({
  vessels = [],
  ownVesselMmsi = null,
  threatMmsi = null,
  onVesselClick = null,
  onMapReady = null,
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
}) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapRefSetter onMapReady={onMapReady} />

      {vessels.map((v) => {
        const isOwn = v.mmsi === ownVesselMmsi;
        const isThreat = v.mmsi === threatMmsi;
        const color = isThreat
          ? "var(--color-vessel-threat)"
          : isOwn
          ? "var(--color-vessel-own)"
          : "var(--color-vessel-other)";

        return (
          <CircleMarker
            key={v.mmsi}
            center={[v.lat, v.lon]}
            radius={isOwn || isThreat ? 8 : 5}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.85,
              weight: 2,
            }}
            eventHandlers={{
              click: () => onVesselClick && onVesselClick(v),
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
              <div style={{ fontFamily: "monospace", fontSize: 11 }}>
                <strong>{v.name || v.mmsi}</strong>
                <br />
                {v.speed != null ? `${v.speed.toFixed(1)} kts` : ""}
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}