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
            className="whitespace-nowrap px-12 py-6 text-base font-medium text-muted-foreground hover:text-primary transition-colors"
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

      {/* 3D Doctor Cards */}
      <div className="flex justify-center mb-16 px-4 perspective-1000">
        <div 
          className="relative flex gap-2" 
          style={{ 
            transformStyle: 'preserve-3d',
            transform: 'rotateY(-5deg)'
          }}
        >
          {doctors.map((doctor, index) => {
            const isCenter = index === 3;
            const rotation = (index - 3) * 12; // More pronounced rotation
            const zOffset = Math.abs(index - 3) * -30; // Deeper Z spacing
            const scale = isCenter ? 1.1 : hoveredCard === index ? 1.05 : 0.95;
            
            return (
              <div
                key={index}
                className={`relative transition-all duration-500 ease-out ${
                  isCenter ? 'z-20' : hoveredCard === index ? 'z-30' : 'z-10'
                }`}
                style={{
                  transform: `
                    rotateY(${rotation}deg) 
                    translateZ(${zOffset}px) 
                    scale(${scale})
                    ${hoveredCard === index ? 'translateY(-10px)' : ''}
                  `,
                  transformStyle: 'preserve-3d'
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
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