import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Users, Clock } from 'lucide-react';

const DoctorShowcase = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-white">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Board Certified</h3>
          <p className="text-gray-600 mb-4">
            All our radiologists are board-certified with specialized training in medical imaging
          </p>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Verified Expertise
          </Badge>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Network</h3>
          <p className="text-gray-600 mb-4">
            Access to India's largest network of subspecialty radiologists
          </p>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            500+ Specialists
          </Badge>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-white md:col-span-2 lg:col-span-1">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Turnaround</h3>
          <p className="text-gray-600 mb-4">
            Get your expert second opinion within 24-48 hours
          </p>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Quick Results
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorShowcase;
