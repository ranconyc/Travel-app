"use client";

import { useEffect, useRef } from "react";
import { useCityActions } from "../store/useCityStore";
import { City } from "@/domain/city/city.schema";

export default function StoreInitializer({ city }: { city: City }) {
  const initialized = useRef(false);
  const { setCity } = useCityActions();

  if (!initialized.current) {
    setCity(city);
    initialized.current = true;
  }

  return null;
}
