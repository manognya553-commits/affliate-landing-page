/**
 * Submit contact form details.
 * Currently mocks network latency and returns a success response.
 * Replace this implementation with your actual backend endpoint or API when ready.
 *
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} payload.email
 * @param {string} payload.message
 * @param {string} [payload.honeypot]
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function submitContact(payload) {
  // If the honeypot field is filled, silently discard spam
  if (payload.honeypot) {
    console.warn('[submitContact] Honeypot field triggered. Discarding submission.')
    return { ok: true }
  }

  // Simulate realistic network roundtrip
  await new Promise((resolve) => setTimeout(resolve, 600))

  if (!payload.name?.trim() || !payload.email?.trim() || !payload.message?.trim()) {
    return { ok: false, error: 'Please fill in all required fields.' }
  }

  // Log mock payload for developer visibility
  console.info('[submitContact] Mock contact submission received:', {
    name: payload.name.trim(),
    email: payload.email.trim(),
    messageLength: payload.message.trim().length,
    timestamp: new Date().toISOString(),
  })

  return { ok: true }
}
