import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useOutletContext } from 'react-router';

function FitToLocations({ locations }) {
    const map = useMap();

    useEffect(() => {
        if (locations.length === 0) return;

        const bounds = locations.map(loc => [loc.lat, loc.lng]);

        map.fitBounds(bounds, {
            padding: [80, 80],
            maxZoom: 10
        });
    }, [locations]);

    return null;
}
const MapSection = () => {
    const { isDarkMode } = useOutletContext();
    const position = [23.6850, 90.3563];
    const [locations, setLocations] = useState([]);
    const mapRef = useRef(null);
    const handleSearch = e => {
        e.preventDefault();
        const location = e.target.location.value;
        const district = locations.find(loc => loc.district.toLowerCase().includes(location.toLowerCase()));
        if (district) {
            const coord = [district.lat, district.lng];
            console.log(coord);
            mapRef.current.flyTo(coord, 12);
        }
    };
    useEffect(() => {
        fetch('./location.json')
            .then(response => response.json())
            .then(data => setLocations(data))
            .catch(error => console.error('Error fetching location data:', error));
    }, []);
    return (
        <div className={`p-4 md:p-8 roboto-normal text-center ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-white text-black'}`}>
            <h1 className='roboto-bold text-5xl'>Our Headquaters</h1>
            <div className={`sm:w-[80%] mx-auto mt-10 relative`}>
                <form onSubmit={handleSearch}>
                    <label className={`input absolute top-4 left-1/2 -translate-x-1/2 z-[1000] shadow-lg w-[90%] max-w-md flex items-center gap-2 px-4 py-2 rounded-full border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <svg className={`h-5 w-5 cursor-pointer shrink-0 ${isDarkMode ? 'stroke-white' : 'stroke-black'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input type="search" required placeholder="Search" className={`flex-1 bg-transparent border-none outline-none ${isDarkMode ? 'text-white' : 'text-black'}`} name="location" />
                    </label>
                </form>
                <MapContainer className='w-full h-[800px]' center={position} scrollWheelZoom={true} zoomControl={false} ref={mapRef}>
                    <ZoomControl position="bottomleft" />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        locations.map((location, index) => (
                            <Marker key={`${location.district}-${index}`} position={[location.lat, location.lng]}>
                                <Popup>
                                    District: {location.district} <br /> Division: {location.division}
                                </Popup>
                            </Marker>
                        ))
                    }
                    <FitToLocations locations={locations} />
                </MapContainer>
            </div>
        </div>
    );
};

export default MapSection;