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
  'nav.logout': 'Logout',

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
  'register.passwordTooShort': 'Password must be at least 8 characters',

  // Forgot Password
  'forgotPassword.title': 'Forgot password',
  'forgotPassword.subtitle': 'Enter your email to receive a reset link',
  'forgotPassword.email': 'Email',
  'forgotPassword.emailPlaceholder': 'Enter your email',
  'forgotPassword.sendReset': 'Send reset link',
  'forgotPassword.sending': 'Sending...',
  'forgotPassword.success': 'If an account exists with this email, a reset link has been sent',
  'forgotPassword.failed': 'Failed to send reset email',
  'forgotPassword.backToLogin': 'Back to login',

  // Reset Password
  'resetPassword.title': 'Reset password',
  'resetPassword.subtitle': 'Enter your new password',
  'resetPassword.newPassword': 'New password',
  'resetPassword.newPasswordPlaceholder': 'Enter new password',
  'resetPassword.confirmPassword': 'Confirm password',
  'resetPassword.confirmPasswordPlaceholder': 'Confirm new password',
  'resetPassword.resetButton': 'Reset password',
  'resetPassword.resetting': 'Resetting...',
  'resetPassword.success': 'Password has been reset successfully',
  'resetPassword.failed': 'Failed to reset password',
  'resetPassword.invalidToken': 'Invalid or expired reset link',
  'resetPassword.passwordMismatch': 'Passwords do not match',
  'resetPassword.passwordTooShort': 'Password must be at least 8 characters',
  'resetPassword.backToLogin': 'Back to login',

  // Common
  'login.failed': 'Login failed',
  'login.invalidCredentials': 'Invalid email or password',

  // Verify Email
  'verifyEmail.title': 'Verify Email',
  'verifyEmail.subtitle': 'Confirming your email address',
  'verifyEmail.verifying': 'Verifying your email...',
  'verifyEmail.success': 'Email verified successfully',
  'verifyEmail.failed': 'Failed to verify email',
  'verifyEmail.invalidToken': 'Invalid or expired verification link',
  'verifyEmail.tryAgain': 'Please request a new verification email',
  'verifyEmail.canLogin': 'You can now login to your account',
  'verifyEmail.goToLogin': 'Go to login',

  // Registration
  'register.verificationSent': 'Please check your email to verify your account',
  'register.failed': 'Registration failed',

  // Login errors
  'login.emailNotVerified': 'Please verify your email before logging in',

  // Terms of Service
  'terms.title': 'Terms of Service',
  'terms.lastUpdated': 'Last updated: November 2024',
  'terms.acceptance.title': '1. Acceptance of Terms',
  'terms.acceptance.content':
    'By accessing and using Chikox services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
  'terms.services.title': '2. Description of Services',
  'terms.services.content':
    'Chikox provides professional drone services including aerial photography, videography, surveying, inspections, custom builds, and technical consulting. We reserve the right to modify or discontinue any service at any time.',
  'terms.accounts.title': '3. User Accounts',
  'terms.accounts.content':
    'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating an account.',
  'terms.intellectual.title': '4. Intellectual Property',
  'terms.intellectual.content':
    'All content, trademarks, and intellectual property on our platform are owned by Chikox or its licensors. You may not use, reproduce, or distribute any content without our prior written permission.',
  'terms.prohibited.title': '5. Prohibited Activities',
  'terms.prohibited.content':
    'You agree not to engage in any illegal activities, violate any applicable laws or regulations, interfere with our services, or attempt to gain unauthorized access to our systems.',
  'terms.limitation.title': '6. Limitation of Liability',
  'terms.limitation.content':
    'Chikox shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount paid by you for the services.',
  'terms.termination.title': '7. Termination',
  'terms.termination.content':
    'We may terminate or suspend your account at any time for any reason, including violation of these terms. Upon termination, your right to use our services will immediately cease.',
  'terms.changes.title': '8. Changes to Terms',
  'terms.changes.content':
    'We reserve the right to modify these terms at any time. We will notify users of any material changes. Your continued use of our services after changes constitutes acceptance of the new terms.',
  'terms.contact.title': '9. Contact Us',
  'terms.contact.content':
    'If you have any questions about these Terms of Service, please contact us at info@chikox.net.',

  // Privacy Policy
  'privacy.title': 'Privacy Policy',
  'privacy.lastUpdated': 'Last updated: November 2024',
  'privacy.introduction.title': '1. Introduction',
  'privacy.introduction.content':
    'Chikox ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our services.',
  'privacy.collection.title': '2. Information We Collect',
  'privacy.collection.content':
    'We collect information you provide directly (name, email, phone number, payment information) and automatically collected data (IP address, browser type, device information, usage data).',
  'privacy.usage.title': '3. How We Use Your Information',
  'privacy.usage.content':
    'We use your information to provide and improve our services, process transactions, communicate with you, send promotional materials (with your consent), and comply with legal obligations.',
  'privacy.sharing.title': '4. Information Sharing',
  'privacy.sharing.content':
    'We do not sell your personal information. We may share your data with service providers who assist us in operating our business, or when required by law or to protect our rights.',
  'privacy.cookies.title': '5. Cookies and Tracking',
  'privacy.cookies.content':
    'We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content. You can control cookies through your browser settings.',
  'privacy.security.title': '6. Data Security',
  'privacy.security.content':
    'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
  'privacy.rights.title': '7. Your Rights',
  'privacy.rights.content':
    'You have the right to access, correct, or delete your personal information. You may also object to processing or request data portability. Contact us to exercise these rights.',
  'privacy.children.title': "8. Children's Privacy",
  'privacy.children.content':
    'Our services are not intended for children under 16. We do not knowingly collect personal information from children. If we learn we have collected such data, we will delete it.',
  'privacy.changes.title': '9. Changes to This Policy',
  'privacy.changes.content':
    'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date.',
  'privacy.contact.title': '10. Contact Us',
  'privacy.contact.content':
    'If you have questions about this Privacy Policy or our data practices, please contact us at info@chikox.net.',

  // Contact Page
  'contact.title': 'Contact Us',
  'contact.subtitle': 'Have a question or want to work with us? Send us a message!',
  'contact.name': 'Name',
  'contact.namePlaceholder': 'Enter your name',
  'contact.email': 'Email',
  'contact.emailPlaceholder': 'Enter your email',
  'contact.subject': 'Subject',
  'contact.subjectPlaceholder': 'Enter subject',
  'contact.message': 'Message',
  'contact.messagePlaceholder': 'Enter your message',
  'contact.send': 'Send Message',
  'contact.sending': 'Sending...',
  'contact.success': 'Your message has been sent successfully. We will get back to you soon!',
  'contact.failed': 'Failed to send message. Please try again.',
  'contact.otherWays': 'Other Ways to Reach Us',
  'contact.emailLabel': 'Email',
  'contact.phoneLabel': 'Phone',
  'contact.addressLabel': 'Address',
  'contact.address': 'Tbilisi, Georgia'
};

// Georgian translations
const ge: typeof en = {
  // Navbar
  'nav.home': 'მთავარი',
  'nav.products': 'პროდუქტები',
  'nav.about': 'ჩვენს შესახებ',
  'nav.login': 'შესვლა',
  'nav.register': 'რეგისტრაცია',
  'nav.logout': 'გასვლა',

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
  'register.passwordTooShort': 'პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო',

  // Forgot Password
  'forgotPassword.title': 'დაგავიწყდათ პაროლი',
  'forgotPassword.subtitle': 'შეიყვანეთ თქვენი ელ-ფოსტა აღდგენის ბმულის მისაღებად',
  'forgotPassword.email': 'ელ-ფოსტა',
  'forgotPassword.emailPlaceholder': 'შეიყვანეთ თქვენი ელ-ფოსტა',
  'forgotPassword.sendReset': 'აღდგენის ბმულის გაგზავნა',
  'forgotPassword.sending': 'იგზავნება...',
  'forgotPassword.success': 'თუ ანგარიში არსებობს ამ ელ-ფოსტით, აღდგენის ბმული გაიგზავნა',
  'forgotPassword.failed': 'აღდგენის ელ-ფოსტის გაგზავნა ვერ მოხერხდა',
  'forgotPassword.backToLogin': 'შესვლის გვერდზე დაბრუნება',

  // Reset Password
  'resetPassword.title': 'პაროლის აღდგენა',
  'resetPassword.subtitle': 'შეიყვანეთ თქვენი ახალი პაროლი',
  'resetPassword.newPassword': 'ახალი პაროლი',
  'resetPassword.newPasswordPlaceholder': 'შეიყვანეთ ახალი პაროლი',
  'resetPassword.confirmPassword': 'პაროლის დადასტურება',
  'resetPassword.confirmPasswordPlaceholder': 'დაადასტურეთ ახალი პაროლი',
  'resetPassword.resetButton': 'პაროლის აღდგენა',
  'resetPassword.resetting': 'აღდგენა...',
  'resetPassword.success': 'პაროლი წარმატებით აღდგა',
  'resetPassword.failed': 'პაროლის აღდგენა ვერ მოხერხდა',
  'resetPassword.invalidToken': 'არასწორი ან ვადაგასული აღდგენის ბმული',
  'resetPassword.passwordMismatch': 'პაროლები არ ემთხვევა',
  'resetPassword.passwordTooShort': 'პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო',
  'resetPassword.backToLogin': 'შესვლის გვერდზე დაბრუნება',

  // Common
  'login.failed': 'შესვლა ვერ მოხერხდა',
  'login.invalidCredentials': 'არასწორი ელ-ფოსტა ან პაროლი',

  // Verify Email
  'verifyEmail.title': 'ელ-ფოსტის დადასტურება',
  'verifyEmail.subtitle': 'თქვენი ელ-ფოსტის მისამართის დადასტურება',
  'verifyEmail.verifying': 'ელ-ფოსტის დადასტურება...',
  'verifyEmail.success': 'ელ-ფოსტა წარმატებით დადასტურდა',
  'verifyEmail.failed': 'ელ-ფოსტის დადასტურება ვერ მოხერხდა',
  'verifyEmail.invalidToken': 'არასწორი ან ვადაგასული დადასტურების ბმული',
  'verifyEmail.tryAgain': 'გთხოვთ მოითხოვოთ ახალი დადასტურების ელ-ფოსტა',
  'verifyEmail.canLogin': 'ახლა შეგიძლიათ შეხვიდეთ თქვენს ანგარიშზე',
  'verifyEmail.goToLogin': 'შესვლის გვერდზე გადასვლა',

  // Registration
  'register.verificationSent': 'გთხოვთ შეამოწმოთ თქვენი ელ-ფოსტა ანგარიშის დასადასტურებლად',
  'register.failed': 'რეგისტრაცია ვერ მოხერხდა',

  // Login errors
  'login.emailNotVerified': 'გთხოვთ დაადასტუროთ თქვენი ელ-ფოსტა შესვლამდე',

  // Terms of Service
  'terms.title': 'მომსახურების პირობები',
  'terms.lastUpdated': 'ბოლო განახლება: ნოემბერი 2024',
  'terms.acceptance.title': '1. პირობების მიღება',
  'terms.acceptance.content':
    'Chikox-ის სერვისებზე წვდომით და მათი გამოყენებით, თქვენ ეთანხმებით ამ მომსახურების პირობებს. თუ არ ეთანხმებით ამ პირობებს, გთხოვთ არ გამოიყენოთ ჩვენი სერვისები.',
  'terms.services.title': '2. სერვისების აღწერა',
  'terms.services.content':
    'Chikox გთავაზობთ პროფესიონალურ დრონის სერვისებს, მათ შორის აერო ფოტოგრაფიას, ვიდეოგადაღებას, გეოდეზიას, ინსპექციებს, მორგებულ აწყობას და ტექნიკურ კონსულტაციას. ჩვენ ვიტოვებთ უფლებას შევცვალოთ ან შევწყვიტოთ ნებისმიერი სერვისი ნებისმიერ დროს.',
  'terms.accounts.title': '3. მომხმარებლის ანგარიშები',
  'terms.accounts.content':
    'თქვენ პასუხისმგებელი ხართ თქვენი ანგარიშის მონაცემების კონფიდენციალურობის დაცვაზე და ყველა აქტივობაზე, რომელიც ხორციელდება თქვენი ანგარიშით. ანგარიშის შექმნისას უნდა მიუთითოთ ზუსტი და სრული ინფორმაცია.',
  'terms.intellectual.title': '4. ინტელექტუალური საკუთრება',
  'terms.intellectual.content':
    'ჩვენს პლატფორმაზე არსებული ყველა კონტენტი, სავაჭრო ნიშანი და ინტელექტუალური საკუთრება ეკუთვნის Chikox-ს ან მის ლიცენზიარებს. თქვენ არ შეგიძლიათ გამოიყენოთ, გაამრავლოთ ან გაავრცელოთ რაიმე კონტენტი ჩვენი წინასწარი წერილობითი ნებართვის გარეშე.',
  'terms.prohibited.title': '5. აკრძალული ქმედებები',
  'terms.prohibited.content':
    'თქვენ ეთანხმებით, რომ არ ჩაერთვებით უკანონო საქმიანობაში, არ დაარღვევთ მოქმედ კანონებს ან რეგულაციებს, არ ჩაერევით ჩვენს სერვისებში და არ შეეცდებით არასანქცირებულ წვდომას ჩვენს სისტემებზე.',
  'terms.limitation.title': '6. პასუხისმგებლობის შეზღუდვა',
  'terms.limitation.content':
    'Chikox არ იქნება პასუხისმგებელი რაიმე არაპირდაპირ, შემთხვევით, სპეციალურ ან შედეგობრივ ზარალზე, რომელიც წარმოიშვა ჩვენი სერვისების გამოყენებით. ჩვენი მთლიანი პასუხისმგებლობა არ აღემატება თქვენს მიერ სერვისებისთვის გადახდილ თანხას.',
  'terms.termination.title': '7. შეწყვეტა',
  'terms.termination.content':
    'ჩვენ შეგვიძლია შევწყვიტოთ ან დავაყოვოთ თქვენი ანგარიში ნებისმიერ დროს ნებისმიერი მიზეზით, მათ შორის ამ პირობების დარღვევისთვის. შეწყვეტის შემდეგ, ჩვენი სერვისების გამოყენების თქვენი უფლება დაუყოვნებლივ შეწყდება.',
  'terms.changes.title': '8. პირობების ცვლილებები',
  'terms.changes.content':
    'ჩვენ ვიტოვებთ უფლებას შევცვალოთ ეს პირობები ნებისმიერ დროს. ჩვენ შეგატყობინებთ ნებისმიერ არსებით ცვლილებებს. ცვლილებების შემდეგ ჩვენი სერვისების გამოყენების გაგრძელება ნიშნავს ახალი პირობების მიღებას.',
  'terms.contact.title': '9. დაგვიკავშირდით',
  'terms.contact.content':
    'თუ გაქვთ შეკითხვები ამ მომსახურების პირობებთან დაკავშირებით, გთხოვთ დაგვიკავშირდეთ info@chikox.net-ზე.',

  // Privacy Policy
  'privacy.title': 'კონფიდენციალურობის პოლიტიკა',
  'privacy.lastUpdated': 'ბოლო განახლება: ნოემბერი 2024',
  'privacy.introduction.title': '1. შესავალი',
  'privacy.introduction.content':
    'Chikox ("ჩვენ", "ჩვენი") მოწოდებულია დაიცვას თქვენი კონფიდენციალურობა. ეს კონფიდენციალურობის პოლიტიკა განმარტავს, თუ როგორ ვაგროვებთ, ვიყენებთ და ვიცავთ თქვენს პირად ინფორმაციას ჩვენი სერვისების გამოყენებისას.',
  'privacy.collection.title': '2. ინფორმაცია, რომელსაც ვაგროვებთ',
  'privacy.collection.content':
    'ჩვენ ვაგროვებთ ინფორმაციას, რომელსაც პირდაპირ გვაწვდით (სახელი, ელ-ფოსტა, ტელეფონის ნომერი, გადახდის ინფორმაცია) და ავტომატურად შეგროვებულ მონაცემებს (IP მისამართი, ბრაუზერის ტიპი, მოწყობილობის ინფორმაცია, გამოყენების მონაცემები).',
  'privacy.usage.title': '3. როგორ ვიყენებთ თქვენს ინფორმაციას',
  'privacy.usage.content':
    'ჩვენ ვიყენებთ თქვენს ინფორმაციას ჩვენი სერვისების უზრუნველსაყოფად და გასაუმჯობესებლად, ტრანზაქციების დასამუშავებლად, თქვენთან კომუნიკაციისთვის, სარეკლამო მასალების გასაგზავნად (თქვენი თანხმობით) და სამართლებრივი ვალდებულებების შესასრულებლად.',
  'privacy.sharing.title': '4. ინფორმაციის გაზიარება',
  'privacy.sharing.content':
    'ჩვენ არ ვყიდით თქვენს პირად ინფორმაციას. ჩვენ შეიძლება გავუზიაროთ თქვენი მონაცემები სერვისის მიმწოდებლებს, რომლებიც გვეხმარებიან ჩვენი ბიზნესის მართვაში, ან კანონით მოთხოვნილ შემთხვევებში.',
  'privacy.cookies.title': '5. Cookies და თვალყურის დევნება',
  'privacy.cookies.content':
    'ჩვენ ვიყენებთ cookies და მსგავს ტექნოლოგიებს თქვენი გამოცდილების გასაუმჯობესებლად, გამოყენების შაბლონების გასაანალიზებლად და კონტენტის პერსონალიზაციისთვის. თქვენ შეგიძლიათ აკონტროლოთ cookies ბრაუზერის პარამეტრებით.',
  'privacy.security.title': '6. მონაცემთა უსაფრთხოება',
  'privacy.security.content':
    'ჩვენ ვახორციელებთ შესაბამის ტექნიკურ და ორგანიზაციულ ზომებს თქვენი პირადი ინფორმაციის დასაცავად არასანქცირებული წვდომის, ცვლილების, გამჟღავნების ან განადგურებისგან.',
  'privacy.rights.title': '7. თქვენი უფლებები',
  'privacy.rights.content':
    'თქვენ გაქვთ უფლება წვდომა, შესწორება ან წაშალოთ თქვენი პირადი ინფორმაცია. ასევე შეგიძლიათ გააპროტესტოთ დამუშავება ან მოითხოვოთ მონაცემთა პორტაბელურობა. დაგვიკავშირდით ამ უფლებების გამოსაყენებლად.',
  'privacy.children.title': '8. ბავშვთა კონფიდენციალურობა',
  'privacy.children.content':
    'ჩვენი სერვისები არ არის განკუთვნილი 16 წლამდე ბავშვებისთვის. ჩვენ შეგნებულად არ ვაგროვებთ პირად ინფორმაციას ბავშვებისგან. თუ გავიგებთ, რომ შევაგროვეთ ასეთი მონაცემები, წავშლით მას.',
  'privacy.changes.title': '9. პოლიტიკის ცვლილებები',
  'privacy.changes.content':
    'ჩვენ შეიძლება დროდადრო განვაახლოთ ეს კონფიდენციალურობის პოლიტიკა. ჩვენ შეგატყობინებთ ნებისმიერ არსებით ცვლილებებს ახალი პოლიტიკის ჩვენს ვებსაიტზე გამოქვეყნებით და "ბოლო განახლების" თარიღის განახლებით.',
  'privacy.contact.title': '10. დაგვიკავშირდით',
  'privacy.contact.content':
    'თუ გაქვთ შეკითხვები ამ კონფიდენციალურობის პოლიტიკასთან ან ჩვენს მონაცემთა პრაქტიკასთან დაკავშირებით, გთხოვთ დაგვიკავშირდეთ info@chikox.net-ზე.',

  // Contact Page
  'contact.title': 'დაგვიკავშირდით',
  'contact.subtitle': 'გაქვთ შეკითხვა ან გსურთ ჩვენთან თანამშრომლობა? გამოგვიგზავნეთ შეტყობინება!',
  'contact.name': 'სახელი',
  'contact.namePlaceholder': 'შეიყვანეთ თქვენი სახელი',
  'contact.email': 'ელ-ფოსტა',
  'contact.emailPlaceholder': 'შეიყვანეთ თქვენი ელ-ფოსტა',
  'contact.subject': 'თემა',
  'contact.subjectPlaceholder': 'შეიყვანეთ თემა',
  'contact.message': 'შეტყობინება',
  'contact.messagePlaceholder': 'შეიყვანეთ თქვენი შეტყობინება',
  'contact.send': 'შეტყობინების გაგზავნა',
  'contact.sending': 'იგზავნება...',
  'contact.success': 'თქვენი შეტყობინება წარმატებით გაიგზავნა. მალე დაგიკავშირდებით!',
  'contact.failed': 'შეტყობინების გაგზავნა ვერ მოხერხდა. გთხოვთ სცადოთ ხელახლა.',
  'contact.otherWays': 'დაკავშირების სხვა გზები',
  'contact.emailLabel': 'ელ-ფოსტა',
  'contact.phoneLabel': 'ტელეფონი',
  'contact.addressLabel': 'მისამართი',
  'contact.address': 'თბილისი, საქართველო'
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
