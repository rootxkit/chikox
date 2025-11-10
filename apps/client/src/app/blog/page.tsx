import Image from 'next/image';
import Link from 'next/link';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'Motor efficiency in high-speed drone racing',
      description:
        'Deep dive into brushless motor technologies and their impact on racing performance',
      category: 'Performance',
      readTime: '5 min read',
      image: 'https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg'
    },
    {
      id: 2,
      title: 'Motor efficiency in high-speed drone racing',
      description:
        'Deep dive into brushless motor technologies and their impact on racing performance',
      category: 'Performance',
      readTime: '5 min read',
      image: 'https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg'
    },
    {
      id: 3,
      title: 'Motor efficiency in high-speed drone racing',
      description:
        'Deep dive into brushless motor technologies and their impact on racing performance',
      category: 'Performance',
      readTime: '5 min read',
      image: 'https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg'
    },
    {
      id: 4,
      title: 'Motor efficiency in high-speed drone racing',
      description:
        'Deep dive into brushless motor technologies and their impact on racing performance',
      category: 'Performance',
      readTime: '5 min read',
      image: 'https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg'
    },
    {
      id: 5,
      title: 'Motor efficiency in high-speed drone racing',
      description:
        'Deep dive into brushless motor technologies and their impact on racing performance',
      category: 'Performance',
      readTime: '5 min read',
      image: 'https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg'
    },
    {
      id: 6,
      title: 'Motor efficiency in high-speed drone racing',
      description:
        'Deep dive into brushless motor technologies and their impact on racing performance',
      category: 'Performance',
      readTime: '5 min read',
      image: 'https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg'
    }
  ];

  return (
    <>
      {/* Preload images */}
      <link rel="preload" as="image" href="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg" />
      <link rel="preload" as="image" href="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg" />
      <link
        rel="preload"
        as="image"
        href="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
      />
      <link
        rel="preload"
        as="image"
        href="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
      />

      {/* Navbar */}
      <section className="relative z-[999] flex min-h-16 w-full items-center border-b border-border-primary bg-background-primary px-[5%] md:min-h-18">
        <div className="mx-auto flex size-full max-w-full items-center justify-between">
          <Link href="/">
            <Image
              src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
              alt="Logo image"
              width={120}
              height={40}
            />
          </Link>
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-5 py-2">
              Button
            </button>
            <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary bg-background-alternative text-text-alternative px-5 py-2">
              Button
            </button>
          </div>
          <button className="-mr-2 flex size-12 cursor-pointer flex-col items-center justify-center lg:hidden">
            <span className="my-[3px] h-0.5 w-6 bg-black"></span>
            <span className="my-[3px] h-0.5 w-6 bg-black"></span>
            <span className="my-[3px] h-0.5 w-6 bg-black"></span>
          </button>
        </div>
      </section>

      {/* Hero Section */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container flex max-w-lg flex-col">
          <div className="mb-12 text-center md:mb-18 lg:mb-20">
            <div className="w-full max-w-lg">
              <p className="mb-3 font-semibold md:mb-4">Blog</p>
              <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
                Short heading goes here
              </h1>
              <p className="md:text-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </div>
          <div className="flex flex-col justify-start">
            <div className="md:min-w- mb-10">
              <button
                type="button"
                className="flex min-h-11 w-full items-center justify-between gap-1 whitespace-nowrap border border-border-primary bg-transparent text-text-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-w-[12.5rem] px-4 py-2 md:w-auto"
              >
                All posts
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="0"
                  viewBox="0 0 15 15"
                  className="size-5 transition-transform duration-300"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:gap-y-16">
                <div className="flex flex-col border border-border-primary">
                  <Link href="#" className="inline-block w-full max-w-full overflow-hidden">
                    <div className="w-full overflow-hidden">
                      <Image
                        src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                        alt="Relume placeholder image"
                        width={800}
                        height={450}
                        className="aspect-video size-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="px-5 py-6 md:px-6">
                    <div className="rb-4 mb-4 flex w-full items-center justify-start">
                      <p className="mr-4 bg-background-secondary px-2 py-1 text-sm font-semibold">
                        Category
                      </p>
                      <p className="inline text-sm font-semibold">5 min read</p>
                    </div>
                    <Link href="#" className="mb-2 block max-w-full">
                      <h5 className="text-2xl font-bold md:text-4xl">
                        Blog title heading will go here
                      </h5>
                    </Link>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius
                      enim in eros.
                    </p>
                    <button className="focus-visible:ring-border-primary whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0 mt-6 flex items-center justify-center gap-x-2">
                      Read more
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
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Carousel Section */}
      <section className="overflow-hidden px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <div className="rb-12 mb-12 grid grid-cols-1 items-start justify-start gap-y-8 md:mb-18 md:grid-cols-[1fr_max-content] md:items-end md:justify-between md:gap-x-12 md:gap-y-4 lg:mb-20 lg:gap-x-20">
            <div className="md:mr-12 lg:mr-0">
              <div className="w-full max-w-lg">
                <p className="mb-3 font-semibold md:mb-4">Blog</p>
                <h2 className="mb-3 text-5xl font-bold md:mb-4 md:text-7xl lg:text-8xl">
                  Short heading goes here
                </h2>
                <p className="md:text-md">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </div>
            <div className="hidden md:flex">
              <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3">
                View all
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="flex size-full flex-col items-center justify-start border border-border-primary"
              >
                <Image
                  src={post.image}
                  alt="Relume placeholder image"
                  width={600}
                  height={400}
                  className="aspect-[3/2] size-full object-cover"
                />
                <div className="px-5 py-6 md:p-6">
                  <div className="rb-4 mb-3 flex w-full items-center justify-start md:mb-4">
                    <p className="mr-4 bg-background-secondary px-2 py-1 text-sm font-semibold">
                      {post.category}
                    </p>
                    <p className="inline text-sm font-semibold">{post.readTime}</p>
                  </div>
                  <h2 className="mb-2 text-xl font-bold md:text-2xl">{post.title}</h2>
                  <p>{post.description}</p>
                  <button className="focus-visible:ring-border-primary whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0 mt-5 flex items-center justify-center gap-x-2 md:mt-6">
                    Read more
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
          <div className="mt-12 flex justify-end md:hidden">
            <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3">
              View all
            </button>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-y-12 md:grid-cols-2 md:gap-x-12 lg:gap-x-20">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 py-2">
              <div className="flex self-start">
                <div className="mr-6 flex-none self-start">
                  <Image
                    src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                    className="size-12"
                    alt="Relume logo 1"
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <h1 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">Short heading here</h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim
                    in eros elementum tristique.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3">
                  Button
                </button>
                <button className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0">
                  Button
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
            <div>
              <Image
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                className="w-full object-cover"
                alt="Relume placeholder image"
                width={600}
                height={600}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-[5%] py-12 md:py-18 lg:py-20">
        <div className="container">
          <div className="grid grid-cols-1 items-start justify-between gap-x-[8vw] gap-y-12 pb-12 sm:gap-y-10 md:gap-y-14 md:pb-18 lg:grid-cols-[1fr_0.5fr] lg:pb-20">
            <div className="flex flex-col items-start">
              <Link href="#" className="mb-8">
                <Image
                  src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
                  alt="Logo image"
                  width={120}
                  height={40}
                  className="inline-block"
                />
              </Link>
              <ul className="grid grid-flow-row grid-cols-1 items-start justify-center justify-items-start gap-y-4 md:grid-flow-col md:grid-cols-[max-content] md:justify-start md:justify-items-start md:gap-x-6">
                <li className="font-semibold">
                  <Link href="#">Link One</Link>
                </li>
                <li className="font-semibold">
                  <Link href="#">Link Two</Link>
                </li>
                <li className="font-semibold">
                  <Link href="#">Link Three</Link>
                </li>
                <li className="font-semibold">
                  <Link href="#">Link Four</Link>
                </li>
                <li className="font-semibold">
                  <Link href="#">Link Five</Link>
                </li>
              </ul>
            </div>
            <div className="max-w-md lg:min-w-[25rem]">
              <p className="mb-3 font-semibold md:mb-4">Subscribe</p>
              <form className="mb-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[1fr_max-content] sm:gap-y-4 md:gap-4">
                <div className="relative flex w-full items-center">
                  <input
                    type="email"
                    className="flex size-full min-h-11 border border-border-primary bg-background-primary py-2 align-middle file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 px-3"
                    id="email"
                    placeholder="Enter your email"
                  />
                </div>
                <button className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-5 py-2">
                  Subscribe
                </button>
              </form>
              <p className="text-xs">By subscribing you agree to with our Privacy Policy</p>
            </div>
          </div>
          <div className="h-px w-full bg-black"></div>
          <div className="flex flex-col items-start justify-start pb-4 pt-6 text-sm md:flex-row md:items-center md:justify-between md:pb-0 md:pt-8 md:text-center">
            <ul className="grid grid-flow-row grid-cols-[max-content] gap-y-4 text-sm md:grid-flow-col md:gap-x-6 md:gap-y-0 lg:justify-center">
              <li className="underline decoration-black underline-offset-1">
                <Link href="#">Privacy Policy</Link>
              </li>
              <li className="underline decoration-black underline-offset-1">
                <Link href="#">Terms of Service</Link>
              </li>
              <li className="underline decoration-black underline-offset-1">
                <Link href="#">Cookies Settings</Link>
              </li>
            </ul>
            <p>© 2024 Relume. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
