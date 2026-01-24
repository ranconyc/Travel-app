/**
 * Enhanced age calculation utility.
 * The absolute source of truth for age logic across the application.
 */
export function getAge(
  dateInput: string | Date | null | undefined,
): number | null {
  if (!dateInput) return null;

  const birthDate = new Date(dateInput);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // Enterprise sanity check: Age must be within realistic human bounds
  return age >= 0 && age < 120 ? age : null;
}
