import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Full name',
      role: 'Job title',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
      image: 'https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg',
      linkedin: '#',
      twitter: '#',
      website: '#'
    }
    // Add more team members as needed
  ];

  const logos = [
    { src: 'https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg', alt: 'Webflow' },
    { src: 'https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg', alt: 'Relume' },
    { src: 'https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg', alt: 'Webflow' },
    { src: 'https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg', alt: 'Relume' },
    { src: 'https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg', alt: 'Webflow' },
    { src: 'https://d22po4pjz3o32e.cloudfront.net/relume-logo.svg', alt: 'Relume' }
  ];

  const testimonials = [
    {
      logo: 'https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg',
      quote:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.',
      avatar: 'https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg',
      name: 'Name Surname',
      position: 'Position, Company name'
    }
  ];

  const locations = [
    {
      name: 'Sydney',
      address: 'Level 3, 45 Miller Street, North Sydney NSW 2060',
      image: 'https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg'
    },
    {
      name: 'New York',
      address: 'Suite 1200, 350 Fifth Avenue, Manhattan NY 10118',
      image: 'https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container max-w-lg text-center mx-auto">
          <p className="mb-3 font-semibold md:mb-4 text-gray-600">About Us</p>
          <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
            Short heading here
          </h1>
          <p className="md:text-md text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros
            elementum tristique.
          </p>
          <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
            <button className="inline-flex items-center justify-center whitespace-nowrap border border-gray-900 bg-gray-900 text-white px-6 py-3 hover:bg-gray-800 transition-colors">
              Get Started
            </button>
            <button className="inline-flex items-center justify-center whitespace-nowrap border border-gray-300 bg-white text-gray-900 px-6 py-3 hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-gray-50">
        <div className="container max-w-lg text-center mx-auto">
          <div className="flex flex-col items-center justify-start">
            <div className="mb-5 md:mb-6">
              <Image
                src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                className="size-20"
                alt="Icon"
                width={80}
                height={80}
              />
            </div>
            <p className="mb-3 font-semibold md:mb-4 text-gray-600">Our Mission</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Medium length section heading goes here
            </h2>
            <p className="md:text-md text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in
              eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum
              nulla, ut commodo diam libero vitae erat.
            </p>
            <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
              <button className="inline-flex items-center justify-center whitespace-nowrap border border-gray-300 bg-white text-gray-900 px-6 py-3 hover:bg-gray-50 transition-colors">
                Learn More
              </button>
              <button className="inline-flex items-center justify-center whitespace-nowrap border-0 text-gray-900 gap-2 p-0 hover:gap-3 transition-all">
                Contact Us
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
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container mx-auto">
          <div className="mb-12 max-w-lg md:mb-18 lg:mb-20">
            <p className="mb-3 font-semibold md:mb-4 text-gray-600">Our Team</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Meet our team
            </h2>
            <p className="md:text-md text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col items-start">
                <div className="mb-5 md:mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="size-20 min-h-20 min-w-20 rounded-full object-cover"
                  />
                </div>
                <div className="mb-3 md:mb-4">
                  <h5 className="text-md font-semibold md:text-lg">{member.name}</h5>
                  <h6 className="md:text-md text-gray-600">{member.role}</h6>
                </div>
                <p className="text-gray-600">{member.description}</p>
                <div className="mt-6 flex gap-3.5">
                  <a href={member.linkedin} className="hover:opacity-70 transition-opacity">
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
                      <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.339 18.337H5.667v-8.59h2.672v8.59zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096zm11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z"></path>
                    </svg>
                  </a>
                  <a href={member.twitter} className="hover:opacity-70 transition-opacity">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 512 512"
                      className="size-6 p-0.5"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
                    </svg>
                  </a>
                  <a href={member.website} className="hover:opacity-70 transition-opacity">
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
                      <path d="M20.66 6.98a9.932 9.932 0 0 0-3.641-3.64C15.486 2.447 13.813 2 12 2s-3.486.447-5.02 1.34c-1.533.893-2.747 2.107-3.64 3.64S2 10.187 2 12s.446 3.487 1.34 5.02a9.924 9.924 0 0 0 3.641 3.64C8.514 21.553 10.187 22 12 22s3.486-.447 5.02-1.34a9.932 9.932 0 0 0 3.641-3.64C21.554 15.487 22 13.813 22 12s-.446-3.487-1.34-5.02zM12 3.66c2 0 3.772.64 5.32 1.919-.92 1.174-2.286 2.14-4.1 2.9-1.002-1.813-2.088-3.327-3.261-4.54A7.715 7.715 0 0 1 12 3.66zM5.51 6.8a8.116 8.116 0 0 1 2.711-2.22c1.212 1.201 2.325 2.7 3.34 4.5-2 .6-4.114.9-6.341.9-.573 0-1.006-.013-1.3-.04A8.549 8.549 0 0 1 5.51 6.8zM3.66 12c0-.054.003-.12.01-.2.007-.08.01-.146.01-.2.254.014.641.02 1.161.02 2.666 0 5.146-.367 7.439-1.1.187.373.381.793.58 1.26-1.32.293-2.674 1.006-4.061 2.14S6.4 16.247 5.76 17.5c-1.4-1.587-2.1-3.42-2.1-5.5zM12 20.34c-1.894 0-3.594-.587-5.101-1.759.601-1.187 1.524-2.322 2.771-3.401 1.246-1.08 2.483-1.753 3.71-2.02a29.441 29.441 0 0 1 1.56 6.62 8.166 8.166 0 0 1-2.94.56zm7.08-3.96a8.351 8.351 0 0 1-2.58 2.621c-.24-2.08-.7-4.107-1.379-6.081.932-.066 1.765-.1 2.5-.1.799 0 1.686.034 2.659.1a8.098 8.098 0 0 1-1.2 3.46zm-1.24-5c-1.16 0-2.233.047-3.22.14a27.053 27.053 0 0 0-.68-1.62c2.066-.906 3.532-2.006 4.399-3.3 1.2 1.414 1.854 3.027 1.96 4.84-.812-.04-1.632-.06-2.459-.06z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14 w-full max-w-md md:mt-20 lg:mt-24">
            <h4 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
              We&apos;re hiring!
            </h4>
            <p className="md:text-md text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <div className="mt-6 md:mt-8">
              <button className="inline-flex items-center justify-center whitespace-nowrap border border-gray-300 bg-white text-gray-900 px-6 py-3 hover:bg-gray-50 transition-colors">
                Open positions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="px-[5%] py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto">
          <h3 className="mx-auto mb-8 w-full max-w-lg text-center text-base font-bold leading-[1.2] md:mb-10 md:text-md md:leading-[1.2] lg:mb-12">
            Trusted by innovators across industries worldwide
          </h3>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex w-full items-start justify-center justify-self-center bg-gray-100 px-4 pb-4 pt-[0.875rem] md:p-[0.875rem]"
              >
                <Image
                  src={logo.src}
                  className="max-h-12 md:max-h-14"
                  alt={logo.alt}
                  width={120}
                  height={56}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container mx-auto">
          <div className="mb-12 md:mb-18 lg:mb-20">
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Customer testimonials
            </h2>
            <p className="md:text-md text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex w-full flex-col items-start justify-between border border-gray-200 p-6 md:p-8"
              >
                <div className="mb-5 md:mb-6 w-full">
                  <div className="mb-8 md:mb-10 lg:mb-12">
                    <Image
                      src={testimonial.logo}
                      alt="Company logo"
                      width={120}
                      height={48}
                      className="max-h-12"
                    />
                  </div>
                  <blockquote className="md:text-md text-gray-600">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <div className="mt-5 flex w-full flex-col items-start gap-4 md:mt-6 md:w-auto md:flex-row md:items-center">
                    <div>
                      <Image
                        src={testimonial.avatar}
                        alt="Avatar"
                        width={48}
                        height={48}
                        className="size-12 min-h-12 min-w-12 rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-gray-600">{testimonial.position}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 md:mt-8">
                  <button className="inline-flex items-center justify-center whitespace-nowrap border-0 text-gray-900 gap-2 p-0 hover:gap-3 transition-all">
                    Read case study
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
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-gray-50">
        <div className="container mx-auto">
          <div className="mb-12 mr-auto flex max-w-lg flex-col justify-start text-left md:mb-18 lg:mb-20">
            <p className="mb-3 font-semibold md:mb-4 text-gray-600">Locations</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">Our offices</h2>
            <p className="md:text-md text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div className="grid auto-cols-fr grid-cols-1 items-center gap-x-12 gap-y-12 md:grid-cols-2 md:gap-16">
            {locations.map((location, index) => (
              <div key={index} className="flex flex-col items-start justify-start text-left">
                <div className="mb-6 aspect-[3/2] w-full md:mb-8">
                  <Image
                    src={location.image}
                    className="h-full w-full object-cover"
                    alt={location.name}
                    width={600}
                    height={400}
                  />
                </div>
                <h3 className="mb-3 text-2xl font-bold leading-[1.4] md:text-3xl lg:mb-4 lg:text-4xl">
                  {location.name}
                </h3>
                <p className="text-gray-600">{location.address}</p>
                <div className="mt-5 md:mt-6">
                  <button className="inline-flex items-center justify-center whitespace-nowrap border-0 text-gray-900 gap-2 p-0 hover:gap-3 transition-all">
                    Get directions
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
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
