'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Section from '@/components/Section';
import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useLanguage();

  const StarIcon = () => (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      className="size-6 text-accent"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"></path>
    </svg>
  );

  const ArrowIcon = () => (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="0"
      viewBox="0 0 15 15"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
        fill="currentColor"
      ></path>
    </svg>
  );

  const testimonials = Array(6).fill(null);

  return (
    <div className="min-h-screen flex flex-col bg-background-primary text-text-primary">
      <Navbar />

      {/* Hero Section */}
      <Section id="hero">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="order-2 lg:order-1">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
              alt="Relume placeholder image"
              className="w-full object-cover rounded-lg aspect-video lg:aspect-square"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:mb-6 md:text-5xl lg:text-6xl xl:text-7xl">
              {t('hero.title')}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-neutral">{t('hero.description')}</p>
            <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
              <button className="inline-flex gap-2 items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent text-text-alternative px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold rounded hover:bg-accent-hover">
                {t('hero.getStarted')}
              </button>
              <button className="inline-flex gap-2 items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-transparent px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded hover:bg-background-alternative">
                {t('hero.learnMore')}
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Features Grid Section */}
      <Section id="features" background="primary">
        <div className="mb-8 md:mb-12 lg:mb-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold md:mb-3 text-accent">
              {t('features.tagline')}
            </p>
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:mb-5 md:text-4xl lg:text-5xl">
              {t('features.title')}
            </h2>
            <p className="text-sm sm:text-base text-neutral">{t('features.description')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {/* Large Feature Card */}
            <div className="grid grid-cols-1 border border-border-primary bg-background-alternative sm:col-span-2 sm:row-span-1 sm:grid-cols-2 hover:border-accent transition-colors">
              <div className="flex flex-1 flex-col justify-center p-6">
                <div>
                  <p className="mb-2 text-sm font-semibold text-accent">Tagline</p>
                  <h3 className="mb-2 text-xl font-bold md:text-2xl">
                    Medium length section heading goes here
                  </h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-4 md:mt-6">
                  <button className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0">
                    Button
                    <ArrowIcon />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-portrait.svg"
                  alt="Relume placeholder image 3"
                  className="size-full object-cover"
                />
              </div>
            </div>

            {/* Small Feature Cards */}
            <div className="flex flex-col border border-border-primary bg-background-alternative hover:border-accent transition-colors">
              <div className="flex flex-col justify-center p-6">
                <div>
                  <p className="mb-2 text-sm font-semibold text-accent">Durability</p>
                  <h3 className="mb-2 text-xl font-bold md:text-2xl">Robust drone frames</h3>
                  <p>Lightweight materials designed to withstand extreme flight conditions</p>
                </div>
                <div className="mt-5 flex items-center gap-4 md:mt-6">
                  <button className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0">
                    Explore design
                    <ArrowIcon />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                  alt="Relume placeholder image 1"
                  className="w-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col border border-border-primary bg-background-alternative hover:border-accent transition-colors">
              <div className="flex flex-col justify-center p-6">
                <div>
                  <p className="mb-2 text-sm font-semibold text-accent">Durability</p>
                  <h3 className="mb-2 text-xl font-bold md:text-2xl">Robust drone frames</h3>
                  <p className="text-neutral">
                    Lightweight materials designed to withstand extreme flight conditions
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-4 md:mt-6">
                  <button className="focus-visible:ring-accent inline-flex items-center justify-center whitespace-nowrap ring-offset-background-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-accent gap-2 p-0 hover:text-accent-light">
                    Explore design
                    <ArrowIcon />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                  alt="Relume placeholder image 2"
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Sticky Services Section */}
      <Section id="services" noPadding container={false}>
        <div className="sticky top-0">
          <div className="relative -top-32 h-0"></div>

          {/* Service 1 */}
          <div className="relative border-t border-border-primary bg-background-alternative pb-8 md:pb-14 lg:sticky lg:pb-0 top-0 lg:mb-32">
            <div className="px-[5%]">
              <div className="container">
                <Link
                  href="#"
                  className="flex h-16 w-full items-center underline decoration-accent"
                >
                  <span className="mr-5 font-semibold md:mr-6 md:text-md text-accent">01</span>
                  <h1 className="font-semibold md:text-md">Custom builds</h1>
                </Link>
                <div className="py-8 md:py-10 lg:py-12">
                  <div className="grid grid-cols-1 gap-y-12 md:items-center md:gap-x-12 lg:grid-cols-2 lg:gap-x-20">
                    <div>
                      <p className="mb-3 font-semibold md:mb-4 text-accent">Design</p>
                      <h2 className="rb-5 mb-5 text-2xl font-bold sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl">
                        Tailored drone solutions for your specific needs
                      </h2>
                      <p className="md:text-md">
                        Our expert team creates custom drone configurations that meet your unique
                        requirements. From research to racing, we build precision machines.
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                        <button className="focus-visible:ring-accent inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-background-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 bg-accent text-text-alternative px-6 py-3 font-semibold hover:bg-accent-hover">
                          Get started
                        </button>
                        <button className="focus-visible:ring-accent inline-flex items-center justify-center whitespace-nowrap ring-offset-background-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-accent gap-2 p-0 hover:text-accent-light">
                          Consult
                          <ArrowIcon />
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <img
                        src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-1.svg"
                        className="h-[25rem] w-full object-cover sm:h-[30rem] lg:h-[60vh]"
                        alt="Relume placeholder image 1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative -top-32 h-0"></div>

          {/* Service 2 */}
          <div className="relative border-t border-border-primary bg-background-secondary pb-8 md:pb-14 lg:sticky lg:pb-0 lg:top-16 lg:-mt-16 lg:mb-16">
            <div className="px-[5%]">
              <div className="container">
                <Link
                  href="#"
                  className="flex h-16 w-full items-center underline decoration-accent"
                >
                  <span className="mr-5 font-semibold md:mr-6 md:text-md text-accent">02</span>
                  <h1 className="font-semibold md:text-md">Repair services</h1>
                </Link>
                <div className="py-8 md:py-10 lg:py-12">
                  <div className="grid grid-cols-1 gap-y-12 md:items-center md:gap-x-12 lg:grid-cols-2 lg:gap-x-20">
                    <div>
                      <p className="mb-3 font-semibold md:mb-4 text-accent">Design</p>
                      <h2 className="rb-5 mb-5 text-2xl font-bold sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl">
                        Tailored drone solutions for your specific needs
                      </h2>
                      <p className="md:text-md">
                        Our expert team creates custom drone configurations that meet your unique
                        requirements. From research to racing, we build precision machines.
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                        <button className="focus-visible:ring-accent inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-background-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 bg-accent text-text-alternative px-6 py-3 font-semibold hover:bg-accent-hover">
                          Get started
                        </button>
                        <button className="focus-visible:ring-accent inline-flex items-center justify-center whitespace-nowrap ring-offset-background-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-accent gap-2 p-0 hover:text-accent-light">
                          Consult
                          <ArrowIcon />
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <img
                        src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-2.svg"
                        className="h-[25rem] w-full object-cover sm:h-[30rem] lg:h-[60vh]"
                        alt="Relume placeholder image 2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative -top-32 h-0"></div>

          {/* Service 3 */}
          <div className="relative border-t border-border-primary bg-background-alternative pb-8 md:pb-14 lg:sticky lg:pb-0 lg:top-32 lg:mb-16">
            <div className="px-[5%]">
              <div className="container">
                <Link
                  href="#"
                  className="flex h-16 w-full items-center underline decoration-accent"
                >
                  <span className="mr-5 font-semibold md:mr-6 md:text-md text-accent">03</span>
                  <h1 className="font-semibold md:text-md">Technical consulting</h1>
                </Link>
                <div className="py-8 md:py-10 lg:py-12">
                  <div className="grid grid-cols-1 gap-y-12 md:items-center md:gap-x-12 lg:grid-cols-2 lg:gap-x-20">
                    <div>
                      <p className="mb-3 font-semibold md:mb-4 text-accent">Design</p>
                      <h2 className="rb-5 mb-5 text-2xl font-bold sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl">
                        Tailored drone solutions for your specific needs
                      </h2>
                      <p className="md:text-md">
                        Our expert team creates custom drone configurations that meet your unique
                        requirements. From research to racing, we build precision machines.
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                        <button className="focus-visible:ring-accent inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-background-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 bg-accent text-text-alternative px-6 py-3 font-semibold hover:bg-accent-hover">
                          Get started
                        </button>
                        <button className="focus-visible:ring-accent inline-flex items-center justify-center whitespace-nowrap ring-offset-background-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-accent gap-2 p-0 hover:text-accent-light">
                          Consult
                          <ArrowIcon />
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <img
                        src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-3.svg"
                        className="h-[25rem] w-full object-cover sm:h-[30rem] lg:h-[60vh]"
                        alt="Relume placeholder image 3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section id="testimonials" background="primary">
        <div className="mx-auto mb-8 w-full max-w-2xl text-center md:mb-12 lg:mb-16">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:mb-5 md:text-4xl lg:text-5xl">
            {t('testimonials.title')}
          </h2>
          <p className="text-sm sm:text-base text-neutral">{t('testimonials.description')}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {testimonials.slice(0, 3).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-start justify-between border border-border-primary bg-background-alternative p-4 sm:p-6 rounded-lg hover:border-accent transition-colors"
            >
              <div className="mb-4 flex">
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </div>
              <p className="text-sm sm:text-base mb-4 flex-grow">{t('testimonials.quote')}</p>
              <div className="flex w-full items-center gap-3">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Testimonial avatar"
                  className="size-10 sm:size-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm sm:text-base">{t('testimonials.name')}</p>
                  <p className="text-xs sm:text-sm text-neutral">{t('testimonials.position')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Tabs Section */}
      <Section id="tabs" background="secondary">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-12">
          <div className="order-last flex items-center justify-center overflow-hidden md:order-first">
            <div className={activeTab === 0 ? 'block' : 'hidden'}>
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image 1"
                className="w-full object-cover rounded-lg"
              />
            </div>
            <div className={activeTab === 1 ? 'block' : 'hidden'}>
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image 2"
                className="w-full object-cover rounded-lg"
              />
            </div>
            <div className={activeTab === 2 ? 'block' : 'hidden'}>
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image 3"
                className="w-full object-cover rounded-lg"
              />
            </div>
          </div>
          <div className="flex order-first flex-col gap-4 sm:gap-6 md:order-last">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex flex-col items-start text-left transition-all focus-visible:outline-none border-l-2 pl-4 sm:pl-6 ${
                  activeTab === index
                    ? 'border-l-accent text-text-primary'
                    : 'border-transparent text-neutral hover:text-text-primary hover:border-l-neutral-light'
                }`}
              >
                <h3 className="mb-2 text-lg font-bold sm:text-xl md:text-2xl lg:text-3xl">
                  {t('tabs.title')}
                </h3>
                <p className="text-sm sm:text-base">{t('tabs.description')}</p>
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}
