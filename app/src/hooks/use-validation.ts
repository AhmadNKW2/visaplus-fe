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
    setLanguage: (lang: string) => void;
}

export const useValidation = (initialLanguage: string = 'en'): UseValidationReturn => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [language, setLanguageState] = useState<string>(initialLanguage);

    const setLanguage = useCallback((lang: string) => {
        setLanguageState(lang);
    }, []);

    const getErrorMessage = (rule: ValidationRule, lang: string): string => {
        const messages: Record<ValidationRule, { en: string; ar: string }> = {
            required: {
                en: 'This field is required',
                ar: 'هذا الحقل مطلوب'
            },
            isAr: {
                en: 'Only Arabic characters are allowed',
                ar: 'يُسمح فقط بالأحرف العربية'
            },
            isEn: {
                en: 'Only English characters are allowed',
                ar: 'يُسمح فقط بالأحرف الإنجليزية'
            },
            isNum: {
                en: 'Only numbers are allowed',
                ar: 'يُسمح فقط بالأرقام'
            }
        };
        return lang === 'ar' ? messages[rule].ar : messages[rule].en;
    };

    const validateValue = useCallback((value: any, rule: ValidationRule, lang: string): string | null => {
        if (rule === 'required') {
            if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) {
                return getErrorMessage('required', lang);
            }
        }
        if (rule === 'isAr') {
             // Arabic range: [\u0600-\u06FF]
             // Allow spaces, numbers, common symbols
             const arRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
             if (value && typeof value === 'string' && !arRegex.test(value)) {
                 return getErrorMessage('isAr', lang);
             }
        }
        if (rule === 'isEn') {
            // English range: [a-zA-Z]
            // Allow spaces, numbers, common symbols
            const enRegex = /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
            if (value && typeof value === 'string' && !enRegex.test(value)) {
                return getErrorMessage('isEn', lang);
            }
        }
        if (rule === 'isNum') {
            // Only numbers allowed
            if (value && typeof value === 'string' && !/^\d+$/.test(value)) {
                return getErrorMessage('isNum', lang);
            }
        }
        return null;
    }, []);

    const validateField = useCallback((name: string, value: any, rules: ValidationRule[]) => {
        let error: string | null = null;

        // Check immediate rules (isAr, isEn)
        for (const rule of rules) {
            if (rule === 'required') continue; 
            const ruleError = validateValue(value, rule, language);
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
    }, [language, validateValue]);

    const validateForm = useCallback((values: Record<string, any>, config: ValidationConfig) => {
        const newErrors: Record<string, string> = {};
        let firstErrorKey: string | null = null;

        for (const [key, rules] of Object.entries(config)) {
            const value = values[key];
            for (const rule of rules) {
                const error = validateValue(value, rule, language);
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
    }, [language, validateValue]);

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

    return { errors, validateField, validateForm, clearError, setError, setLanguage };
};
