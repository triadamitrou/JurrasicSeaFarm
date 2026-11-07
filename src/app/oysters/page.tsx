import type { Metadata } from "next";
import ProductPage from "@/components/ProductPage";
import { oysters } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pacific Oysters",
  description: oysters.lede,
};

export default function Page() {
  return <ProductPage p={oysters} />;
}
