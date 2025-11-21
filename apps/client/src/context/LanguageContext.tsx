'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ge';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// English translations
const en = {
  // Navbar
  'nav.home': 'Home',
  'nav.products': 'Products',
  'nav.about': 'About Us',
  'nav.login': 'Login',
  'nav.register': 'Register',

  // Hero
  'hero.title': 'Professional Drone Services for Every Need',
  'hero.description':
    'We provide cutting-edge drone solutions for aerial photography, surveying, inspections, and custom builds. Experience precision and reliability with Chikox.',
  'hero.getStarted': 'Get Started',
  'hero.learnMore': 'Learn More',

  // Features
  'features.tagline': 'Our Services',
  'features.title': 'What We Offer',
  'features.description': 'Comprehensive drone services tailored to your specific requirements.',
  'features.card1.tagline': 'Photography',
  'features.card1.title': 'Aerial Photography & Videography',
  'features.card1.description':
    'Stunning aerial shots for real estate, events, and commercial projects.',
  'features.card2.tagline': 'Durability',
  'features.card2.title': 'Robust drone frames',
  'features.card2.description':
    'Lightweight materials designed to withstand extreme flight conditions.',
  'features.button': 'Explore',

  // Services
  'services.01': '01',
  'services.02': '02',
  'services.03': '03',
  'services.customBuilds': 'Custom builds',
  'services.repairServices': 'Repair services',
  'services.technicalConsulting': 'Technical consulting',
  'services.tagline': 'Design',
  'services.title': 'Tailored drone solutions for your specific needs',
  'services.description':
    'Our expert team creates custom drone configurations that meet your unique requirements. From research to racing, we build precision machines.',
  'services.getStarted': 'Get started',
  'services.consult': 'Consult',

  // Testimonials
  'testimonials.title': 'Customer testimonials',
  'testimonials.description': 'See what our clients say about our services.',
  'testimonials.quote':
    "These components transformed our research drone's performance beyond expectations.",
  'testimonials.name': 'Michael Chen',
  'testimonials.position': 'Lead engineer, Aerial Research Labs',

  // Tabs
  'tabs.title': 'Precision engineering advantage',
  'tabs.description':
    'Our components are designed with microscopic tolerances to deliver unparalleled performance and reliability.',

  // Footer
  'footer.description': 'Professional drone services for every need.',
  'footer.quickLinks': 'Quick Links',
  'footer.services': 'Services',
  'footer.aboutUs': 'About Us',
  'footer.contact': 'Contact',
  'footer.contactTitle': 'Contact',
  'footer.rights': 'All rights reserved.',

  // Login
  'login.title': 'Welcome back',
  'login.subtitle': 'Sign in to your account',
  'login.email': 'Email',
  'login.emailPlaceholder': 'Enter your email',
  'login.password': 'Password',
  'login.passwordPlaceholder': 'Enter your password',
  'login.rememberMe': 'Remember me',
  'login.forgotPassword': 'Forgot password?',
  'login.signIn': 'Sign in',
  'login.signingIn': 'Signing in...',
  'login.noAccount': "Don't have an account?",
  'login.signUp': 'Sign up',

  // Register
  'register.title': 'Create account',
  'register.subtitle': 'Join Chikox today',
  'register.name': 'Full name',
  'register.namePlaceholder': 'Enter your full name',
  'register.email': 'Email',
  'register.emailPlaceholder': 'Enter your email',
  'register.password': 'Password',
  'register.passwordPlaceholder': 'Create a password',
  'register.passwordHint': 'Must be at least 8 characters',
  'register.confirmPassword': 'Confirm password',
  'register.confirmPasswordPlaceholder': 'Confirm your password',
  'register.terms': 'I agree to the',
  'register.termsOfService': 'Terms of Service',
  'register.and': 'and',
  'register.privacyPolicy': 'Privacy Policy',
  'register.createAccount': 'Create account',
  'register.creatingAccount': 'Creating account...',
  'register.hasAccount': 'Already have an account?',
  'register.signIn': 'Sign in',
  'register.passwordMismatch': 'Passwords do not match',
  'register.passwordTooShort': 'Password must be at least 8 characters'
};

// Georgian translations
const ge: typeof en = {
  // Navbar
  'nav.home': 'მთავარი',
  'nav.products': 'პროდუქტები',
  'nav.about': 'ჩვენს შესახებ',
  'nav.login': 'შესვლა',
  'nav.register': 'რეგისტრაცია',

  // Hero
  'hero.title': 'პროფესიონალური დრონის სერვისები ყველა საჭიროებისთვის',
  'hero.description':
    'ჩვენ გთავაზობთ უახლესი დრონის გადაწყვეტილებებს აერო ფოტოგრაფიის, გეოდეზიის, ინსპექციებისა და მორგებული აწყობისთვის. გამოცადეთ სიზუსტე და საიმედოობა Chikox-თან ერთად.',
  'hero.getStarted': 'დაწყება',
  'hero.learnMore': 'გაიგე მეტი',

  // Features
  'features.tagline': 'ჩვენი სერვისები',
  'features.title': 'რას გთავაზობთ',
  'features.description': 'ყოვლისმომცველი დრონის სერვისები თქვენი კონკრეტული მოთხოვნებისთვის.',
  'features.card1.tagline': 'ფოტოგრაფია',
  'features.card1.title': 'აერო ფოტო და ვიდეო გადაღება',
  'features.card1.description':
    'შთამბეჭდავი აერო კადრები უძრავი ქონების, ღონისძიებებისა და კომერციული პროექტებისთვის.',
  'features.card2.tagline': 'გამძლეობა',
  'features.card2.title': 'მძლავრი დრონის ჩარჩოები',
  'features.card2.description':
    'მსუბუქი მასალები, რომლებიც შექმნილია ექსტრემალური ფრენის პირობების გადასატანად.',
  'features.button': 'შესწავლა',

  // Services
  'services.01': '01',
  'services.02': '02',
  'services.03': '03',
  'services.customBuilds': 'მორგებული აწყობა',
  'services.repairServices': 'შეკეთების სერვისები',
  'services.technicalConsulting': 'ტექნიკური კონსულტაცია',
  'services.tagline': 'დიზაინი',
  'services.title': 'მორგებული დრონის გადაწყვეტილებები თქვენი კონკრეტული საჭიროებებისთვის',
  'services.description':
    'ჩვენი ექსპერტთა გუნდი ქმნის მორგებულ დრონის კონფიგურაციებს, რომლებიც აკმაყოფილებს თქვენს უნიკალურ მოთხოვნებს. კვლევიდან რბოლამდე, ჩვენ ვაშენებთ ზუსტ მანქანებს.',
  'services.getStarted': 'დაწყება',
  'services.consult': 'კონსულტაცია',

  // Testimonials
  'testimonials.title': 'მომხმარებელთა შეფასებები',
  'testimonials.description': 'ნახეთ რას ამბობენ ჩვენი კლიენტები ჩვენს სერვისებზე.',
  'testimonials.quote':
    'ამ კომპონენტებმა გარდაქმნა ჩვენი კვლევითი დრონის შესრულება მოლოდინს მიღმა.',
  'testimonials.name': 'მიხეილ ჩენი',
  'testimonials.position': 'წამყვანი ინჟინერი, Aerial Research Labs',

  // Tabs
  'tabs.title': 'ზუსტი ინჟინერიის უპირატესობა',
  'tabs.description':
    'ჩვენი კომპონენტები შექმნილია მიკროსკოპული ტოლერანტობით, რათა უზრუნველყოს შეუდარებელი შესრულება და საიმედოობა.',

  // Footer
  'footer.description': 'პროფესიონალური დრონის სერვისები ყველა საჭიროებისთვის.',
  'footer.quickLinks': 'სწრაფი ბმულები',
  'footer.services': 'სერვისები',
  'footer.aboutUs': 'ჩვენს შესახებ',
  'footer.contact': 'კონტაქტი',
  'footer.contactTitle': 'კონტაქტი',
  'footer.rights': 'ყველა უფლება დაცულია.',

  // Login
  'login.title': 'კეთილი იყოს თქვენი დაბრუნება',
  'login.subtitle': 'შედით თქვენს ანგარიშზე',
  'login.email': 'ელ-ფოსტა',
  'login.emailPlaceholder': 'შეიყვანეთ თქვენი ელ-ფოსტა',
  'login.password': 'პაროლი',
  'login.passwordPlaceholder': 'შეიყვანეთ თქვენი პაროლი',
  'login.rememberMe': 'დამიმახსოვრე',
  'login.forgotPassword': 'დაგავიწყდათ პაროლი?',
  'login.signIn': 'შესვლა',
  'login.signingIn': 'შესვლა...',
  'login.noAccount': 'არ გაქვთ ანგარიში?',
  'login.signUp': 'რეგისტრაცია',

  // Register
  'register.title': 'ანგარიშის შექმნა',
  'register.subtitle': 'შემოგვიერთდით Chikox-ს დღეს',
  'register.name': 'სახელი და გვარი',
  'register.namePlaceholder': 'შეიყვანეთ თქვენი სახელი და გვარი',
  'register.email': 'ელ-ფოსტა',
  'register.emailPlaceholder': 'შეიყვანეთ თქვენი ელ-ფოსტა',
  'register.password': 'პაროლი',
  'register.passwordPlaceholder': 'შექმენით პაროლი',
  'register.passwordHint': 'მინიმუმ 8 სიმბოლო',
  'register.confirmPassword': 'პაროლის დადასტურება',
  'register.confirmPasswordPlaceholder': 'დაადასტურეთ თქვენი პაროლი',
  'register.terms': 'ვეთანხმები',
  'register.termsOfService': 'მომსახურების პირობებს',
  'register.and': 'და',
  'register.privacyPolicy': 'კონფიდენციალურობის პოლიტიკას',
  'register.createAccount': 'ანგარიშის შექმნა',
  'register.creatingAccount': 'იქმნება ანგარიში...',
  'register.hasAccount': 'უკვე გაქვთ ანგარიში?',
  'register.signIn': 'შესვლა',
  'register.passwordMismatch': 'პაროლები არ ემთხვევა',
  'register.passwordTooShort': 'პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო'
};

const translations = { en, ge };

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language | null;
    if (savedLang && (savedLang === 'en' || savedLang === 'ge')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
