export type JsonCity = {
  id: number;
  name: string;
  latitude: string; // string in JSON
  longitude: string; // string in JSON
  timezone: string;
  wikiDataId?: string;
};

export type JsonState = {
  id: number;
  name: string;
  iso2: string;
  type?: string;
  cities: JsonCity[];
};

export type JsonCountry = {
  id: number;
  name: string;
  iso2: string;
  population: number;
  emoji?: string;
  states: JsonState[];
};

export type JsonCitySearchResult = {
  id: number;
  name: string;
  stateName: string;
  stateCode: string;
  stateType?: string;
  countryName: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  countryPopulation: number;
  emoji?: string;
  wikiDataId?: string;
};
