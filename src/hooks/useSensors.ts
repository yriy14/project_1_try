import { useEffect, useState } from 'react';
import { supabase, Sensor } from '../lib/supabase';

export function useSensors() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSensors = async () => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('sensors')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setSensors(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sensors');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();

    const channel = supabase
      .channel('sensors-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sensors' },
        () => {
          fetchSensors();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { sensors, isLoading, error, refetch: fetchSensors };
}
