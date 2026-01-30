"use client";

import { useEffect, useRef } from "react";
import { useCountryActions } from "../store/useCountryStore";
import { Country } from "@/domain/country/country.schema";

export default function StoreInitializer({ country }: { country: Country }) {
  const initialized = useRef(false);
  const { setCountry } = useCountryActions();

  if (!initialized.current) {
    setCountry(country);
    initialized.current = true;
  }

  return null;
}
