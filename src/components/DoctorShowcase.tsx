import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";
import doctor3 from "@/assets/doctor-3.jpg";
import doctor4 from "@/assets/doctor-4.jpg";
import doctor5 from "@/assets/doctor-5.jpg";
import doctor6 from "@/assets/doctor-6.jpg";
import doctor7 from "@/assets/doctor-7.jpg";

// Moving degrees text component
function MovingDegrees() {
  const degrees = [
    "MD, PhD - Radiology",
    "MD - Neuroradiology Fellowship", 
    "MD, MS - Interventional Radiology",
    "MD - Musculoskeletal Imaging",
    "MD, PhD - Cardiac Imaging",
    "MD - Breast Imaging Fellowship",
    "MD - Thoracic Radiology",
    "MD - Pediatric Radiology",
    "MD, PhD - Nuclear Medicine",
    "MD - Emergency Radiology"
  ];

  return (
    <div className="relative overflow-hidden h-20 bg-gradient-to-r from-transparent via-muted/10 to-transparent mb-8">
      <div className="flex animate-scroll-degrees">
        {degrees.concat(degrees).map((degree, index) => (
          <div
            key={index}
            className="whitespace-nowrap px-12 py-6 text-lg font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-300 hover:scale-105"
          >
            {degree}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DoctorShowcase() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeMobileCardIndex, setActiveMobileCardIndex] = useState<number | null>(null);

  function triggerTemporaryLift(cardIndex: number) {
    setHoveredCard(cardIndex);
    window.setTimeout(() => setHoveredCard(null), 300);
  }

  const doctors = [
    { src: doctor1, name: "Dr. Smith" },
    { src: doctor2, name: "Dr. Johnson" },
    { src: doctor3, name: "Dr. Williams" },
    { src: doctor4, name: "Dr. Brown" },
    { src: doctor5, name: "Dr. Davis" },
    { src: doctor6, name: "Dr. Miller" },
    { src: doctor7, name: "Dr. Wilson" }
  ];

  return (
    <div className="relative">
      {/* Badges */}
      <div className="absolute -top-4 left-12 z-30">
        <Badge className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-xl">
          Best Match
        </Badge>
      </div>
      
      <div className="absolute -top-4 right-12 z-30">
        <Badge className="bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-xl">
          Available Now
        </Badge>
      </div>

      {/* 3D Doctor Cards (hidden on small screens) */}
      <div className="hidden sm:flex justify-center mb-16 px-4 perspective-1000">
        <div 
          className="relative flex gap-2 pointer-events-none" 
          style={{ 
            transformStyle: 'preserve-3d',
            transform: 'rotateY(-5deg)'
          }}
        >
          {doctors.map((doctor, index) => {
            const isCenter = index === 3;
            const rotation = (index - 3) * 12; // More pronounced rotation
            const zOffset = Math.abs(index - 3) * -30; // Deeper Z spacing
            const isHovered = hoveredCard === index;
            const baseScale = isCenter ? 1.1 : isHovered ? 1.05 : 0.95;
            const combinedScale = baseScale * (isHovered ? 1.12 : 1);
            
            return (
              <div
                key={index}
                className={`relative transition-transform duration-300 ease-out pointer-events-auto ${
                  isHovered ? 'z-40' : isCenter ? 'z-20' : 'z-10'
                }`}
                style={{
                  transform: `
                    rotateY(${rotation}deg) 
                    translateZ(${zOffset}px) 
                    scale(${combinedScale})
                    translateY(${isHovered ? '-18px' : '0px'})
                  `,
                  transformStyle: 'preserve-3d'
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onTouchStart={() => triggerTemporaryLift(index)}
                onClick={() => triggerTemporaryLift(index)}
              >
                <Card className="w-36 h-48 border-4 border-white shadow-2xl rounded-3xl overflow-hidden bg-white hover:shadow-3xl transition-shadow duration-300">
                  <div className="w-full h-full relative group">
                    <img
                      src={doctor.src}
                      alt={doctor.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile horizontal scroll list */}
      <div className="sm:hidden mb-12 px-4">
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
          {doctors.map((doctor, index) => (
            <Card
              key={index}
              className="min-w-[140px] h-48 border-0 shadow-md rounded-2xl overflow-hidden transition-transform duration-300"
              style={{
                transform: activeMobileCardIndex === index ? 'translateY(-14px) scale(1.05)' : 'translateY(0) scale(1)'
              }}
              onTouchStart={() => setActiveMobileCardIndex(index)}
              onTouchEnd={() => setActiveMobileCardIndex(null)}
              onMouseDown={() => setActiveMobileCardIndex(index)}
              onMouseUp={() => setActiveMobileCardIndex(null)}
              onMouseLeave={() => setActiveMobileCardIndex(null)}
            >
              <div className="w-full h-full relative">
                <img
                  src={doctor.src}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Moving Degrees */}
      <MovingDegrees />

      {/* Description */}
      <div className="text-center max-w-4xl mx-auto">
        <p className="text-lg text-muted-foreground leading-relaxed">
          EchoMed second opinion radiologists are board certified and fellowship trained 
          — so you can choose with confidence, knowing your case is in expert hands.
        </p>
      </div>
    </div>
  );
}