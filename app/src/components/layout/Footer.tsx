"use client";

import React from "react";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "../../contexts/language.context";
import { CONTACT_INFO } from "../../lib/contact-info";
import Image from "next/image";

export const Footer = () => {
    const { t, language } = useLanguage();

    return (
        <footer className="bg-slate-900 text-white p-16 pb-8 max-sm:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <a href="https://www.visaplusjo.com" className="block relative w-45 h-15 hover:opacity-90 transition-opacity">
                            <Image
                                fill
                                src="/Logo2.svg"
                                alt="VisaPlus Logo"
                            />
                        </a>
                        <p className="text-white text-sm leading-relaxed max-w-xs">
                            {t(
                                "Your trusted partner for visa assistance. We make your travel dreams a reality with professional and fast service.",
                                "شريكك الموثوق للمساعدة في التأشيرة. نجعل أحلام سفرك حقيقة بخدمة احترافية وسريعة."
                            )}
                        </p>
                        {/* Social Links */}
                        <div className="flex items-center gap-4 pt-4">
                            <a
                                href={CONTACT_INFO.social.facebook}
                                target="_blank"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 active:bg-blue-700 transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href={CONTACT_INFO.social.instagram}
                                target="_blank"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 active:bg-pink-700 transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:info@visaplus.com"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 active:bg-green-700 transition-colors"
                                aria-label="Email"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold">{t("Contact Us", "اتصل بنا")}</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 group">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-[#c02033] active:bg-[#a01b2b] transition-colors duration-300">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-300 uppercase tracking-wider mb-0.5">{t("Phone 1", "هاتف 1")}</p>
                                    <p className="font-medium hover:text-blue-200 active:text-blue-300 transition-colors duration-300" dir="ltr">{CONTACT_INFO.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-[#c02033] active:bg-[#a01b2b] transition-colors duration-300">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-300 uppercase tracking-wider mb-0.5">{t("Phone 2", "هاتف 2")}</p>
                                    <p className="font-medium hover:text-blue-200 active:text-blue-300 transition-colors duration-300" dir="ltr">{CONTACT_INFO.phone2}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-[#c02033] active:bg-[#a01b2b] transition-colors duration-300">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-300 uppercase tracking-wider mb-0.5">{t("Email", "البريد الإلكتروني")}</p>
                                    <p className="font-medium hover:text-blue-200 active:text-blue-300 transition-colors duration-300">{CONTACT_INFO.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-[#c02033] active:bg-[#a01b2b] transition-colors duration-300">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-300 uppercase tracking-wider mb-0.5">{t("Location", "الموقع")}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium hover:text-blue-200 active:text-blue-300 transition-colors duration-300">
                                            {language === 'ar' ? CONTACT_INFO.location.ar : CONTACT_INFO.location.en}
                                        </p>
                                        <a
                                            href="https://maps.app.goo.gl/NUJW1UVJ6Xp24Mq87"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 flex items-center gap-1"
                                        >
                                            <MapPin className="w-3 h-3" />
                                            {t("Map", "الخريطة")}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold">{t("Quick Links", "روابط سريعة")}</h4>
                        <ul className="space-y-3 text-blue-200 text-sm">
                            <li><a href={`/${language}/about-us`} className="hover:text-white transition-colors duration-300">{t("About Us", "من نحن")}</a></li>
                            <li><a href={`/${language}/faqs`} className="hover:text-white transition-colors duration-300">{t("FAQs", "أسئلة وأجوبة")}</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 text-center text-blue-300/60 text-sm">
                    <p>&copy; {new Date().getFullYear()} VisaPlus. {t("All rights reserved.", "جميع الحقوق محفوظة.")}</p>
                </div>
            </div>
        </footer>
    );
};
 