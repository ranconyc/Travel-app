import { useEffect, useCallback, useRef } from "react";
import { UseFormWatch, FieldValues } from "react-hook-form";
import { DEBOUNCE_DELAYS } from "@/config/ui-constants";

export interface UseFormPersistenceOptions<T extends FieldValues> {
  /** Unique key for localStorage */
  storageKey: string;
  /** Form watch function from react-hook-form */
  watch: UseFormWatch<T>;
  /** Debounce delay in ms (default: 1000ms) */
  debounceMs?: number;
  /** Fields to exclude from persistence */
  excludeFields?: (keyof T)[];
  /** Callback when form is saved */
  onSave?: (data: T) => void;
}

/**
 * Hook for automatic form persistence to localStorage
 *
 * Automatically saves form data to localStorage with debouncing
 *
 * @example
 * ```typescript
 * const { watch, reset } = useForm<FormData>();
 *
 * const { clearPersistedData } = useFormPersistence({
 *   storageKey: "persona-form",
 *   watch,
 *   excludeFields: ["password"],
 * });
 *
 * // Clear on successful submit
 * const onSubmit = async (data) => {
 *   await saveData(data);
 *   clearPersistedData();
 * };
 * ```
 */
export function useFormPersistence<T extends FieldValues>(
  options: UseFormPersistenceOptions<T>,
) {
  const {
    storageKey,
    watch,
    debounceMs = DEBOUNCE_DELAYS.AUTOSAVE,
    excludeFields = [],
    onSave,
  } = options;

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Save to localStorage
  const saveToStorage = useCallback(
    (data: T) => {
      try {
        // Filter out excluded fields
        const dataToSave = { ...data };
        excludeFields.forEach((field) => {
          delete dataToSave[field];
        });

        localStorage.setItem(storageKey, JSON.stringify(dataToSave));

        if (onSave) {
          onSave(dataToSave as T);
        }
      } catch (error) {
        console.error("[FormPersistence] Failed to save:", error);
      }
    },
    [storageKey, excludeFields, onSave],
  );

  // Load from localStorage
  const loadFromStorage = useCallback((): T | null => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("[FormPersistence] Failed to load:", error);
      return null;
    }
  }, [storageKey]);

  // Clear persisted data
  const clearPersistedData = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("[FormPersistence] Failed to clear:", error);
    }
  }, [storageKey]);

  // Watch form changes and save with debounce
  useEffect(() => {
    const subscription = watch((data) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        saveToStorage(data as T);
      }, debounceMs);
    });

    // Cleanup
    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [watch, saveToStorage, debounceMs]);

  return {
    loadFromStorage,
    clearPersistedData,
    saveToStorage,
  };
}
