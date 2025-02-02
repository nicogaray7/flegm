// Validation d'email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validation de mot de passe
export function validatePassword(password: string): boolean {
  // Au moins 8 caractères, une majuscule, un chiffre, un caractère spécial
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

// Validation de nom
export function validateName(name: string): boolean {
  return name.length >= 2 && name.length <= 50;
} 