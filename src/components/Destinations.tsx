import React from 'react';
import { 
  MapPin, 
  Plus, 
  Phone, 
  Mail, 
  PoundSterling,
  AlertTriangle,
  Wrench
} from 'lucide-react';
import { Location } from '../types';

const Destinations: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Destinations</h1>
          <p className="text-gray-600">Manage venues and locations for your activities</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Destination</span>
        </button>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {locations.map(location => (
          <DestinationCard key={location.id} location={location} />
        ))}
      </div>
    </div>
  );
};

interface LocationCardProps {
  location: Location;
}

const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{location.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig[location.type].color}`}>
            {typeConfig[location.type].emoji} {location.type}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">£{destination.costPerSession}</div>
          <div className="text-sm text-gray-600">per session</div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-2 mb-4">
        <div className="flex items-start text-gray-600">
          <MapPin className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{destination.address}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Phone className="w-4 h-4 mr-3" />
          <div>
            <div className="text-sm font-medium">{destination.contactName}</div>
            <div className="text-sm">{destination.contactPhone}</div>
          </div>
        </div>
        <div className="flex items-center text-gray-600">
          <Mail className="w-4 h-4 mr-3" />
          <span className="text-sm">{destination.contactEmail}</span>
        </div>
      </div>

      {/* Facilities */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-800 mb-2 flex items-center">
          <Wrench className="w-4 h-4 mr-2" />
          Facilities
        </h4>
        <div className="flex flex-wrap gap-2">
          {destination.facilities.map((facility, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
            >
              {facility}
            </span>
          ))}
        </div>
      </div>

      {/* Equipment */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-800 mb-2">Available Equipment</h4>
        <div className="flex flex-wrap gap-2">
          {destination.equipment.map((item, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Safety Notes */}
      {destination.safetyNotes && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="w-4 h-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-amber-800 mb-1">Safety Notes</div>
              <div className="text-sm text-amber-700">{destination.safetyNotes}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Destinations;