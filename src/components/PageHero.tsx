import Image from "next/image";
import { Words, Reveal } from "./Reveal";

/**
 * The top of every inner page: one of their photographs full bleed,
 * darkened toward the harbour, the title set low and left.
 */
export default function PageHero({
  label,
  title,
  sub,
  image,
  alt,
  position = "center",
}: {
  label: string;
  title: string;
  sub?: React.ReactNode;
  image: string;
  alt: string;
  position?: string;
}) {
  return (
    <section className="relative flex min-h-[78svh] items-end overflow-hidden bg-abyss pb-14 pt-32 sm:pb-20">
      <Image
        src={image}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: position }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, var(--color-abyss) 0%, color-mix(in srgb, var(--color-abyss) 55%, transparent) 45%, color-mix(in srgb, var(--color-abyss) 25%, transparent) 100%)",
        }}
      />
      <div className="u-wrap relative">
        <Reveal as="p" mode="fade" className="u-label text-aqua">
          {label}
        </Reveal>
        <Words as="h1" text={title} className="u-display mt-4 max-w-[14ch] text-[clamp(3rem,9vw,7.5rem)]" />
        {sub ? (
          <Reveal mode="rise" delay={300} className="mt-5 max-w-[52ch] text-[clamp(1rem,1.3vw,1.2rem)] text-foam/90">
            {sub}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
