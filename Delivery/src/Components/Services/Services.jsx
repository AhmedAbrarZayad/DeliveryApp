import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import ServiceCard from '../ServiceCard/ServiceCard';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
const Services = () => {
    const { isDarkMode } = useOutletContext();
    const [services, setServices] = useState([]);
    useEffect(() => {
        fetch('./services.json').then(res => res.json()).then(data => setServices(data.services));
    }, []);
    return (
        <div className={`p-4 md:p-8 roboto-normal ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-white text-black'}`}>
            <button className={`p-3 md:p-4 border-2 roboto-bold text-sm md:text-base rounded-3xl ${isDarkMode ? 'bg-gray-800 border-blue-900' : 'bg-white border-black'}`}>Customer Centric Approach</button>
            <div className='flex flex-col md:flex-row justify-between gap-4'>
                <h1 className='text-2xl md:text-4xl mt-4 roboto-bold'>Experience Excellence</h1>
                <p className={`roboto-normal w-full md:w-[40%] text-sm md:text-base ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>We prioritize delivering top-notch services to our customers, making your satisfaction our top priority. Experience the difference with our dedicated team.</p>
            </div>
            <div className='mt-8 flex justify-center items-center'>
                {services.length > 0 && (
                    <Swiper
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        loop={true}
                        slidesPerView={3}
                        coverflowEffect={{
                            rotate: 50,
                            stretch: 0.75,
                            depth: 200,
                            modifier: 1.5,
                            slideShadows: true,
                        }}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        modules={[EffectCoverflow, Autoplay]}
                        className="mySwiper"
                    >
                        {
                            services.map((service, index) => (
                                <SwiperSlide key={index}>
                                    <ServiceCard
                                        image={service.image_url}
                                        title={service.name}
                                        description={service.description}
                                    />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                )}

            </div>
        </div>
    );
};

export default Services;