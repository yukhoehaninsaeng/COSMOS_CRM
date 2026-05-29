export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email
  return local.slice(0, 2) + '***@' + domain
}

export function maskPhone(phone: string): string {
  if (phone.length >= 10) {
    return phone.slice(0, 3) + '****' + phone.slice(-4)
  }
  return phone
}
