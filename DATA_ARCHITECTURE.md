# Data Architecture & Schema Alignment

## 📋 Overview

This document outlines the cleaned-up data architecture where JSON files serve as the single source of truth for specific country data, eliminating redundancy between Prisma schema and frontend JSON files.

## 🗂️ JSON Data Files (Single Source of Truth)

### `/src/data/world/countryPlugs.json`
- **Purpose:** Electrical plug types by country (CCA3 codes)
- **Structure:** `{ "countryPlugs": { "USA": ["A", "B"], "THA": ["A", "B", "C"], ... } }`
- **Usage:** LogisticsSection component with fallback logic
- **Why JSON:** Easy to maintain, country-specific data that rarely changes

### `/src/data/world/countryBudgets.json`
- **Purpose:** Daily budget levels and tipping culture by country
- **Structure:** `{ "THA": { budget: 50, moderate: 100, luxury: 250, tip: "..." }, ... }`
- **Usage:** FinanceSection component for budget cards and tipping info
- **Why JSON:** Financial data that needs frequent updates without DB migrations

### `/src/data/world/visas.json`
- **Purpose:** Visa requirements and entry policies by country
- **Structure:** `{ "visaRequirements": { "USA": { type: "VisaFree", ... }, ... }, "defaultRequirement": { ... } }`
- **Usage:** VisaRequirement component for entry policy display
- **Why JSON:** Complex visa rules that change frequently based on international relations

### `/src/data/world/common_phrases.json`
- **Purpose:** Essential phrases by language code
- **Structure:** `{ "en": { phrases: [ { label: "Hello", ... } ] }, "th": { ... }, ... }`
- **Usage:** LanguageSection component for phrase learning
- **Why JSON:** Language-specific content that's independent of country data

## 🗄️ Prisma Schema (Cleaned)

### Country Model - Removed Fields:
```prisma
// ❌ REMOVED - Now in countryPlugs.json
// logistics.plugs: ["A", "B", "C"]

// ❌ REMOVED - Now in countryBudgets.json  
// Detailed budget data with daily amounts

// ❌ REMOVED - Now in visas.json
// visaInfo: { type, duration, cost, ... }

// ❌ REMOVED - Now in common_phrases.json
// commonPhrases: [{ label, local, category, ... }]
```

### Country Model - Kept Fields:
```prisma
// ✅ KEPT - Core country data
id, cca3, code, name, officialName, population, areaKm2
flags, borders, coords, maps, region, subRegion, capitalName

// ✅ KEPT - Basic logistics (excluding plugs)
logistics: {
  car: { side, signs },
  electricity: { voltage, frequency }, // plugs removed
  timezones, startOfWeek, emergency
}

// ✅ KEPT - Basic finance (excluding detailed budgets)
finance: {
  currency: { code, symbol, name },
  cashCulture: { tipping, atmAvailability, primaryPayment }
  // avgDailyCost kept for filtering/sorting
}

// ✅ KEPT - Language structure (excluding phrases)
languages: { official, spoken, nativeName, codes }

// ✅ KEPT - Other travel insights
safety, health, seasons, culture, emergency
```

## 🔄 Data Flow Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   JSON Files    │───▶│   Components     │───▶│    User UI      │
│ (Single Source) │    │ (Direct Import)  │    │   (Display)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌──────────────────┐            │
         │              │   Zustand Store   │            │
         │              │ (Country State)  │            │
         │              └──────────────────┘            │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Prisma DB     │───▶│   Server Pages   │───▶│   API Routes    │
│ (Core Data)     │    │ (Data Fetching)  │    │ (External APIs) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🎯 Benefits of This Architecture

### 1. **Single Source of Truth**
- JSON files are the definitive source for specific data types
- No duplication between DB and frontend
- Clear ownership: JSON for reference data, DB for dynamic data

### 2. **Performance Optimization**
- JSON files are bundled with the app (no DB queries)
- Instant access to reference data
- Reduced database load and query complexity

### 3. **Maintainability**
- Easy to update JSON files without DB migrations
- Git-tracked changes to reference data
- Simple structure for non-technical updates

### 4. **Scalability**
- JSON files can be cached aggressively
- DB focuses on dynamic/user-generated data
- Clear separation of concerns

## 📝 Component Usage Patterns

### LogisticsSection Component
```typescript
// Uses JSON for plug data with DB fallback
const countryPlugs = countryPlugsJson.countryPlugs[countryCode] || ["A", "B"];
const dbLogistics = country.logistics; // From DB
```

### FinanceSection Component  
```typescript
// Uses JSON for budget data with DB currency info
const budgetData = countryBudgetsJson[countryCode];
const currency = country.finance.currency; // From DB
```

### LanguageSection Component
```typescript
// Uses JSON for phrases with DB language info
const phrases = commonPhrasesJson[languageCode];
const languages = country.languages; // From DB
```

### VisaRequirement Component
```typescript
// Uses JSON for visa requirements
const visaInfo = visasJson.visaRequirements[countryCode] || visasJson.defaultRequirement;
```

## 🚀 Migration Benefits

### Before (Inconsistent):
- Prisma schema had `plugs`, `commonPhrases`, `visaInfo` fields
- Frontend also had separate JSON files
- Data could be different between DB and JSON
- Complex sync logic required

### After (Consistent):
- Prisma schema cleaned to remove redundant fields
- JSON files are the single source of truth
- Components have clear data sources
- No sync logic needed

## 📊 File Sizes & Performance

- `countryPlugs.json`: ~2KB (200 countries × 3 plug types avg)
- `countryBudgets.json`: ~8KB (200 countries × budget data)  
- `visas.json`: ~15KB (200 countries × visa requirements)
- `common_phrases.json`: ~25KB (50 languages × phrases)

**Total Bundle Impact:** ~50KB (gzipped ~15KB)
**Performance Gain:** Eliminated 4 DB queries per country page load

## 🔧 Maintenance Guidelines

### Adding New Countries:
1. Add to appropriate JSON files using CCA3 code
2. Ensure DB has basic country record
3. Components will automatically use new data

### Updating Data:
1. Edit JSON files directly
2. Changes are tracked in Git
3. Deploy updates - no DB migrations needed

### Data Validation:
1. JSON schemas can be added for validation
2. TypeScript interfaces provide type safety
3. Build process validates JSON structure
