"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal"; // Ensure your Modal component supports className props or create a wrapper
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useLanguage } from "../../contexts/language.context";
import { contactRequestService } from "../../services/contact-requests/api/contact-request.service";
import { Phone, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Country } from "../../services/countries/types/country.types";
import { CONTACT_INFO } from "../../lib/contact-info";

interface ContactRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCountry?: Country;
}

export const ContactRequestModal: React.FC<ContactRequestModalProps> = ({
    isOpen,
    onClose,
    selectedCountry,
}) => {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        nationality: "",
        phoneNumber: "",
        destination: "",
    });

    useEffect(() => {
        if (isOpen) {
            setSubmitted(false); // Reset state on open
            setFormData({
                firstName: "",
                lastName: "",
                nationality: "",
                phoneNumber: "",
                destination: "",
            });
        }
        if (selectedCountry) {
            setFormData(prev => ({
                ...prev,
                destination: language === 'ar' ? selectedCountry.countryWorld?.name_ar || '' : selectedCountry.countryWorld?.name_en || ''
            }));
        }
    }, [selectedCountry, language, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await contactRequestService.createContactRequest({
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                nationality: formData.nationality,
                phone_number: formData.phoneNumber,
                destination_country: formData.destination,
            } as any);
            setSubmitted(true);
            setFormData({
                firstName: "",
                lastName: "",
                nationality: "",
                phoneNumber: "",
                destination: "",
            });
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error(error);
        }
    };

    // If the modal implementation doesn't support custom styling easily, 
    // wrap the content in a nice container
    return (
        <Modal isOpen={isOpen} onClose={onClose} variant="transparent" className="w-full max-w-4xl p-0 bg-transparent shadow-none">
            <div className="flex flex-col md:flex-row w-full h-full rounded-2xl overflow-hidden shadow-2xl overflow-y-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>

                {/* Left: Branding/Contact */}
                <div className="relative w-full md:w-2/5 bg-slate-900 p-6 md:p-8 text-white flex flex-col justify-between flex-shrink-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-blue-600/20 to-purple-600/20 z-0" />
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">VisaPlus</h3>
                        <p className="text-blue-200 text-sm">{t("Your gateway to the world.", "بوابتك إلى العالم.")}</p>
                    </div>

                    <div className="relative z-10 space-y-6 my-8">
                        <div className="flex items-center gap-4 group">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-blue-600 transition-colors duration-300"><Phone className="w-5 h-5" /></div>
                            <div>
                                <p className="text-xs text-blue-200 uppercase tracking-wider">{t("Phone 1", "هاتف 1")}</p>
                                <p className="font-medium" dir="ltr">{CONTACT_INFO.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-blue-600 transition-colors duration-300"><Phone className="w-5 h-5" /></div>
                            <div>
                                <p className="text-xs text-blue-200 uppercase tracking-wider">{t("Phone 2", "هاتف 2")}</p>
                                <p className="font-medium" dir="ltr">{CONTACT_INFO.phone2}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-blue-600 transition-colors duration-300"><Mail className="w-5 h-5" /></div>
                            <div>
                                <p className="text-xs text-blue-200 uppercase tracking-wider">{t("Email", "البريد الإلكتروني")}</p>
                                <p className="font-medium">{CONTACT_INFO.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-blue-600 transition-colors duration-300"><MapPin className="w-5 h-5" /></div>
                            <div>
                                <p className="text-xs text-blue-200 uppercase tracking-wider">{t("Location", "الموقع")}</p>
                                <p className="font-medium">
                                    {language === 'ar' ? CONTACT_INFO.location.ar : CONTACT_INFO.location.en}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 text-xs text-white/40">
                        © {new Date().getFullYear()} VisaPlus Inc.
                    </div>
                </div>

                {/* Right: Form */}
                <div className="w-full md:w-3/5 p-6 md:p-8 bg-gray-50">
                    <AnimatePresence mode="wait">
                        {submitted ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="h-full flex flex-col items-center justify-center text-center space-y-4"
                            >
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{t("Request Sent!", "تم إرسال الطلب!")}</h3>
                                <p className="text-gray-500">{t("We will contact you shortly.", "سنتواصل معك قريباً.")}</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold mb-1 text-gray-900">
                                    {t("Start your journey", "ابدأ رحلتك")}
                                </h2>
                                <p className="text-gray-500 mb-6 text-sm">
                                    {t("Fill in the details below and our experts will reach out.", "املأ التفاصيل أدناه وسيتواصل معك خبراؤنا.")}
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase">{t("First Name", "الاسم الأول")}</label>
                                            <Input
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="bg-white"
                                                required
                                                isRtl={isRtl ? true : false}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase">{t("Last Name", "اسم العائلة")}</label>
                                            <Input
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="bg-white"
                                                isRtl={isRtl ? true : false}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">{t("Nationality", "الجنسية")}</label>
                                        <Input
                                            value={formData.nationality}
                                            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                            className="bg-white"
                                            isRtl={isRtl ? true : false}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">{t("Phone Number", "رقم الهاتف")}</label>
                                        <Input
                                            type="tel"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            className="bg-white"
                                            isRtl={isRtl ? true : false}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">{t("Destination", "الوجهة")}</label>
                                        <Input
                                            value={formData.destination}
                                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                            className="bg-white"
                                            isRtl={isRtl ? true : false}
                                            required
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            className="w-full h-[52px]"
                                            color="#c02033"
                                        >
                                            {t("Submit Request", "إرسال الطلب")}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Modal>
    );
};