/** The API's password rule: 8 to 100 characters, at least 2 digits, no spaces. */
export const passwordProblem = (p: string): string | undefined => {
  if (p.length < 8) return "Password must be at least 8 characters";
  if (p.length > 100) return "Password must be at most 100 characters";
  if (/\s/.test(p)) return "Password cannot contain spaces";
  if ((p.match(/\d/g) || []).length < 2) return "Password must contain at least 2 numbers";
  return undefined;
};

export const PASSWORD_HINT = "At least 8 characters, including 2 numbers, no spaces.";
