import React, { useEffect, useReducer } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import "./styles.css";
import cafesData from "./data/cafes.json";

// Custom coffee icon
const coffeeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2910/2910765.png",
  iconSize: [35,35],
  iconAnchor: [17,35],
  popupAnchor: [0,-35]
});

// Fix default marker
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconUrl, shadowUrl: iconShadowUrl });

// Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLon = (lon2-lon1)*Math.PI/180;
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
            Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
            Math.sin(dLon/2)*Math.sin(dLon/2);
  const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R*c;
}

// Initial state
const initialState = {
  userLocation: null,
  cafes: cafesData,
  selectedCafeId: null,
  center: [18.5204,73.8567],
  zoom: 12,
  filterRadius: 5
};

// Reducer
function reducer(state, action){
  switch(action.type){
    case "SET_USER_LOCATION": return {...state, userLocation: action.payload, center:[action.payload.lat, action.payload.lng], zoom:15};
    case "SELECT_CAFE": return {...state, selectedCafeId: action.payload};
    case "SET_FILTER_RADIUS": return {...state, filterRadius: action.payload};
    default: return state;
  }
}

// Map panning
function MapPanner({selectedCafe}){
  const map = useMap();
  useEffect(()=>{
    if(selectedCafe) map.flyTo([selectedCafe.lat, selectedCafe.lng],16,{duration:0.7});
  }, [selectedCafe, map]);
  return null;
}

export default function App(){
  const [state, dispatch] = useReducer(reducer, initialState);
  const { userLocation, filterRadius } = state;
  const selectedCafe = state.cafes.find(c=>c.id===state.selectedCafeId);

  // Get user location
  useEffect(()=>{
    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition(
        pos => dispatch({type:"SET_USER_LOCATION", payload:{lat:pos.coords.latitude, lng:pos.coords.longitude}}),
        err => console.warn("Location error:", err.message)
      );
    }
  }, []);

  // Add distance info
  const cafesWithDistance = state.cafes.map(cafe => ({
    ...cafe,
    distance: userLocation ? getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, cafe.lat, cafe.lng) : null
  }));

  const filteredCafes = userLocation ? cafesWithDistance.filter(cafe => cafe.distance <= filterRadius) : cafesWithDistance;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Nearby Cafes</h2>
        <div className="filter-slider">
          <label>
            Show cafes within {filterRadius} km
            <input type="range" min="1" max="50" value={filterRadius} onChange={e=>dispatch({type:"SET_FILTER_RADIUS", payload:+e.target.value})}/>
          </label>
        </div>
        <ul>
          {filteredCafes.length===0 && <p>No cafes nearby ☹️</p>}
          {filteredCafes.map(cafe=>(
            <li key={cafe.id} className={`cafe-item ${state.selectedCafeId===cafe.id ? "selected":""}`} onClick={()=>dispatch({type:"SELECT_CAFE", payload:cafe.id})}>
              <div className="cafe-name">{cafe.name}</div>
              <div className="cafe-address">{cafe.address}</div>
              {cafe.distance!==null && <span className="cafe-distance">📍 {cafe.distance.toFixed(1)} km</span>}
            </li>
          ))}
        </ul>
      </aside>

      {/* Map */}
      <main className="map-container">
        <MapContainer center={state.center} zoom={state.zoom} style={{height:"100%", width:"100%"}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors"/>
          
          {userLocation && <>
            <Circle center={[userLocation.lat,userLocation.lng]} radius={filterRadius*1000} pathOptions={{color:'rgba(0,150,255,0.7)', fillColor:'rgba(0,200,255,0.2)', fillOpacity:0.3}}/>
            <CircleMarker center={[userLocation.lat,userLocation.lng]} radius={8}><Popup>You are here</Popup></CircleMarker>
          </>}

          {cafesWithDistance.map(cafe=>(
            <Marker key={cafe.id} position={[cafe.lat,cafe.lng]} icon={cafe.distance!==null && cafe.distance<=filterRadius ? coffeeIcon : new L.Icon.Default()} eventHandlers={{click:()=>dispatch({type:"SELECT_CAFE", payload:cafe.id})}}>
              <Popup>
                <b>{cafe.name}</b> <br />
                {cafe.address} <br />
                {cafe.distance!==null && <span>Distance: {cafe.distance.toFixed(1)} km</span>}
              </Popup>
            </Marker>
          ))}

          {selectedCafe && <MapPanner selectedCafe={selectedCafe}/>}
        </MapContainer>
      </main>
    </div>
  );
}
