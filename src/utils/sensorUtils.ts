export type ComfortLevel = 'optimal' | 'warning' | 'critical';

export interface ComfortStatus {
  level: ComfortLevel;
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}

export interface Recommendation {
  type: 'temperature' | 'humidity' | 'optimal';
  message: string;
  icon: string;
}

export const getComfortStatus = (temperature: number, humidity: number): ComfortStatus => {
  const tempOptimal = temperature >= 18 && temperature <= 24;
  const humidityOptimal = humidity >= 30 && humidity <= 60;

  if (tempOptimal && humidityOptimal) {
    return {
      level: 'optimal',
      label: 'Optimal',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      icon: '✓'
    };
  }

  const tempCritical = temperature < 15 || temperature > 28;
  const humidityCritical = humidity < 20 || humidity > 70;

  if (tempCritical || humidityCritical) {
    return {
      level: 'critical',
      label: 'Critical',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      icon: '!'
    };
  }

  return {
    level: 'warning',
    label: 'Monitor',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    icon: '⚠'
  };
};

export const getRecommendations = (temperature: number, humidity: number): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  if (humidity > 70) {
    recommendations.push({
      type: 'humidity',
      message: 'Open a window to ventilate the room',
      icon: 'wind'
    });
  } else if (humidity < 30) {
    recommendations.push({
      type: 'humidity',
      message: 'Consider placing a plant to increase humidity',
      icon: 'leaf'
    });
  }

  if (temperature > 26) {
    recommendations.push({
      type: 'temperature',
      message: 'Room is too warm, consider cooling',
      icon: 'thermometer'
    });
  } else if (temperature < 18) {
    recommendations.push({
      type: 'temperature',
      message: 'Room is too cold, consider heating',
      icon: 'flame'
    });
  }

  if (temperature >= 18 && temperature <= 24 && humidity >= 30 && humidity <= 60) {
    recommendations.push({
      type: 'optimal',
      message: 'Temperature and humidity are optimal',
      icon: 'check-circle'
    });
  }

  return recommendations;
};

export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};
