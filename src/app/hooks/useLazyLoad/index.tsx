import { useState, useEffect, useRef } from 'react';

interface UseLazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
}


export function useLazyLoad<T>(
  loader: () => Promise<T>,
  options: UseLazyLoadOptions = {}
) {
  const { rootMargin = '200px', threshold = 0.1 } = options;
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (!isVisible || loading) return;

    setLoading(true);
    setError(null);

    loader()
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isVisible, loader, loading]);

  return { sectionRef, data, loading, error, isVisible };
}
