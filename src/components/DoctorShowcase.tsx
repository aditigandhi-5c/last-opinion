import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const DoctorShowcase = () => {
  const [clickedCard, setClickedCard] = useState<number | null>(null);

  const doctors = [
    {
      id: 1,
      specialization: "MD, DM - Gastroenterology",
      image: "/1.png"
    },
    {
      id: 2,
      specialization: "MD, MS - General Surgery",
      image: "/2.png"
    },
    {
      id: 3,
      specialization: "MD, DM - Cardiology",
      image: "/3.png"
    },
    {
      id: 4,
      specialization: "MD, MS - Neurology",
      image: "/4.png"
    },
    {
      id: 5,
      specialization: "MD, DNB - Radiology",
      image: "/5.png"
    },
    {
      id: 6,
      specialization: "MD, DM - Endocrinology",
      image: "/6.png"
    },
    {
      id: 7,
      specialization: "MD, MS - Orthopedics",
      image: "/7.png"
    }
  ];

  const handleCardClick = (doctorId: number) => {
    setClickedCard(clickedCard === doctorId ? null : doctorId);
  };

  return (
    <div className="relative max-w-6xl mx-auto px-8">
      {/* Best Match Button - Left */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 z-10 hidden lg:block">
        <div className="bg-green-600 rounded-lg px-4 py-2 text-white font-semibold text-sm shadow-lg">
          Best Match
        </div>
      </div>

      {/* Doctor Cards - Static Display with Central Focus */}
      <div className="flex justify-center items-center -space-x-8">
        {doctors.map((doctor, index) => {
          // 4th doctor (index 3) is largest, with gradual scaling
          let scale;
          if (index === 3) scale = 1.0; // 4th - largest
          else if (index === 2 || index === 4) scale = 0.9; // 3rd and 5th - medium
          else if (index === 1 || index === 5) scale = 0.8; // 2nd and 6th - small
          else scale = 0.7; // 1st and 7th - smallest
          
          const isClicked = clickedCard === doctor.id;
          const isFourth = index === 3; // 4th card should be in front
          
          return (
            <div 
              key={doctor.id} 
              className="flex-shrink-0"
              style={{ 
                transform: `scale(${scale}) ${isClicked ? 'translateY(-15px)' : ''}`,
                transition: 'all 0.3s ease-in-out',
                zIndex: isClicked ? 20 : (isFourth ? 5 : 1)
              }}
            >
              <Card 
                className={`w-48 h-64 shadow-lg transition-all duration-300 cursor-pointer rounded-lg border-0 ${
                  isClicked ? 'shadow-2xl scale-105' : 'hover:shadow-xl'
                }`}
                onClick={() => handleCardClick(doctor.id)}
              >
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={doctor.image} 
                      alt={doctor.specialization}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <p className="text-xs text-gray-600 text-center leading-tight font-medium">
                    {doctor.specialization}
                  </p>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Available Now Button - Right */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 z-10 hidden lg:block">
        <div className="bg-gray-500 rounded-lg px-4 py-2 text-white font-semibold text-sm shadow-lg">
          Available Now
        </div>
      </div>

      {/* Descriptive Text */}
      <div className="text-center max-w-4xl mx-auto mt-12">
        <p className="text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
          Last Opinion last opinion radiologists are board certified and fellowship trained
        </p>
        <p className="text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
          — so you can choose with confidence, knowing your case is in expert hands.
        </p>
      </div>
    </div>
  );
};

export default DoctorShowcase;