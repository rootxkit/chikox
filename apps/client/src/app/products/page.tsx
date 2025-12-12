'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Section from '@/components/Section';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import type { ProductDTO } from '@chikox/types';

export default function ProductsPage() {
  const [pricingTab, setPricingTab] = useState('monthly');
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.getProducts();
        if (response.success && response.data) {
          // Only show active products
          setProducts(response.data.filter((p) => p.isActive));
        } else {
          setError(response.error?.message || 'Failed to load products');
        }
      } catch {
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  const CheckIcon = () => (
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
      <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path>
    </svg>
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const pricingPlans = [
    {
      price: '$199',
      features: [
        'Flight controller base model',
        'Single motor configuration',
        'Standard frame support'
      ],
      button: 'Start building'
    },
    {
      price: '$499',
      features: [
        'Advanced flight controller',
        'Dual motor system',
        'Carbon fiber frame',
        'Extended battery management'
      ],
      button: 'Upgrade now'
    },
    {
      price: '$999',
      features: [
        'Custom flight controller',
        'Multi-motor configuration',
        'Advanced telemetry system',
        'Full sensor integration',
        'Professional support'
      ],
      button: 'Contact us'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <Section paddingVariant="large" horizontalPadding>
        <div className="max-w-lg text-center mx-auto">
          <p className="mb-3 font-semibold md:mb-4 text-accent">Tagline</p>
          <h1 className="mb-5 text-3xl font-bold sm:text-4xl md:mb-6 md:text-5xl lg:text-6xl">
            Short heading here
          </h1>
          <p className="md:text-md text-neutral">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros
            elementum tristique.
          </p>
          <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
            <button className="inline-flex gap-3 items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent text-text-alternative px-6 py-3 hover:bg-accent-hover">
              Button
            </button>
            <button className="inline-flex gap-3 items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-alternative px-6 py-3 hover:bg-background-secondary">
              Button
            </button>
          </div>
        </div>
      </Section>

      {/* Products Grid */}
      <Section paddingVariant="large" horizontalPadding>
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <h4 className="font-semibold text-accent">Our Collection</h4>
            <h1 className="mt-3 text-2xl font-bold sm:text-3xl md:mt-4 md:text-4xl lg:text-5xl">
              Products
            </h1>
            <p className="mt-5 text-base md:mt-6 md:text-md text-neutral">
              Browse our selection of high-quality products.
            </p>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 justify-items-start gap-x-5 gap-y-12 md:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:grid-cols-3 lg:gap-x-12">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="text-center font-semibold md:text-md hover:text-accent transition-colors w-full"
              >
                <div className="mb-3 aspect-[5/6] md:mb-4 bg-background-secondary">
                  <img
                    src={
                      product.images[0]?.url ||
                      'https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg'
                    }
                    alt={product.images[0]?.alt || product.name}
                    className="size-full object-cover"
                  />
                </div>
                <div className="mb-2">
                  <h3>{product.name}</h3>
                  {product.description && (
                    <div className="text-sm font-normal text-neutral line-clamp-2">
                      {product.description}
                    </div>
                  )}
                </div>
                <div className="text-md md:text-lg text-accent">{formatPrice(product.price)}</div>
                {product.stock === 0 && (
                  <div className="text-sm text-red-500 mt-1">Out of stock</div>
                )}
              </Link>
            ))}
          </div>
        )}
      </Section>

      {/* Content Section 1 */}
      <Section paddingVariant="large" horizontalPadding>
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:items-center md:gap-x-12 lg:gap-x-20">
          <div>
            <div className="rb-5 mb-5 md:mb-6">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                className="size-20"
                alt="Relume logo"
              />
            </div>
            <h2 className="rb-5 mb-5 text-2xl font-bold sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl">
              Medium length section heading goes here
            </h2>
            <p className="md:text-md text-neutral">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in
              eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum
              nulla, ut commodo diam libero vitae erat.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <button className="inline-flex gap-3 items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-alternative px-6 py-3 hover:bg-background-secondary">
                Button
              </button>
              <button className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-accent gap-2 p-0 hover:text-accent-hover">
                Button
                <ArrowIcon />
              </button>
            </div>
          </div>
          <div>
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
              className="w-full object-cover"
              alt="Relume placeholder image"
            />
          </div>
        </div>
      </Section>

      {/* Content Section 2 */}
      <Section paddingVariant="large" horizontalPadding>
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:items-center md:gap-x-12 lg:gap-x-20">
          <div className="order-2 md:order-1">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
              className="w-full object-cover"
              alt="Relume placeholder image"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="mb-3 font-semibold md:mb-4 text-accent">Tagline</p>
            <h2 className="rb-5 mb-5 text-2xl font-bold sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl">
              Medium length section heading goes here
            </h2>
            <p className="md:text-md text-neutral">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in
              eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum
              nulla, ut commodo diam libero vitae erat.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              <button className="inline-flex gap-3 items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-alternative px-6 py-3 hover:bg-background-secondary">
                Button
              </button>
              <button className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-accent gap-2 p-0 hover:text-accent-hover">
                Button
                <ArrowIcon />
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section paddingVariant="large" horizontalPadding>
        <div className="mb-12 md:mb-18 lg:mb-20">
          <h2 className="mb-5 text-2xl font-bold sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl">
            Customer testimonials
          </h2>
          <p className="md:text-md text-neutral">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex w-full flex-col items-start justify-between border border-border-primary p-6 md:p-8 hover:border-accent transition-colors">
            <div className="rb-5 mb-5 md:mb-6">
              <div className="mb-8 md:mb-10 lg:mb-12">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
                  alt="Webflow logo"
                  className="max-h-12"
                />
              </div>
              <blockquote className="md:text-md text-neutral">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in
                eros elementum tristique. Duis cursus, mi quis viverra ornare."
              </blockquote>
              <div className="mt-5 flex w-full flex-col items-start gap-4 md:mt-6 md:w-auto md:flex-row md:items-center">
                <div>
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Testimonial avatar"
                    className="size-12 min-h-12 min-w-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">Name Surname</p>
                  <p className="text-neutral">Position, Company name</p>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-8">
              <button className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-accent gap-2 p-0 hover:text-accent-hover hover:gap-3">
                Read case study
                <ArrowIcon />
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Pricing Section */}
      <Section paddingVariant="large" horizontalPadding>
        <div className="mx-auto mb-8 max-w-lg text-center md:mb-10 lg:mb-12">
          <p className="mb-3 font-semibold md:mb-4 text-accent">Tagline</p>
          <h1 className="mb-5 text-2xl font-bold sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl">
            Pricing plan
          </h1>
          <p className="md:text-md text-neutral">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <div>
          <div className="flex mx-auto mb-12 w-fit">
            <button
              onClick={() => setPricingTab('monthly')}
              className={`inline-flex items-center justify-center whitespace-nowrap border border-border-primary px-6 py-2 transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                pricingTab === 'monthly'
                  ? 'bg-accent text-text-alternative'
                  : 'bg-background-alternative text-text-primary hover:bg-background-secondary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPricingTab('yearly')}
              className={`inline-flex items-center justify-center whitespace-nowrap border border-border-primary px-6 py-2 transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                pricingTab === 'yearly'
                  ? 'bg-accent text-text-alternative'
                  : 'bg-background-alternative text-text-primary hover:bg-background-secondary'
              }`}
            >
              Yearly
            </button>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className="flex h-full flex-col justify-between border border-border-primary px-6 py-8 md:p-8 hover:border-accent transition-colors"
              >
                <div>
                  <div className="rb-4 mb-4 flex flex-col items-end justify-end">
                    <img
                      src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                      alt="Relume icon 1"
                      className="size-12"
                    />
                  </div>
                  <h3 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl text-accent">
                    {plan.price}
                  </h3>
                  <div className="my-8 h-px w-full shrink-0 bg-border-primary"></div>
                  <p>Includes</p>
                  <div className="mb-8 mt-4 grid grid-cols-1 gap-y-4 py-2">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex self-start">
                        <div className="mr-4 flex-none self-start text-accent">
                          <CheckIcon />
                        </div>
                        <p>{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <button className="inline-flex gap-3 items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent text-text-alternative px-6 py-3 w-full hover:bg-accent-hover">
                    {plan.button}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}
