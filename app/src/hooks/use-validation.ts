import { useState, useCallback } from 'react';

export type ValidationRule = 'required' | 'isAr' | 'isEn' | 'isNum';

export interface ValidationConfig {
    [key: string]: ValidationRule[];
}

export interface UseValidationReturn {
    errors: Record<string, string>;
    validateField: (name: string, value: any, rules: ValidationRule[]) => boolean;
    validateForm: (values: Record<string, any>, config: ValidationConfig) => boolean;
    clearError: (name: string) => void;
    setError: (name: string, error: string) => void;
}

export const useValidation = (): UseValidationReturn => {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateValue = (value: any, rule: ValidationRule): string | null => {
        if (rule === 'required') {
            if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) {
                return 'This field is required';
            }
        }
        if (rule === 'isAr') {
             // Arabic range: [\u0600-\u06FF]
             // Allow spaces, numbers, common symbols
             const arRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
             if (value && typeof value === 'string' && !arRegex.test(value)) {
                 return 'Only Arabic characters are allowed';
             }
        }
        if (rule === 'isEn') {
            // English range: [a-zA-Z]
            // Allow spaces, numbers, common symbols
            const enRegex = /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
            if (value && typeof value === 'string' && !enRegex.test(value)) {
                return 'Only English characters are allowed';
            }
        }
        if (rule === 'isNum') {
            // Only numbers allowed
            if (value && typeof value === 'string' && !/^\d+$/.test(value)) {
                return 'Only numbers are allowed';
            }
        }
        return null;
    };

    const validateField = useCallback((name: string, value: any, rules: ValidationRule[]) => {
        let error: string | null = null;

        // Check immediate rules (isAr, isEn)
        for (const rule of rules) {
            if (rule === 'required') continue; 
            const ruleError = validateValue(value, rule);
            if (ruleError) {
                error = ruleError;
                break;
            }
        }

        setErrors(prev => {
            const newErrors = { ...prev };
            if (error) {
                newErrors[name] = error;
            } else {
                // Clear error if valid
                // Also clears 'required' error if value is present
                delete newErrors[name];
            }
            return newErrors;
        });

        return !error;
    }, []);

    const validateForm = useCallback((values: Record<string, any>, config: ValidationConfig) => {
        const newErrors: Record<string, string> = {};
        let firstErrorKey: string | null = null;

        for (const [key, rules] of Object.entries(config)) {
            const value = values[key];
            for (const rule of rules) {
                const error = validateValue(value, rule);
                if (error) {
                    if (!newErrors[key]) {
                        newErrors[key] = error;
                        if (!firstErrorKey) firstErrorKey = key;
                    }
                    break; 
                }
            }
        }

        setErrors(newErrors);

        if (firstErrorKey) {
            // Scroll to first error
            setTimeout(() => {
                const element = document.querySelector(`[name="${firstErrorKey}"]`) || document.getElementById(firstErrorKey);
                if (element && element instanceof HTMLElement) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.focus();
                }
            }, 100);
            return false;
        }

        return true;
    }, []);

    const clearError = useCallback((name: string) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }, []);

    const setError = useCallback((name: string, error: string) => {
        setErrors(prev => ({ ...prev, [name]: error }));
    }, []);

    return { errors, validateField, validateForm, clearError, setError };
};
