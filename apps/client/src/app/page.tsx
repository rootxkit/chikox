'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const StarIcon = () => (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      className="size-6"
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

  const testimonials = Array(6).fill({
    name: 'Michael Chen',
    position: 'Lead engineer, Aerial Research Labs',
    quote: "These components transformed our research drone's performance beyond expectations."
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="grid grid-cols-1 items-center gap-y-16 pt-16 md:pt-24 lg:grid-cols-2 lg:pt-0">
        <div className="order-2 lg:order-1">
          <img
            src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
            alt="Relume placeholder image"
            className="w-full object-cover lg:h-screen lg:max-h-[60rem]"
          />
        </div>
        <div className="order-1 mx-[5%] sm:max-w-md md:justify-self-start lg:order-2 lg:ml-20 lg:mr-[5vw]">
          <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
            Medium length hero heading goes here
          </h1>
          <p className="md:text-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros
            elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut
            commodo diam libero vitae erat.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
            <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary bg-background-alternative text-text-alternative px-6 py-3">
              Button
            </button>
            <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3">
              Button
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <div className="rb-12 mb-12 md:mb-18 lg:mb-20">
            <div className="mx-auto max-w-lg text-center">
              <p className="mb-3 font-semibold md:mb-4">Tagline</p>
              <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                Short heading goes here
              </h2>
              <p className="md:text-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
              {/* Large Feature Card */}
              <div className="grid grid-cols-1 border border-border-primary sm:col-span-2 sm:row-span-1 sm:grid-cols-2">
                <div className="flex flex-1 flex-col justify-center p-6">
                  <div>
                    <p className="mb-2 text-sm font-semibold">Tagline</p>
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
              <div className="flex flex-col border border-border-primary">
                <div className="flex flex-col justify-center p-6">
                  <div>
                    <p className="mb-2 text-sm font-semibold">Durability</p>
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

              <div className="flex flex-col border border-border-primary">
                <div className="flex flex-col justify-center p-6">
                  <div>
                    <p className="mb-2 text-sm font-semibold">Durability</p>
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
                    alt="Relume placeholder image 2"
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Services Section */}
      <section>
        <div className="sticky top-0">
          <div className="relative -top-32 h-0"></div>

          {/* Service 1 */}
          <div className="relative border-t border-border-primary bg-neutral-white pb-8 md:pb-14 lg:sticky lg:pb-0 top-0 lg:mb-32">
            <div className="px-[5%]">
              <div className="container">
                <Link href="#" className="flex h-16 w-full items-center underline">
                  <span className="mr-5 font-semibold md:mr-6 md:text-md">01</span>
                  <h1 className="font-semibold md:text-md">Custom builds</h1>
                </Link>
                <div className="py-8 md:py-10 lg:py-12">
                  <div className="grid grid-cols-1 gap-y-12 md:items-center md:gap-x-12 lg:grid-cols-2 lg:gap-x-20">
                    <div>
                      <p className="mb-3 font-semibold md:mb-4">Design</p>
                      <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                        Tailored drone solutions for your specific needs
                      </h2>
                      <p className="md:text-md">
                        Our expert team creates custom drone configurations that meet your unique
                        requirements. From research to racing, we build precision machines.
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                        <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3">
                          Get started
                        </button>
                        <button className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0">
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
          <div className="relative border-t border-border-primary bg-neutral-white pb-8 md:pb-14 lg:sticky lg:pb-0 lg:top-16 lg:-mt-16 lg:mb-16">
            <div className="px-[5%]">
              <div className="container">
                <Link href="#" className="flex h-16 w-full items-center underline">
                  <span className="mr-5 font-semibold md:mr-6 md:text-md">02</span>
                  <h1 className="font-semibold md:text-md">Repair services</h1>
                </Link>
                <div className="py-8 md:py-10 lg:py-12">
                  <div className="grid grid-cols-1 gap-y-12 md:items-center md:gap-x-12 lg:grid-cols-2 lg:gap-x-20">
                    <div>
                      <p className="mb-3 font-semibold md:mb-4">Design</p>
                      <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                        Tailored drone solutions for your specific needs
                      </h2>
                      <p className="md:text-md">
                        Our expert team creates custom drone configurations that meet your unique
                        requirements. From research to racing, we build precision machines.
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                        <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3">
                          Get started
                        </button>
                        <button className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0">
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
          <div className="relative border-t border-border-primary bg-neutral-white pb-8 md:pb-14 lg:sticky lg:pb-0 lg:top-32 lg:mb-16">
            <div className="px-[5%]">
              <div className="container">
                <Link href="#" className="flex h-16 w-full items-center underline">
                  <span className="mr-5 font-semibold md:mr-6 md:text-md">03</span>
                  <h1 className="font-semibold md:text-md">Technical consulting</h1>
                </Link>
                <div className="py-8 md:py-10 lg:py-12">
                  <div className="grid grid-cols-1 gap-y-12 md:items-center md:gap-x-12 lg:grid-cols-2 lg:gap-x-20">
                    <div>
                      <p className="mb-3 font-semibold md:mb-4">Design</p>
                      <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                        Tailored drone solutions for your specific needs
                      </h2>
                      <p className="md:text-md">
                        Our expert team creates custom drone configurations that meet your unique
                        requirements. From research to racing, we build precision machines.
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                        <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3">
                          Get started
                        </button>
                        <button className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0">
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
      </section>

      {/* Testimonials Carousel */}
      <section className="overflow-hidden px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <div className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Customer testimonials
            </h2>
            <p className="md:text-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="relative overflow-hidden">
            <div className="relative">
              <div className="flex ml-0 md:mx-3.5">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="min-w-0 shrink-0 grow-0 basis-full pl-0 md:basis-1/2 md:px-4 lg:basis-1/3"
                  >
                    <div className="flex w-full flex-col items-start justify-between border border-border-primary p-6 md:p-8">
                      <div className="mb-5 flex md:mb-6">
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                      </div>
                      <p className="md:text-md">{testimonial.quote}</p>
                      <div className="mt-5 flex w-full flex-col items-start gap-4 md:mt-6 md:w-auto md:flex-row md:items-center">
                        <div>
                          <img
                            src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                            alt="Testimonial avatar 1"
                            className="size-12 min-h-12 min-w-12 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p>{testimonial.position}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-[30px] flex items-center justify-center md:mt-[46px]">
              {[...Array(6)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className="mx-[3px] inline-block size-2 rounded-full bg-neutral-light"
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-y-12 md:grid-cols-2 md:gap-x-12 lg:gap-x-20">
            <div className="max-size-full order-last flex items-center justify-center overflow-hidden md:order-first">
              <div className={activeTab === 0 ? 'block' : 'hidden'}>
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Relume placeholder image 1"
                  className="size-full object-cover"
                />
              </div>
              <div className={activeTab === 1 ? 'block' : 'hidden'}>
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Relume placeholder image 2"
                  className="size-full object-cover"
                />
              </div>
              <div className={activeTab === 2 ? 'block' : 'hidden'}>
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Relume placeholder image 3"
                  className="size-full object-cover"
                />
              </div>
            </div>
            <div className="flex order-first flex-col gap-8 py-8 md:order-last md:py-0">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`inline-flex justify-center px-6 text-text-primary transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 flex-col items-start whitespace-normal border-0 border-l-2 bg-transparent py-0 pl-8 pr-0 text-left ${
                    activeTab === index
                      ? 'border-l-border-primary bg-transparent text-text-primary'
                      : 'border-transparent bg-transparent text-text-primary'
                  }`}
                >
                  <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
                    Precision engineering advantage
                  </h3>
                  <p>
                    Our components are designed with microscopic tolerances to deliver unparalleled
                    performance and reliability.
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
