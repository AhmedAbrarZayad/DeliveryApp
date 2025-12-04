import React from 'react';
import Dashboard from '../Dashboard/Dashboard';
import Services from '../Services/Services';
import MapSection from '../MapSection/MapSection';

const Home = () => {
    return (
        <div>
            <Dashboard />
            <Services />
            <MapSection />
        </div>
    );
};

export default Home;