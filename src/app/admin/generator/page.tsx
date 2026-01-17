"use client";

import React, { useState } from "react";
import { useGenerateCountry } from "@/domain/country/country.hooks";
import { useGenerateCity } from "@/domain/city/city.hooks";
import Button from "@/app/components/common/Button";
import Input from "@/app/components/form/Input";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { ActionResponse } from "@/types/actions";
import { GenerateCountryResult } from "@/domain/country/country.actions";
import { GenerateCityResult } from "@/domain/city/city.actions";

type GeneratedItem = {
  id: string;
  name: string;
  status: "success" | "error";
  message?: string;
  timestamp: Date;
};

export default function GeneratorPage() {
  const [generatorType, setGeneratorType] = useState<"country" | "city">(
    "country",
  );
  const [inputVal, setInputVal] = useState("");
  const [countryCodeVal, setCountryCodeVal] = useState("");
  const [history, setHistory] = useState<GeneratedItem[]>([]);

  const { mutate: mutateCountry, isPending: isPendingCountry } =
    useGenerateCountry();
  const { mutate: mutateCity, isPending: isPendingCity } = useGenerateCity();

  const isPending = isPendingCountry || isPendingCity;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    if (generatorType === "country") {
      mutateCountry(inputVal, {
        onSuccess: (res: ActionResponse<GenerateCountryResult>) => {
          if (res.success) {
            toast.success(`Generated ${res.data.name}`);
            setHistory((prev) => [
              {
                id: res.data.countryId || Math.random().toString(),
                name: res.data.name || inputVal,
                status: "success",
                timestamp: new Date(),
                message: res.data.created
                  ? "Created successfully"
                  : "Already exists",
              },
              ...prev,
            ]);
            setInputVal("");
          } else {
            toast.error(res.error || "Failed to generate");
            setHistory((prev) => [
              {
                id: Math.random().toString(),
                name: inputVal,
                status: "error",
                timestamp: new Date(),
                message: res.error,
              },
              ...prev,
            ]);
          }
        },
        onError: (err) => {
          toast.error(err.message || "Something went wrong");
          setHistory((prev) => [
            {
              id: Math.random().toString(),
              name: inputVal,
              status: "error",
              timestamp: new Date(),
              message: err.message,
            },
            ...prev,
          ]);
        },
      });
    } else {
      mutateCity(
        { cityName: inputVal, countryCode: countryCodeVal },
        {
          onSuccess: (res: ActionResponse<GenerateCityResult>) => {
            if (res.success) {
              toast.success(`Generated ${res.data.name}`);
              setHistory((prev) => [
                {
                  id: res.data.cityId || Math.random().toString(),
                  name: res.data.name || inputVal,
                  status: "success",
                  timestamp: new Date(),
                  message: res.data.created
                    ? "Created successfully"
                    : "Already exists",
                },
                ...prev,
              ]);
              setInputVal("");
              setCountryCodeVal("");
            } else {
              toast.error(res.error || "Failed to generate");
              setHistory((prev) => [
                {
                  id: Math.random().toString(),
                  name: inputVal,
                  status: "error",
                  timestamp: new Date(),
                  message: res.error,
                },
                ...prev,
              ]);
            }
          },
          onError: (err) => {
            toast.error(err.message || "Something went wrong");
            setHistory((prev) => [
              {
                id: Math.random().toString(),
                name: inputVal,
                status: "error",
                timestamp: new Date(),
                message: err.message,
              },
              ...prev,
            ]);
          },
        },
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold font-sora text-app-text mb-2">
          Data Generator
        </h1>
        <p className="text-secondary">
          Manually trigger the AI/API pipeline to fetch and generate country or
          city data.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-surface-secondary rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => setGeneratorType("country")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  generatorType === "country"
                    ? "bg-brand text-white"
                    : "bg-surface-secondary text-secondary hover:text-primary"
                }`}
              >
                Country
              </button>
              <button
                type="button"
                onClick={() => setGeneratorType("city")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  generatorType === "city"
                    ? "bg-brand text-white"
                    : "bg-surface-secondary text-secondary hover:text-primary"
                }`}
              >
                City
              </button>
            </div>

            <h2 className="text-lg font-semibold mb-4">
              Generate New {generatorType === "country" ? "Country" : "City"}
            </h2>
            <form onSubmit={handleGenerate} className="flex flex-col gap-4">
              <Input
                label={
                  generatorType === "country" ? "Country Name" : "City Name"
                }
                placeholder={
                  generatorType === "country"
                    ? "e.g. France, Japan..."
                    : "e.g. Paris, Tokyo, New York..."
                }
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                autoFocus
              />

              {generatorType === "city" && (
                <div>
                  <Input
                    label="Country Code (Optional)"
                    placeholder="e.g. FR, JP, US..."
                    value={countryCodeVal}
                    onChange={(e) => setCountryCodeVal(e.target.value)}
                  />
                  <p className="text-xs text-secondary mt-1">
                    Helps resolve ambiguity (e.g. Paris, TX vs Paris, FR)
                  </p>
                </div>
              )}

              <div className="flex justify-end mt-2">
                <Button
                  type="submit"
                  disabled={!inputVal.trim() || isPending}
                  loading={isPending}
                  variant="primary"
                  icon={
                    !isPending && (
                      <Loader2
                        size={16}
                        className={
                          isPending ? "animate-spin" : "opacity-0 hidden"
                        }
                      />
                    )
                  }
                >
                  {isPending
                    ? "Generating..."
                    : `Generate ${generatorType === "country" ? "Country" : "City"}`}
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* History Section */}
        <section className="bg-surface border border-surface-secondary rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
            <span>Recent Activity</span>
            <span className="text-xs bg-surface-secondary px-2 py-1 rounded-full text-secondary">
              Session
            </span>
          </h2>

          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-sm text-secondary italic text-center py-8 opacity-60">
                No countries generated yet in this session.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col p-3 rounded-lg bg-app-bg border border-surface-secondary animate-in fade-in slide-in-from-top-2 duration-300"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-app-text">
                        {item.name}
                      </span>
                      {item.status === "success" ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                      ) : (
                        <AlertCircle size={16} className="text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={
                          item.status === "success"
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        {item.message}
                      </span>
                      <span className="text-secondary opacity-60">
                        {item.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
