import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ClickCollect from "@/components/ClickCollect";
import { shop } from "@/lib/site";

export const metadata: Metadata = {
  title: shop.title,
  description: shop.lede,
};

export default function Page() {
  return (
    <>
      <PageHero
        label="Oysters and Sugar Kelp"
        title={shop.title}
        sub={shop.lede}
        image="/img/oysters-pile.jpg"
        alt="A heap of freshly lifted Pacific Oysters"
      />
      <ClickCollect />
    </>
  );
}
