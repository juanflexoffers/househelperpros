"use client";

import { useEffect } from "react";
import { captureFromUrl } from "../lib/clickid";

export default function ClickIdCapture() {
  useEffect(() => {
    captureFromUrl();
  }, []);
  return null;
}
