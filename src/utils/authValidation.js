/**
 * Validate login email and password fields.
 */
export function validateCredentials(email, password) {
  const nextErrors = {}
  const trimmedEmail = email.trim()

  if (!trimmedEmail) {
    nextErrors.email = 'Please enter your email ID.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    nextErrors.email = 'Please enter a valid email address.'
  }

  if (!password) {
    nextErrors.password = 'Please enter your password.'
  } else if (password.length < 6) {
    nextErrors.password = 'Password must be at least 6 characters.'
  }

  return nextErrors
}

