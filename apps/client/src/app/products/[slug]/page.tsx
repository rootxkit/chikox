'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Section from '@/components/Section';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import type { ProductDTO } from '@chikox/types';

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [accordionOpen, setAccordionOpen] = useState<string | null>(null);
  const [pricingTab, setPricingTab] = useState('monthly');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.getProduct(resolvedParams.slug);
        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          setError(response.error?.message || 'Product not found');
        }
      } catch {
        setError('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.slug]);

  const images =
    product?.images && product.images.length > 0
      ? product.images.map((img) => img.url)
      : ['https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg'];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const StarIcon = ({ filled = true }: { filled?: boolean }) => (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      {filled ? (
        <path d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"></path>
      ) : (
        <path d="M5.025 20.775A.998.998 0 0 0 6 22a1 1 0 0 0 .555-.168L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082a1 1 0 0 0-.59-1.74l-5.701-.454-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.214 4.107-1.491 6.452zM12 5.429l2.042 4.521.588.047h.001l3.972.315-3.271 2.944-.001.002-.463.416.171.597v.003l1.253 4.385L12 15.798V5.429z"></path>
      )}
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

  const PlusIcon = () => (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="0"
      viewBox="0 0 15 15"
      className="size-6"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
        fill="currentColor"
      ></path>
    </svg>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center">
          <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
          <Link href="/products" className="text-accent hover:underline">
            Back to products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Product Header Section */}
      <header className="px-[5%] py-12 md:py-16 lg:py-20">
        <div className="container">
          <div className="grid grid-cols-1 gap-y-8 md:gap-y-10 lg:grid-cols-[1fr_1.25fr] lg:gap-x-20">
            <div>
              {/* Breadcrumb */}
              <nav aria-label="breadcrumb" className="mb-6 flex flex-wrap items-center text-sm">
                <ol className="flex flex-wrap items-center gap-1.5 break-words text-text-primary sm:gap-2">
                  <li className="inline-flex items-center gap-1.5">
                    <Link href="/products">Products</Link>
                  </li>
                  <li className="text-text-primary">
                    <ArrowIcon />
                  </li>
                  <li className="inline-flex items-center gap-1.5 text-neutral">{product.name}</li>
                </ol>
              </nav>

              {/* Product Info */}
              <div>
                <h1 className="mb-5 text-2xl font-bold leading-[1.2] sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl">
                  {product.name}
                </h1>
                <div className="mb-5 flex flex-col flex-wrap sm:flex-row sm:items-center md:mb-6">
                  <p className="text-xl font-bold md:text-2xl text-accent">
                    {formatPrice(product.price)}
                  </p>
                  <div className="mx-4 hidden w-px self-stretch bg-background-alternative sm:block"></div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-neutral">SKU: {product.sku}</span>
                    {product.stock > 0 ? (
                      <span className="text-sm text-green-600">{product.stock} in stock</span>
                    ) : (
                      <span className="text-sm text-red-500">Out of stock</span>
                    )}
                  </div>
                </div>
                {product.description && (
                  <p className="mb-5 md:mb-6 text-neutral">{product.description}</p>
                )}

                {/* Product Form */}
                <form className="mb-8">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col">
                      <label className="mb-2" htmlFor="quantity">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="flex min-h-11 border border-border-primary bg-background-primary py-2 px-3 w-24"
                        id="quantity"
                        min="1"
                        max={product.stock}
                        disabled={product.stock === 0}
                      />
                    </div>
                  </div>
                  <div className="mb-4 mt-8 flex flex-col gap-y-4">
                    <button
                      type="button"
                      disabled={product.stock === 0}
                      className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary bg-background-alternative text-text-alternative px-6 py-3"
                    >
                      Add to cart
                    </button>
                    <button
                      type="button"
                      disabled={product.stock === 0}
                      className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3"
                    >
                      Buy now
                    </button>
                  </div>
                  <p className="text-center text-xs text-neutral">Free shipping over $50</p>
                </form>

                {/* Accordion */}
                <div>
                  {['Details', 'Shipping', 'Returns'].map((item) => (
                    <div key={item} className="border-b border-border-primary first:border-t">
                      <button
                        onClick={() => setAccordionOpen(accordionOpen === item ? null : item)}
                        className="flex flex-1 items-center justify-between transition-all w-full py-4 font-semibold md:text-md"
                      >
                        {item}
                        <div
                          className={`transition-transform duration-300 ${
                            accordionOpen === item ? 'rotate-0' : ''
                          }`}
                        >
                          <PlusIcon />
                        </div>
                      </button>
                      {accordionOpen === item && (
                        <div className="pb-4">
                          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="order-first lg:order-none">
              <div className="flex flex-col gap-y-4">
                <div className="overflow-hidden">
                  <img
                    src={images[currentImageIndex]}
                    alt={`Product image ${currentImageIndex + 1}`}
                    className="aspect-[5/4] size-full object-cover"
                  />
                </div>
                <div className="hidden overflow-y-auto md:block">
                  <div className="flex -ml-4 gap-y-4">
                    {images.map((image, index) => (
                      <div key={index} className="min-w-0 shrink-0 grow-0 pl-4 basis-1/5">
                        <button
                          onClick={() => setCurrentImageIndex(index)}
                          className={`block ${currentImageIndex === index ? '' : 'opacity-60'}`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="aspect-[5/4] size-full object-cover"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid Section */}
      <Section paddingVariant="large" horizontalPadding>
        <div className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4 text-accent">Tagline</p>
          <h1 className="mb-5 text-2xl font-bold sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl">
            Short heading goes here
          </h1>
          <p className="md:text-md text-neutral">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <div className="grid auto-cols-fr grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          {/* Column 1 */}
          <div className="grid auto-cols-fr grid-cols-1 gap-6 md:gap-8">
            <div className="flex flex-col border border-border-primary sm:col-span-2">
              <div className="block flex-1 p-6 sm:flex sm:flex-col sm:justify-center md:p-8 lg:p-12">
                <p className="mb-2 font-semibold">Tagline</p>
                <h2 className="mb-5 text-2xl font-bold leading-[1.2] sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl">
                  Medium length section heading goes here
                </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim
                  in eros elementum tristique.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                  <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3">
                    Button
                  </button>
                  <button className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0">
                    Button
                    <ArrowIcon />
                  </button>
                </div>
              </div>
              <div className="flex w-full flex-col items-center justify-center self-start">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                  alt="Feature image"
                />
              </div>
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col border border-border-primary">
                <div className="flex h-full flex-col justify-between p-6 md:p-8 lg:p-6">
                  <div>
                    <div className="mb-3 md:mb-4">
                      <img
                        src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                        alt="Icon"
                        className="size-12"
                      />
                    </div>
                    <h3 className="mb-2 text-xl font-bold md:text-2xl">
                      Medium length section heading goes here
                    </h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                  <div className="mt-5 flex items-center gap-4 md:mt-6">
                    <button className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0">
                      Button
                      <ArrowIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="grid auto-cols-fr grid-cols-1 gap-6 md:gap-8">
            <div className="flex flex-col border border-border-primary sm:col-span-2 sm:grid sm:auto-cols-fr sm:grid-cols-2">
              <div className="flex size-full flex-col items-center justify-center self-start">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-portrait.svg"
                  alt="Feature image"
                />
              </div>
              <div className="block flex-col justify-center p-6 sm:flex">
                <p className="mb-2 font-semibold">Tagline</p>
                <h2 className="mb-2 text-xl font-bold md:text-2xl">
                  Medium length section heading goes here
                </h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <div className="mt-5 md:mt-6">
                  <button className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0">
                    Button
                    <ArrowIcon />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col border border-border-primary sm:col-span-2">
              <div className="block flex-1 p-6 sm:flex sm:flex-col sm:justify-center md:p-8 lg:p-12">
                <p className="mb-2 font-semibold">Tagline</p>
                <h2 className="mb-5 text-2xl font-bold leading-[1.2] sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl">
                  Medium length section heading goes here
                </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim
                  in eros elementum tristique.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                  <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3">
                    Button
                  </button>
                  <button className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0">
                    Button
                    <ArrowIcon />
                  </button>
                </div>
              </div>
              <div className="flex w-full flex-col items-center justify-center self-start">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                  alt="Feature image"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Content with Icon Section */}
      <Section paddingVariant="large" horizontalPadding>
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-x-20">
          <div className="order-2 md:order-1">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
              className="w-full object-cover"
              alt="Content image"
            />
          </div>
          <div className="order-1 md:order-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 py-2">
              <div className="flex self-start">
                <div className="mr-6 flex-none self-start">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                    className="size-12"
                    alt="Icon"
                  />
                </div>
                <div>
                  <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">Short heading here</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim
                    in eros elementum tristique.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3">
                Button
              </button>
              <button className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0">
                Button
                <ArrowIcon />
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section paddingVariant="large" horizontalPadding>
        <div className="grid grid-cols-1 gap-y-12 md:items-center md:gap-x-12 lg:grid-cols-2 lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold md:mb-4 text-accent">Tagline</p>
            <h2 className="mb-5 text-2xl font-bold sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl">
              Medium length section heading goes here
            </h2>
            <p className="md:text-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in
              eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum
              nulla, ut commodo diam libero vitae erat.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3">
                Button
              </button>
              <button className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0">
                Button
                <ArrowIcon />
              </button>
            </div>
          </div>
          <div className="grid w-full grid-cols-1 items-start justify-start gap-y-8 py-2 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:gap-x-8 lg:gap-y-12">
            <div className="w-full border-l-2 border-border-primary pl-8">
              <p className="mb-2 text-4xl font-bold leading-[1.3] sm:text-5xl md:text-6xl">50%</p>
              <h3 className="text-md font-bold leading-[1.4] md:text-xl">
                Short heading goes here
              </h3>
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section paddingVariant="large" horizontalPadding>
        <div className="mb-12 w-full md:mb-18 lg:mb-20">
          <h1 className="mb-5 text-2xl font-bold sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl">
            Customer testimonials
          </h1>
          <p className="md:text-md text-neutral">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-3 md:gap-x-8 lg:gap-x-12 lg:gap-y-16">
          <div className="flex h-full max-w-lg flex-col items-start justify-start text-left">
            <div className="mb-6 flex md:mb-8">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <blockquote className="text-md font-bold leading-[1.4] md:text-xl">
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in
              eros elementum tristique. Duis cursus, mi quis viverra ornare."
            </blockquote>
            <div className="mt-6 flex w-full flex-col md:mt-8 md:w-auto">
              <div className="mb-4">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt="Avatar"
                  className="size-14 min-h-14 min-w-14 rounded-full object-cover"
                />
              </div>
              <div className="mb-3 md:mb-4">
                <p className="font-semibold">Name Surname</p>
                <p>Position, Company name</p>
              </div>
              <div className="hidden w-px self-stretch bg-black md:block"></div>
              <div>
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
                  alt="Company logo"
                  className="max-h-12"
                />
              </div>
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
              className={`inline-flex items-center justify-center whitespace-nowrap border border-border-primary px-6 py-2 transition-all ${
                pricingTab === 'monthly'
                  ? 'bg-background-alternative text-text-alternative'
                  : 'bg-background-primary text-text-primary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPricingTab('yearly')}
              className={`inline-flex items-center justify-center whitespace-nowrap border border-border-primary px-6 py-2 transition-all ${
                pricingTab === 'yearly'
                  ? 'bg-background-alternative text-text-alternative'
                  : 'bg-background-primary text-text-primary'
              }`}
            >
              Yearly
            </button>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                price: '$19/mo',
                features: [
                  'Entry level flight controller',
                  'Standard motor set',
                  'Basic frame components'
                ]
              },
              {
                price: '$29/mo',
                features: [
                  'Advanced flight control system',
                  'High performance motors',
                  'Carbon fiber frame',
                  'Extended warranty'
                ]
              },
              {
                price: '$49/mo',
                features: [
                  'Custom flight computer',
                  'Professional grade motors',
                  'Specialized frame design',
                  'Priority technical support',
                  'Comprehensive integration'
                ]
              }
            ].map((plan, index) => (
              <div
                key={index}
                className="flex h-full flex-col justify-between border border-border-primary px-6 py-8 md:p-8"
              >
                <div>
                  <div className="mb-4 flex flex-col items-end justify-end">
                    <img
                      src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                      alt="Icon"
                      className="size-12"
                    />
                  </div>
                  <h3 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
                    {plan.price}
                  </h3>
                  <div className="my-8 h-px w-full shrink-0 bg-border"></div>
                  <p>Includes:</p>
                  <div className="mb-8 mt-4 grid grid-cols-1 gap-y-4 py-2">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex self-start">
                        <div className="mr-4 flex-none self-start">
                          <CheckIcon />
                        </div>
                        <p>{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary bg-background-alternative text-text-alternative px-6 py-3 w-full">
                    Get started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section paddingVariant="large" horizontalPadding>
        <div className="mb-12 max-w-lg md:mb-18 lg:mb-20">
          <h2 className="mb-5 text-2xl font-bold sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl">
            FAQs
          </h2>
          <p className="md:text-md text-neutral">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros
            elementum tristique.
          </p>
        </div>
        <div className="mt-12 md:mt-18 lg:mt-20">
          <h4 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
            Still have questions?
          </h4>
          <p className="md:text-md text-neutral">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <div className="mt-6 md:mt-8">
            <button className="inline-flex gap-3 items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-alternative px-6 py-3 hover:bg-background-secondary">
              Contact
            </button>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section paddingVariant="large" horizontalPadding>
        <div className="flex flex-col items-center border border-border-primary p-8 md:p-12 lg:p-16 hover:border-accent transition-colors">
          <div className="max-w-lg text-center">
            <h2 className="mb-5 text-2xl font-bold sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl">
              Medium length heading goes here
            </h2>
            <p className="md:text-md text-neutral">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in
              eros elementum tristique.
            </p>
          </div>
          <div className="mx-auto mt-6 max-w-sm md:mt-8">
            <form className="mb-4 grid max-w-sm grid-cols-1 gap-y-3 sm:grid-cols-[1fr_max-content] sm:gap-4">
              <input
                type="email"
                className="flex size-full min-h-11 border border-border-primary bg-background-primary py-2 px-3 placeholder:text-neutral focus-visible:outline-none"
                placeholder="Enter your email"
              />
              <button className="inline-flex gap-3 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent text-text-alternative items-center justify-center px-6 py-3 hover:bg-accent-hover">
                Sign up
              </button>
            </form>
            <p className="text-xs text-neutral">
              By clicking Sign Up you're confirming that you agree with our Terms and Conditions.
            </p>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}
