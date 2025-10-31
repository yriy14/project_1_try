import { Thermometer, Droplets, Wifi, WifiOff, Clock, Trash2 } from 'lucide-react';
import { Sensor } from '../lib/supabase';
import { getComfortStatus, formatTimeAgo } from '../utils/sensorUtils';

interface SensorCardProps {
  sensor: Sensor;
  onDelete: (id: string) => void; // Додаємо функцію видалення
}

export default function SensorCard({ sensor, onDelete }: SensorCardProps) {
  const comfortStatus = getComfortStatus(sensor.temperature, sensor.humidity);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200 relative">
      {/* Кнопка видалення */}
      <button
        onClick={() => onDelete(sensor.id)}
        className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
        title="Delete Sensor"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{sensor.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{sensor.location}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`${comfortStatus.bgColor} ${comfortStatus.color} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
            <span className="font-bold">{comfortStatus.icon}</span>
            {comfortStatus.label}
          </div>
          {sensor.is_active ? (
            <Wifi className="w-4 h-4 text-emerald-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-medium text-orange-900">Temperature</span>
          </div>
          <div className="text-3xl font-bold text-orange-900">
            {sensor.temperature}°<span className="text-lg font-normal text-orange-700">C</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-900">Humidity</span>
          </div>
          <div className="text-3xl font-bold text-blue-900">
            {sensor.humidity}<span className="text-lg font-normal text-blue-700">%</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
        <Clock className="w-3.5 h-3.5" />
        <span>Updated {formatTimeAgo(sensor.last_updated)}</span>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 font-mono">ID: {sensor.sensor_id}</p>
      </div>
    </div>
  );
}
