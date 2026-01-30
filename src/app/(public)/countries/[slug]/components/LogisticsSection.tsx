"use client";

import { Phone, Zap, Car, Clock } from "lucide-react";
import countryPlugs from "@/data/world/countryPlugs.json";
import { useCountry } from "../store/useCountryStore";
import { LogisticsData, PlugType, TimezoneInfo } from "@/types/logistics.types";
import { formatTimezones, getPlugTypes, formatPhoneNumber } from "@/utils/data-helpers";

interface LicensePlateProps {
  countryCode: string;
}

// Extend LogisticsData to include plugs for this component
interface ExtendedLogisticsData extends LogisticsData {
  plugs?: string[];
}

// Plug SVG Helper Component
const PlugSVG = ({ type }: { type: string }) => {
  const plugSVGs: Record<string, React.ReactNode> = {
    'A': (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect x="12" y="8" width="16" height="20" fill="none" stroke="currentColor" strokeWidth="2" rx="2"/>
        <rect x="16" y="4" width="8" height="6" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="20" cy="18" r="2" fill="currentColor"/>
      </svg>
    ),
    'B': (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect x="10" y="8" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" rx="2"/>
        <rect x="14" y="4" width="12" height="6" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="18" cy="18" r="2" fill="currentColor"/>
        <circle cx="22" cy="18" r="2" fill="currentColor"/>
      </svg>
    ),
    'C': (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="20" cy="20" r="4" fill="currentColor"/>
        <rect x="18" y="6" width="4" height="8" fill="currentColor"/>
      </svg>
    ),
    'D': (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect x="8" y="12" width="24" height="16" fill="none" stroke="currentColor" strokeWidth="2" rx="2"/>
        <circle cx="16" cy="20" r="2" fill="currentColor"/>
        <circle cx="24" cy="20" r="2" fill="currentColor"/>
        <rect x="12" y="8" width="16" height="6" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    'E': (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect x="10" y="8" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" rx="2"/>
        <circle cx="18" cy="18" r="2" fill="currentColor"/>
        <circle cx="22" cy="18" r="2" fill="currentColor"/>
        <rect x="16" y="4" width="8" height="6" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    'F': (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="20" cy="20" r="4" fill="currentColor"/>
        <rect x="18" y="6" width="4" height="8" fill="currentColor"/>
        <circle cx="14" cy="20" r="1.5" fill="currentColor"/>
        <circle cx="26" cy="20" r="1.5" fill="currentColor"/>
      </svg>
    ),
    'G': (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect x="12" y="8" width="16" height="20" fill="none" stroke="currentColor" strokeWidth="2" rx="2"/>
        <rect x="16" y="4" width="8" height="6" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="20" cy="18" r="2" fill="currentColor"/>
        <rect x="8" y="14" width="4" height="8" fill="currentColor"/>
      </svg>
    ),
    'H': (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect x="10" y="8" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" rx="2"/>
        <circle cx="18" cy="18" r="2" fill="currentColor"/>
        <circle cx="22" cy="18" r="2" fill="currentColor"/>
        <rect x="16" y="4" width="8" height="6" fill="none" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="26" width="4" height="4" fill="currentColor"/>
        <rect x="22" y="26" width="4" height="4" fill="currentColor"/>
      </svg>
    ),
    'I': (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect x="12" y="8" width="16" height="20" fill="none" stroke="currentColor" strokeWidth="2" rx="2"/>
        <circle cx="20" cy="18" r="2" fill="currentColor"/>
        <rect x="18" y="4" width="4" height="6" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    'J': (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect x="10" y="8" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" rx="2"/>
        <circle cx="18" cy="18" r="2" fill="currentColor"/>
        <circle cx="22" cy="18" r="2" fill="currentColor"/>
        <rect x="16" y="4" width="8" height="6" fill="none" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="26" width="4" height="4" fill="currentColor"/>
        <rect x="22" y="26" width="4" height="4" fill="currentColor"/>
      </svg>
    ),
    'K': (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect x="12" y="8" width="16" height="20" fill="none" stroke="currentColor" strokeWidth="2" rx="2"/>
        <circle cx="20" cy="18" r="2" fill="currentColor"/>
        <rect x="18" y="4" width="4" height="6" fill="none" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="26" width="4" height="4" fill="currentColor"/>
        <rect x="22" y="26" width="4" height="4" fill="currentColor"/>
      </svg>
    ),
    'L': (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect x="10" y="8" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" rx="2"/>
        <circle cx="18" cy="18" r="2" fill="currentColor"/>
        <circle cx="22" cy="18" r="2" fill="currentColor"/>
        <rect x="16" y="4" width="8" height="6" fill="none" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="26" width="4" height="4" fill="currentColor"/>
        <rect x="22" y="26" width="4" height="4" fill="currentColor"/>
      </svg>
    ),
    'M': (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect x="12" y="8" width="16" height="20" fill="none" stroke="currentColor" strokeWidth="2" rx="2"/>
        <circle cx="20" cy="18" r="2" fill="currentColor"/>
        <rect x="18" y="4" width="4" height="6" fill="none" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="26" width="4" height="4" fill="currentColor"/>
        <rect x="22" y="26" width="4" height="4" fill="currentColor"/>
      </svg>
    ),
    'N': (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect x="10" y="8" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" rx="2"/>
        <circle cx="18" cy="18" r="2" fill="currentColor"/>
        <circle cx="22" cy="18" r="2" fill="currentColor"/>
        <rect x="16" y="4" width="8" height="6" fill="none" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="26" width="4" height="4" fill="currentColor"/>
        <rect x="22" y="26" width="4" height="4" fill="currentColor"/>
      </svg>
    ),
    'O': (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="20" cy="20" r="4" fill="currentColor"/>
        <rect x="18" y="6" width="4" height="8" fill="currentColor"/>
        <circle cx="14" cy="20" r="1.5" fill="currentColor"/>
        <circle cx="26" cy="20" r="1.5" fill="currentColor"/>
      </svg>
    ),
  };

  return plugSVGs[type] || (
    <div className="w-8 h-8 flex items-center justify-center text-xs font-bold text-gray-600">
      {type}
    </div>
  );
};

// License Plate Component
const LicensePlate = ({ countryCode }: { countryCode: string }) => {
  // EU countries have blue strip on left
  const euCountries = ['DEU', 'FRA', 'ITA', 'ESP', 'NLD', 'BEL', 'AUT', 'PRT', 'GRC', 'SWE', 'FIN', 'DNK', 'POL', 'CZE', 'HUN', 'IRL', 'ROU', 'BGR', 'HRV', 'SVK', 'SVN', 'LTU', 'LVA', 'EST', 'CYP', 'MLT', 'LUX'];
  
  const isEU = euCountries.includes(countryCode);
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-12 h-6 rounded flex items-center justify-center text-xs font-bold ${isEU ? 'bg-blue-600 text-inverse' : 'bg-gray-200 text-gray-700'}`}>
        {isEU ? countryCode.slice(0, 2) : countryCode.slice(0, 3)}
      </div>
      <div className="flex-1 h-6 bg-white border-2 border-gray-300 rounded flex items-center px-2">
        <span className="text-xs font-mono text-gray-600">ABC-123</span>
      </div>
    </div>
  );
};

export default function LogisticsSection() {
  const country = useCountry();
  
  if (!country) return null;

  const data = country.logistics as ExtendedLogisticsData || {};
  const countryCode = country.code;

  // Format calling code using utility
  const callingCode = formatPhoneNumber(data.idd || {});
  
  // Format timezones using utility
  const formattedTimezones = formatTimezones(data.timezones);
  
  // Get plug types using utility
  const plugTypes = getPlugTypes(
    countryPlugs.countryPlugs,
    countryCode,
    data.plugs
  );

  // Final safety: Ensure arrays are not null/undefined before mapping
  const safeTimezones = Array.isArray(formattedTimezones) ? formattedTimezones : [];
  const safePlugTypes = Array.isArray(plugTypes) ? plugTypes : [];

  return (
    <div className="px-4 py-6 space-y-6 bg-surface rounded-3xl border border-surface-secondary">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-blue-500/10 p-2 rounded-full">
          <Zap className="w-6 h-6 text-blue-500" />
        </div>
        <h2 className="text-xl font-bold font-sora">Logistics</h2>
      </div>

      {/* Time Module */}
      <div className="bg-white dark:bg-surface-secondary/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Time</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {safeTimezones.map((tz, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-ui-sm text-gray-700 dark:text-gray-300">
                {tz}
              </span>
            ))}
          </div>
          
          <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
            <p className="text-caption dark:text-gray-400">
              <span className="font-medium">Start of the week:</span> {data.startOfWeek || 'Monday'}
            </p>
          </div>
        </div>
      </div>

      {/* Connectivity & Driving */}
      <div className="bg-white dark:bg-surface-secondary/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calling Code */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Calling Code</h3>
            </div>
            <p className="text-display-sm text-gray-900 dark:text-gray-100">
              {callingCode}
            </p>
          </div>

          {/* Driving Side & License Plate */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Car className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Driving</h3>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Drive on the <span className="font-medium">{data.car?.side || 'Right'}</span>
              </p>
              <LicensePlate countryCode={data.car?.signs?.[0] || 'USA'} />
            </div>
          </div>
        </div>
      </div>

      {/* Power Plugs - Hero Feature */}
      {plugTypes.length > 0 && (
        <div className="bg-white dark:bg-surface-secondary/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Power Plugs</h3>
            </div>
            <div className="flex items-center gap-1 text-caption dark:text-gray-400">
              <Car className="w-4 h-4" />
              <span>Drive on the {data.car?.side || 'Right'}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {safePlugTypes.map((plugType: string, index: number) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                  <PlugSVG type={plugType} />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Type {plugType}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
