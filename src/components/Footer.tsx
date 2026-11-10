import Link from "next/link";
import Image from "next/image";
import { nav, site, mailto } from "@/lib/site";

/** How far the footer rises over the section above it, in px. */
const LIP = 64;

/**
 * The footer rises over the bottom of whatever section comes before it,
 * with a rounded shoulder on the left and a notch cut out of the top
 * right. The notch is genuinely empty, so the section above shows
 * through it on every page, and "Back to top" sits in that gap.
 *
 * The top edge is three pieces in a row: the dark shoulder, an S-curve
 * drawn in SVG at a fixed size (so it never stretches), and the empty
 * notch. Below them the body of the footer runs full width with its top
 * right corner rounded, picking up exactly where the curve lands.
 */
export default function Footer() {
  return (
    <footer className="relative text-foam" style={{ marginTop: -LIP }}>
      <div className="flex items-stretch" style={{ height: LIP }}>
        <div className="flex-1 rounded-tl-[2.75rem] bg-abyss" />
        <svg
          aria-hidden="true"
          viewBox="0 0 96 64"
          width="96"
          height={LIP}
          className="-ml-px block shrink-0 text-abyss"
          preserveAspectRatio="none"
        >
          <path d="M0 0C50 0 46 64 96 64H0Z" fill="currentColor" />
        </svg>
        <div className="flex w-[9.5rem] shrink-0 items-center justify-center sm:w-[12rem]">
          <a
            href="#main"
            className="flex items-center gap-2 text-[0.88rem] font-medium text-white mix-blend-difference"
          >
            Back to top <span aria-hidden="true">&uarr;</span>
          </a>
        </div>
      </div>

      <div className="relative -mt-px overflow-hidden rounded-tr-[2.75rem] bg-abyss pb-10 pt-12">
        <Image
          src="/img/wc-kelp-fish.webp"
          alt=""
          width={800}
          height={1000}
          className="u-bob pointer-events-none absolute -right-10 bottom-0 w-[13rem] opacity-25 sm:w-[18rem]"
        />
        <div className="u-wrap relative grid gap-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/logo-stacked-dark.png"
              alt="Jurassic Seafarms, finest quality oysters, Jurassic Coast, Dorset"
              width={624}
              height={700}
              className="h-auto w-[11rem]"
            />
            <p className="u-display mt-6 max-w-[16ch] text-[clamp(1.8rem,3.4vw,2.8rem)]">
              Harvesting the future.
            </p>
            <a href={mailto()} className="u-link mt-6 inline-block text-aqua">
              {site.email}
            </a>
          </div>

          <div>
            <p className="u-label text-kelp">The farm</p>
            <p className="mt-4">{site.farm}</p>
            <p className="u-label mt-8 text-kelp">Registered address</p>
            <address className="mt-4 not-italic leading-relaxed text-foam/80">
              {site.registered.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
          </div>

          <nav aria-label="Footer">
            <p className="u-label text-kelp">Around the farm</p>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-aqua">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="u-wrap relative mt-20 flex flex-col gap-2 border-t border-foam/15 pt-6 text-[0.78rem] text-foam/55 sm:flex-row sm:justify-between">
          <span>
            &copy; {site.name}. Pacific Oysters and Sugar Kelp from {site.farm}.
          </span>
          <span>{site.strapline}</span>
        </div>
      </div>
    </footer>
  );
}
