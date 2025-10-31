import { useState } from 'react';
import { Plus, Home, RefreshCw } from 'lucide-react';
import SensorList from './components/SensorList';
import RecommendationPanel from './components/RecommendationPanel';
import AddSensorForm from './components/AddSensorForm';
import { useSensors } from './hooks/useSensors';

function App() {
  const { sensors, isLoading, refetch } = useSensors();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const activeSensors = sensors.filter((s) => s.is_active);

  // Функція видалення сенсора
  const handleDeleteSensor = async (id: string) => {
    try {
      const res = await fetch(`https://sensor-backend-sg59.onrender.com/api/sensors/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete sensor');

      refetch(); // Оновлюємо список після видалення
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete sensor');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30">
                <Home className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Smart Home Monitor</h1>
                <p className="text-gray-600 mt-1">
                  Tracking {activeSensors.length} active {activeSensors.length === 1 ? 'sensor' : 'sensors'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={refetch}
                disabled={isLoading}
                className="px-4 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium border border-gray-200 flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setIsAddFormOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all font-medium shadow-lg shadow-blue-500/30 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Sensor
              </button>
            </div>
          </div>

          {sensors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Total Sensors</p>
                <p className="text-2xl font-bold text-gray-900">{sensors.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Active Now</p>
                <p className="text-2xl font-bold text-emerald-600">{activeSensors.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Avg Temperature</p>
                <p className="text-2xl font-bold text-orange-600">
                  {activeSensors.length > 0
                    ? (
                        activeSensors.reduce((sum, s) => sum + Number(s.temperature), 0) /
                        activeSensors.length
                      ).toFixed(1)
                    : '0'}
                  °C
                </p>
              </div>
            </div>
          )}
        </header>

        <div className="space-y-6">
          {sensors.length > 0 && <RecommendationPanel sensors={sensors} />}
          <SensorList sensors={sensors} isLoading={isLoading} onDelete={handleDeleteSensor} />
        </div>
      </div>

      <AddSensorForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSensorAdded={refetch}
      />
    </div>
  );
}

export default App;
