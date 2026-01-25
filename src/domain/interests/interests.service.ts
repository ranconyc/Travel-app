import INTERESTS from "@/data/interests.json";

type InterestItem = { id: string; label: string };
type Category = { id: string; label: string; items: InterestItem[] };
type InterestsData = Record<string, Category>;

const interestsData = INTERESTS as unknown as InterestsData;
interface CategoryMap {
  [categoryLabel: string]: string[]; // Category Name -> List of selected interest labels
}

/**
 * Formats a list of interest keys into their corresponding category labels.
 * @param selectedKeys Array of interest IDs (e.g., ['surfing', 'museums'])
 * @returns Array of unique category labels
 */
export const getCategoriesFromInterests = (
  selectedKeys: string[],
): string[] => {
  const categories = new Set<string>();

  // Iterate through each category in the JSON
  Object.values(interestsData).forEach((category) => {
    // Check if any of the category's items match the selected keys
    const hasMatch = category.items.some((item) =>
      selectedKeys.includes(item.id),
    );

    if (hasMatch) {
      categories.add(category.label);
    }
  });

  return Array.from(categories);
};

/**
 * Groups selected interest keys by their respective categories.
 * @param selectedKeys Array of interest IDs (e.g., ['surfing', 'museums', 'scuba_diving'])
 * @returns An object mapping category labels to arrays of interest labels
 */
export const getSelectedInterestsByCategory = (
  selectedKeys: string[],
): CategoryMap => {
  const result: CategoryMap = {};

  if (!selectedKeys || selectedKeys.length === 0) return result;

  // Iterate through each category in the JSON
  Object.values(interestsData).forEach((category) => {
    // Find items in this category that are present in the selectedKeys array
    const matchedItems = category.items
      .filter((item) => selectedKeys.includes(item.id))
      .map((item) => item.label);

    // If there are matches, add them to the result object under the category label
    if (matchedItems.length > 0) {
      result[category.label] = matchedItems;
    }
  });

  return result;
};

export const sortItems = (list: string[], type = "alphabet") => {
  if (type === "alphabet") {
    return list.sort((a, b) => a.localeCompare(b));
  }
  if (type === "charlength") {
    return list.sort((a, b) => a.length - b.length);
  } else {
    return list;
  }
};

export const getInterestLabel = (interestId: string) => {
  for (const catKey in interestsData) {
    const category = interestsData[catKey];
    const foundItem = category.items?.find((item) => item.id === interestId);
    if (foundItem) {
      return foundItem.label;
    }
  }
  return interestId;
};
