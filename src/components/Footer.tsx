import Link from "next/link";
import Image from "next/image";
import { nav, site, mailto } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-abyss pb-10 pt-24 text-foam">
      <Image
        src="/img/wc-kelp-fish.webp"
        alt=""
        width={800}
        height={1000}
        className="u-bob pointer-events-none absolute -right-10 bottom-0 w-[13rem] opacity-25 sm:w-[18rem]"
      />
      <div className="u-wrap relative grid gap-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <span className="u-mark w-20 text-aqua" aria-hidden="true" />
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
    </footer>
  );
}
