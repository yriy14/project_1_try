export function useSensors() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSensors = async () => {
    try {
      setIsLoading(true);

      const res = await fetch('https://sensor-backend-sg59.onrender.com/api/sensors');
      if (!res.ok) throw new Error('Failed to fetch sensors');

      const data: Sensor[] = await res.json();
      setSensors(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sensors');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();

    const interval = setInterval(fetchSensors, 5 * 60 * 1000); // оновлення кожні 5 хв

    return () => clearInterval(interval);
  }, []);

  return { sensors, isLoading, error, refetch: fetchSensors };
}
