import React from 'react';

const ServiceCard = ({ image, title, description }) => {
    return (
        <div className="h-full">
            <div className="hover-3d h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] flex flex-col">
                {/* content */}
                <figure className="rounded-2xl h-full w-full m-0 relative overflow-hidden">
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                    {/* Overlay with gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
                    {/* Text content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 text-white">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 roboto-bold">
                            {title}
                        </h3>
                        <p className="text-sm sm:text-base md:text-lg text-gray-200 roboto-normal line-clamp-2">
                            {description}
                        </p>
                    </div>
                </figure>
                {/* 8 empty divs needed for the 3D effect */}
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default ServiceCard;