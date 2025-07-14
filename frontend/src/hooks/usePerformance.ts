import { useEffect, useRef, useCallback, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(0);
  const metrics = useRef<PerformanceMetrics[]>([]);

  // Start measuring render time
  useEffect(() => {
    renderStartTime.current = performance.now();
  });

  // End measuring render time
  useEffect(() => {
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    const metric: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: Date.now(),
    };

    metrics.current.push(metric);

    // Keep only last 10 metrics to avoid memory leaks
    if (metrics.current.length > 10) {
      metrics.current.shift();
    }

    // Log slow renders in development
    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  });

  const getMetrics = useCallback(() => {
    return metrics.current;
  }, []);

  const getAverageRenderTime = useCallback(() => {
    if (metrics.current.length === 0) return 0;
    
    const totalTime = metrics.current.reduce((sum, metric) => sum + metric.renderTime, 0);
    return totalTime / metrics.current.length;
  }, []);

  return {
    getMetrics,
    getAverageRenderTime,
  };
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useThrottle = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): T => {
  const lastRan = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const throttledFunc = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastRan.current >= delay) {
        func(...args);
        lastRan.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          func(...args);
          lastRan.current = Date.now();
        }, delay - (now - lastRan.current));
      }
    },
    [func, delay]
  );

  return throttledFunc as T;
}; 