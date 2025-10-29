import { Wind, Leaf, Thermometer, Flame, CheckCircle, Lightbulb } from 'lucide-react';
import { Sensor } from '../lib/supabase';
import { getRecommendations } from '../utils/sensorUtils';

interface RecommendationPanelProps {
  sensors: Sensor[];
}

const iconMap = {
  wind: Wind,
  leaf: Leaf,
  thermometer: Thermometer,
  flame: Flame,
  'check-circle': CheckCircle,
};

export default function RecommendationPanel({ sensors }: RecommendationPanelProps) {
  const allRecommendations = sensors.flatMap((sensor) => {
    const recs = getRecommendations(sensor.temperature, sensor.humidity);
    return recs.map((rec) => ({
      ...rec,
      sensorName: sensor.name,
      location: sensor.location,
    }));
  });

  const uniqueRecommendations = allRecommendations.filter(
    (rec, index, self) =>
      index === self.findIndex((r) => r.message === rec.message && r.location === rec.location)
  );

  if (uniqueRecommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-sm border border-blue-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
          <Lightbulb className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Smart Recommendations</h2>
      </div>

      <div className="space-y-3">
        {uniqueRecommendations.map((rec, index) => {
          const Icon = iconMap[rec.icon as keyof typeof iconMap] || CheckCircle;
          const isOptimal = rec.type === 'optimal';

          return (
            <div
              key={index}
              className={`${
                isOptimal ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'
              } border rounded-xl p-4 flex items-start gap-3`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  isOptimal ? 'bg-emerald-100' : 'bg-blue-100'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isOptimal ? 'text-emerald-600' : 'text-blue-600'}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium mb-1 ${
                    isOptimal ? 'text-emerald-900' : 'text-gray-900'
                  }`}
                >
                  {rec.message}
                </p>
                <p className="text-xs text-gray-500">
                  {rec.sensorName} • {rec.location}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
