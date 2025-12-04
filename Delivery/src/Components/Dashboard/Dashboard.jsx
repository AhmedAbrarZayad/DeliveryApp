import React, { useState } from 'react';
import BgDark from '../../assets/Dashboard dark.webp';
import NavBar from '../NavBar/NavBar';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useOutletContext } from 'react-router';
import BgLight from '../../assets/Dashboard light.webp';
import { MdAirplanemodeActive } from "react-icons/md";
import { AiOutlineDeliveredProcedure } from "react-icons/ai";
import { AiFillCalendar } from "react-icons/ai";
import Divider from '@mui/material/Divider';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const BarChartExample = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pv" fill="#8884d8" />
        <Bar dataKey="uv" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const StatsCard = ({isDarkMode, width, height, children}) => {
    return (
        <Box
        sx={{
            display: 'flex',
            flexWrap: 'wrap',
            '& > :not(style)': {
            width: width,
            height: height,
            },
            '& h1, & h2, & h3, & h4, & h5, & h6, & p, & span, & div': {
                color: isDarkMode ? 'white' : 'black'
            }
        }}
        >
            {children}
        </Box>
    )
}
const Dashboard = () => {
    const { isDarkMode, toggleTheme } = useOutletContext();
    const [data, setData] = useState([
    { name: 'Jan', uv: 1200 },
    { name: 'Feb', uv: 3400 },
    { name: 'Mar', uv: 2100 },
    { name: 'Apr', uv: 4200 },
    { name: 'May', uv: 1800 },
    { name: 'Jun', uv: 4600 },
    ]);

    const [barChartData, setBarChartData] = useState([
    { name: 'Mon', uv: 4000, pv: 2400 },
    { name: 'Tue', uv: 3200, pv: 1800 },
    { name: 'Wed', uv: 4500, pv: 2200 },
    { name: 'Thu', uv: 3000, pv: 3900 },
    ]);

    return (
        <div style={{
            backgroundImage: `url(${isDarkMode ? BgDark : BgLight})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            color: isDarkMode ? 'white' : 'black'
        }} className='relative pb-8'>
            <NavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <div className='flex flex-col lg:flex-row justify-between gap-6 lg:gap-0 px-4 lg:px-0'>
                <div className='w-full lg:w-auto flex flex-col'>
                    <StatsCard isDarkMode={isDarkMode} width={{ xs: '100%', sm: 300 }} height={180}>
                        <Paper elevation={3} className={`border ${isDarkMode ? 'border-blue-900/50' : 'border-gray-300'} mt-10 lg:ml-3`} sx={{ 
                            borderRadius: '16px',
                            background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            overflow: 'hidden'
                        }}>
                            <div className='p-4'>
                                <h3 className='text-sm opacity-70 mb-1'>Total Orders</h3>
                                <h2 className='text-3xl roboto-bold'>1,500</h2>
                            </div>
                            <div style={{ width: '100%', height: 100, minHeight: 100, marginTop: '-5px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data}>
                                        <Line 
                                            type="monotone" 
                                            dataKey="uv" 
                                            stroke={isDarkMode ? '#60a5fa' : '#000000'} 
                                            strokeWidth={2.5}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Paper>
                    </StatsCard>
                    <div className='grow lg:grow-0'></div>
                    <div className='flex items-center mt-10 lg:ml-3'>
                        <div className='bg-blue-700 w-10 h-10 flex items-center justify-center rounded-2xl'>
                            <MdAirplanemodeActive />
                        </div>
                        <div className='ml-2'>
                            <h1 className='roboto-bold'>On the Way</h1>
                            <h2>150+</h2>
                        </div>
                    </div>
                    <div className='flex items-center mt-10 lg:ml-3'>
                        <div className='bg-green-700 w-10 h-10 flex items-center justify-center rounded-2xl'>
                            <AiOutlineDeliveredProcedure />
                        </div>
                        <div className='ml-2'>
                            <h1 className='roboto-bold'>Delivery done</h1>
                            <h2>150+</h2>
                        </div>
                    </div>
                    <div className='flex items-center mt-10 lg:ml-3'>
                        <div className='bg-red-700 w-10 h-10 flex items-center justify-center rounded-2xl'>
                            <AiFillCalendar />
                        </div>
                        <div className='ml-2'>
                            <h1 className='roboto-bold'>Waiting</h1>
                            <h2>150+</h2>
                        </div>
                    </div>
                    <div className={`mt-10 lg:ml-3 backdrop-blur-sm p-5 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-blue-900 border-2' : 'bg-white/80 border-black border-2'}`} style={{ width: '100%', maxWidth: '300px' }}>
                        <h1 className='roboto-bold text-2xl mb-5'>Parcels</h1>
                        <div className='mb-4'>
                            <h2 className='text-sm opacity-70 mb-1'>Monthly</h2>
                            <h2 className='text-3xl roboto-bold mb-1'>32,540</h2>
                            <p className='text-xs opacity-60'>+51% from last month</p>
                        </div>
                        <Divider sx={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', my: 2 }}/>
                        <div>
                            <h2 className='text-sm opacity-70 mb-1'>Yearly</h2>
                            <h2 className='text-3xl roboto-bold mb-1'>1,387,456</h2>
                            <p className='text-xs opacity-60'>+12% from last year</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;