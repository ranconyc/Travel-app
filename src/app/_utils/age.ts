export function getAge(dateInput: string | Date | null | undefined) {
  if (!dateInput) return null;
  const today = new Date();
  const birthDate = new Date(dateInput);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
