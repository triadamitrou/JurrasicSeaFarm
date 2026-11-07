import type { Metadata } from "next";
import ProductPage from "@/components/ProductPage";
import { seaweed } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sugar Kelp",
  description: seaweed.lede,
};

export default function Page() {
  return <ProductPage p={seaweed} />;
}
