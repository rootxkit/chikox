import Image from 'next/image';
import Link from 'next/link';

// This would normally come from a database or CMS
interface BlogPost {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  publishedDate: string;
  image: string;
  author: {
    name: string;
    title: string;
    company: string;
    avatar: string;
  };
  tags: string[];
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // Mock data - in production this would be fetched from an API or database
  const post: BlogPost = {
    slug: params.slug,
    title: 'Blog title heading will go here',
    category: 'Category',
    readTime: '5 min read',
    publishedDate: '11 Jan 2022',
    image: 'https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg',
    author: {
      name: 'Full name',
      title: 'Job title',
      company: 'Company name',
      avatar:
        'https://cdn.prod.website-files.com/624380709031623bfe4aee60/6243807090316203124aee66_placeholder-image.svg'
    },
    tags: ['Tag one', 'Tag two', 'Tag three', 'Tag four']
  };

  const relatedPosts = [
    {
      id: 1,
      title: 'Pushing the limits of drone performance',
      description:
        'Discover how advanced engineering transforms aerial capabilities and flight dynamics',
      category: 'Technology',
      readTime: '5 min read',
      image: 'https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg'
    },
    {
      id: 2,
      title: 'Pushing the limits of drone performance',
      description:
        'Discover how advanced engineering transforms aerial capabilities and flight dynamics',
      category: 'Technology',
      readTime: '5 min read',
      image: 'https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg'
    },
    {
      id: 3,
      title: 'Pushing the limits of drone performance',
      description:
        'Discover how advanced engineering transforms aerial capabilities and flight dynamics',
      category: 'Technology',
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
        href="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
      />
      <link
        rel="preload"
        as="image"
        href="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
      />
      <link
        rel="preload"
        as="image"
        href="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
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

      {/* Blog Post Header */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <div className="grid gap-x-20 gap-y-12 md:grid-cols-[.5fr_1fr]">
            <div className="mx-auto flex size-full max-w-lg flex-col items-start justify-start">
              <div className="rb-12 flex flex-col items-start justify-start">
                <Link
                  href="/blog"
                  className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0 mb-6 md:mb-8"
                >
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
                      d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  All Posts
                </Link>
                <div className="rb-4 mb-5 flex w-full items-center justify-start md:mb-6">
                  <p className="mr-4 bg-background-secondary px-2 py-1 text-sm font-semibold">
                    {post.category}
                  </p>
                  <p className="inline text-sm font-semibold">{post.readTime}</p>
                </div>
                <h1 className="text-5xl font-bold md:text-7xl lg:text-8xl">{post.title}</h1>
                <div className="mt-6 flex size-full flex-col items-start md:mt-8">
                  <div className="rb-4 flex items-center sm:mb-8 md:mb-0">
                    <div className="mr-8 md:mr-10 lg:mr-12">
                      <p className="text-sm">Published on {post.publishedDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-auto w-full overflow-hidden">
              <Image
                src={post.image}
                className="aspect-[3/2] size-full object-cover"
                alt="Blog post image"
                width={800}
                height={533}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Post Content */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-lg">
            <div className="prose mb-12 md:prose-md lg:prose-lg md:mb-20">
              <h3>Introduction</h3>
              <p>
                Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi
                eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam
                enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt.
                At feugiat sapien varius id.
              </p>
              <p>
                Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat
                lectus velit, sed auctor. Porttitor fames arcu quis fusce augue enim. Quis at
                habitant diam at. Suscipit tristique risus, at donec. In turpis vel et quam
                imperdiet. Ipsum molestie aliquet sodales id est ac volutpat.
              </p>
              <figure>
                <Image
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                  alt="Article illustration"
                  width={800}
                  height={450}
                />
                <figcaption>Image caption goes here</figcaption>
              </figure>
              <h6>
                Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae.
                In aliquet pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor
                integer aliquam in vitae malesuada fringilla.
              </h6>
              <p>
                Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo
                consectetur convallis risus. Sed condimentum enim dignissim adipiscing faucibus
                consequat, urna. Viverra purus et erat auctor aliquam. Risus, volutpat vulputate
                posuere purus sit congue convallis aliquet. Arcu id augue ut feugiat donec porttitor
                neque. Mauris, neque ultricies eu vestibulum, bibendum quam lorem id. Dolor lacus,
                eget nunc lectus in tellus, pharetra, porttitor.
              </p>
              <blockquote>
                &quot;Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non
                pellentesque congue eget consectetur turpis. Sapien, dictum molestie sem tempor.
                Diam elit, orci, tincidunt aenean tempus.&quot;
              </blockquote>
              <p>
                Tristique odio senectus nam posuere ornare leo metus, ultricies. Blandit duis
                ultricies vulputate morbi feugiat cras placerat elit. Aliquam tellus lorem sed ac.
                Montes, sed mattis pellentesque suscipit accumsan. Cursus viverra aenean magna risus
                elementum faucibus molestie pellentesque. Arcu ultricies sed mauris vestibulum.
              </p>
              <h4>Conclusion</h4>
              <p>
                Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus id scelerisque est
                ultricies ultricies. Duis est sit sed leo nisl, blandit elit sagittis. Quisque
                tristique consequat quam sed. Nisl at scelerisque amet nulla purus habitasse.
              </p>
              <p>
                Nunc sed faucibus bibendum feugiat sed interdum. Ipsum egestas condimentum mi massa.
                In tincidunt pharetra consectetur sed duis facilisis metus. Etiam egestas in nec sed
                et. Quis lobortis at sit dictum eget nibh tortor commodo cursus.
              </p>
              <p>
                Odio felis sagittis, morbi feugiat tortor vitae feugiat fusce aliquet. Nam elementum
                urna nisi aliquet erat dolor enim. Ornare id morbi eget ipsum. Aliquam senectus
                neque ut id eget consectetur dictum. Donec posuere pharetra odio consequat
                scelerisque et, nunc tortor. Nulla adipiscing erat a erat. Condimentum lorem posuere
                gravida enim posuere cursus diam.
              </p>
            </div>
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div className="sm:max-w-1/2">
                <p className="font-semibold md:text-md">Share this post</p>
                <div className="mt-3 flex items-start gap-2 md:mt-4">
                  <a href="#" className="size-8 rounded-[1.25rem] bg-background-secondary p-1">
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
                      <path d="M4.222 19.778a4.983 4.983 0 0 0 3.535 1.462 4.986 4.986 0 0 0 3.536-1.462l2.828-2.829-1.414-1.414-2.828 2.829a3.007 3.007 0 0 1-4.243 0 3.005 3.005 0 0 1 0-4.243l2.829-2.828-1.414-1.414-2.829 2.828a5.006 5.006 0 0 0 0 7.071zm15.556-8.485a5.008 5.008 0 0 0 0-7.071 5.006 5.006 0 0 0-7.071 0L9.879 7.051l1.414 1.414 2.828-2.829a3.007 3.007 0 0 1 4.243 0 3.005 3.005 0 0 1 0 4.243l-2.829 2.828 1.414 1.414 2.829-2.828z"></path>
                      <path d="m8.464 16.95-1.415-1.414 8.487-8.486 1.414 1.415z"></path>
                    </svg>
                  </a>
                  <a href="#" className="size-8 rounded-[1.25rem] bg-background-secondary p-1">
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
                  <a href="#" className="size-8 rounded-[1.25rem] bg-background-secondary p-1">
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
                  <a href="#" className="size-8 rounded-[1.25rem] bg-background-secondary p-1">
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
                      <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 4.99 3.656 9.126 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891 1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12.001c0-5.522-4.477-9.999-9.999-9.999z"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div className="sm:max-w-1/2">
                <ul className="flex flex-wrap gap-2 sm:justify-end">
                  {post.tags.map((tag, index) => (
                    <li key={index} className="flex">
                      <a
                        href="#"
                        className="bg-background-secondary px-2 py-1 text-sm font-semibold"
                      >
                        {tag}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="my-8 h-px bg-border-primary md:my-12"></div>
            <div className="flex items-center gap-4">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={56}
                height={56}
                className="size-14 rounded-full object-cover"
              />
              <div className="grow">
                <p className="font-semibold md:text-md">{post.author.name}</p>
                <p>
                  {post.author.title}, {post.author.company}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-[5%] py-16 md:py-24 lg:py-28">
        <div className="container">
          <div className="mb-12 md:mb-18 lg:mb-20">
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Customer testimonials
            </h2>
            <p className="md:text-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex w-full flex-col items-start justify-between border border-border-primary p-6 md:p-8">
              <div className="rb-5 mb-5 md:mb-6">
                <div className="mb-8 md:mb-10 lg:mb-12">
                  <Image
                    src="https://d22po4pjz3o32e.cloudfront.net/webflow-logo.svg"
                    alt="Webflow logo"
                    width={120}
                    height={48}
                    className="max-h-12"
                  />
                </div>
                <blockquote className="md:text-md">
                  &quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius
                  enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.&quot;
                </blockquote>
                <div className="mt-5 flex w-full flex-col items-start gap-4 md:mt-6 md:w-auto md:flex-row md:items-center">
                  <div>
                    <Image
                      src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                      alt="Testimonial avatar"
                      width={48}
                      height={48}
                      className="size-12 min-h-12 min-w-12 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">Name Surname</p>
                    <p>Position, Company name</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-8">
                <button className="focus-visible:ring-border-primary inline-flex items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0 text-text-primary gap-2 p-0">
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
          </div>
        </div>
      </section>

      {/* Related Posts Section */}
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
              <Link
                href="/blog"
                className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {relatedPosts.map((relatedPost) => (
              <div
                key={relatedPost.id}
                className="flex size-full flex-col items-center justify-start border border-border-primary"
              >
                <Image
                  src={relatedPost.image}
                  alt="Related post image"
                  width={600}
                  height={400}
                  className="aspect-[3/2] size-full object-cover"
                />
                <div className="px-5 py-6 md:p-6">
                  <div className="rb-4 mb-3 flex w-full items-center justify-start md:mb-4">
                    <p className="mr-4 bg-background-secondary px-2 py-1 text-sm font-semibold">
                      {relatedPost.category}
                    </p>
                    <p className="inline text-sm font-semibold">{relatedPost.readTime}</p>
                  </div>
                  <h2 className="mb-2 text-xl font-bold md:text-2xl">{relatedPost.title}</h2>
                  <p>{relatedPost.description}</p>
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
            <Link
              href="/blog"
              className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3"
            >
              View all
            </Link>
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
