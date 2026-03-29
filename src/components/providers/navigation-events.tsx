"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLoading } from "./loading-provider";

export function NavigationEvents() {
  const pathname = usePathname();
  const { stop } = useLoading();

  useEffect(() => {
    stop();
  }, [pathname, stop]);

  return null;
}
