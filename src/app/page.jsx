import HomeClient from "@/components/home/HomeClient";

export default function Page() {
  // Server component wrapper keeps initial JS smaller
  return <HomeClient />;
}

