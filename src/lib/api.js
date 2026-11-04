/**
 * sBLOOM API Client
 * Connects frontend directly to Python FastAPI backend with cookie-based JWT sessions and CSRF protection.
 */

const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || ''

export class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  const headers = {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Client': 'sbloom-web',
    ...(options.headers || {}),
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(options.body)
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Ensures httpOnly JWT auth cookies are passed
  })

  let data = null
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json()
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    let errorDetail = data?.detail || data?.message || response.statusText || 'Request failed'
    if (typeof errorDetail === 'object' && errorDetail !== null) {
      if (Array.isArray(errorDetail)) {
        errorDetail = errorDetail.map((e) => (typeof e === 'object' && e?.msg ? e.msg : JSON.stringify(e))).join(', ')
      } else {
        errorDetail = JSON.stringify(errorDetail)
      }
    }
    throw new ApiError(errorDetail, response.status, data)
  }

  const totalCount = response.headers.get('x-total-count')
  if (Array.isArray(data) && totalCount !== null) {
    try {
      Object.defineProperty(data, 'totalCount', {
        value: parseInt(totalCount, 10),
        writable: true,
        enumerable: false,
      })
    } catch {
      // Ignore if object is not extensible
    }
  }

  return data
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),

  /**
   * Health & Latency Probe: measures real round-trip network response time.
   */
  checkHealth: async () => {
    const start = performance.now()
    try {
      const data = await request('/api/health', { method: 'GET' })
      const latencyMs = Math.round(performance.now() - start)
      return {
        online: true,
        latencyMs,
        db: data?.db || 'unknown',
        status: data?.status || 'ok',
        environment: data?.environment || 'development',
      }
    } catch (err) {
      const latencyMs = Math.round(performance.now() - start)
      return {
        online: false,
        latencyMs,
        db: 'unreachable',
        status: 'error',
        error: err.message,
      }
    }
  },

  // ---------------------------------------------------------------------------
  // Auth & Email Verification APIs
  // ---------------------------------------------------------------------------
  verifyEmail: (token) => api.post('/api/auth/verify-email', { token }),
  verifySelf: () => api.post('/api/auth/verify-self', {}),
  resendVerification: (email = null) => api.post('/api/auth/resend-verification', { email }),

  // ---------------------------------------------------------------------------
  // Affiliate Profile & Settlement APIs
  // ---------------------------------------------------------------------------
  getAffiliateProfile: () => api.get('/api/affiliate/profile'),
  updateAffiliateProfile: (data) => api.put('/api/affiliate/profile', data),
  submitAffiliateProfile: (data) => api.post('/api/affiliate/profile/submit', data),

  // ---------------------------------------------------------------------------
  // Providers Directory APIs (Public / Affiliate)
  // ---------------------------------------------------------------------------
  getProviders: (params = {}) => {
    const searchParams = new URLSearchParams()
    if (params.sector && params.sector !== 'all') searchParams.set('sector', params.sector)
    if (params.city) searchParams.set('city', params.city)
    if (params.search) searchParams.set('search', params.search)
    const qs = searchParams.toString()
    return api.get(`/api/public/providers${qs ? `?${qs}` : ''}`)
  },
  getProviderDetail: (id) => api.get(`/api/public/providers/${id}`),

  // ---------------------------------------------------------------------------
  // Affiliate Referral, Metric & Finance APIs
  // ---------------------------------------------------------------------------
  getAffiliateReferrals: (status = null) => {
    const query = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : ''
    return api.get(`/api/affiliate/referrals${query}`)
  },
  submitAffiliateReferral: (data) => api.post('/api/affiliate/referrals', data),
  getAffiliateMetrics: () => api.get('/api/affiliate/metrics'),
  getAffiliateFinanceSummary: () => api.get('/api/affiliate/finance/summary'),
  getAffiliateUninvoicedCommissions: () => api.get('/api/affiliate/finance/uninvoiced'),
  generateAffiliateInvoice: (data) => api.post('/api/affiliate/invoices/generate', data),
  getAffiliateInvoices: () => api.get('/api/affiliate/invoices'),
  getAffiliateInvoiceDetail: (invoiceId) => api.get(`/api/affiliate/invoices/${invoiceId}`),

  // ---------------------------------------------------------------------------
  // Admin Ecosystem & Referral Management APIs
  // ---------------------------------------------------------------------------
  getAdminSummary: (params = {}) => {
    const searchParams = new URLSearchParams()
    if (params.period) searchParams.set('period', params.period)
    if (params.start_date) searchParams.set('start_date', params.start_date)
    if (params.end_date) searchParams.set('end_date', params.end_date)
    const qs = searchParams.toString()
    return api.get(`/api/admin/summary${qs ? `?${qs}` : ''}`)
  },
  getAdminReferrals: (params = {}) => {
    const searchParams = new URLSearchParams()
    if (params.status && params.status !== 'all') searchParams.set('status', params.status)
    if (params.sector && params.sector !== 'all') searchParams.set('sector', params.sector)
    if (params.search) searchParams.set('search', params.search)
    if (params.limit) searchParams.set('limit', params.limit)
    if (params.offset) searchParams.set('offset', params.offset)
    const qs = searchParams.toString()
    return api.get(`/api/admin/referrals${qs ? `?${qs}` : ''}`)
  },
  getAdminReferralDetail: (leadId) => api.get(`/api/admin/referrals/${leadId}`),
  updateAdminReferralStatus: (leadId, data) => api.put(`/api/admin/referrals/${leadId}/status`, data),
  recordLeadConversion: (leadId, data) => api.post(`/api/admin/referrals/${leadId}/conversion`, data),
  getReferralsCsvUrl: (params = {}) => {
    const searchParams = new URLSearchParams()
    if (params.status && params.status !== 'all') searchParams.set('status', params.status)
    if (params.sector && params.sector !== 'all') searchParams.set('sector', params.sector)
    if (params.search) searchParams.set('search', params.search)
    const qs = searchParams.toString()
    return `/api/admin/referrals/export/csv${qs ? `?${qs}` : ''}`
  },

  // ---------------------------------------------------------------------------
  // Admin Affiliate Management APIs
  // ---------------------------------------------------------------------------
  getAdminAffiliates: (params = {}) => {
    const searchParams = new URLSearchParams()
    if (params.status && params.status !== 'all') searchParams.set('status', params.status)
    if (params.city) searchParams.set('city', params.city)
    if (params.verified) searchParams.set('verified', params.verified)
    if (params.search) searchParams.set('search', params.search)
    if (params.limit) searchParams.set('limit', params.limit)
    if (params.offset) searchParams.set('offset', params.offset)
    const qs = searchParams.toString()
    return api.get(`/api/admin/affiliates${qs ? `?${qs}` : ''}`)
  },
  getAdminAffiliateDetail: (userId) => api.get(`/api/admin/affiliates/${userId}`),
  getAffiliatesCsvUrl: (params = {}) => {
    const searchParams = new URLSearchParams()
    if (params.status && params.status !== 'all') searchParams.set('status', params.status)
    if (params.city) searchParams.set('city', params.city)
    const qs = searchParams.toString()
    return `/api/admin/affiliates/export/csv${qs ? `?${qs}` : ''}`
  },

  // ---------------------------------------------------------------------------
  // Admin Commission Agreements APIs
  // ---------------------------------------------------------------------------
  getAdminAgreements: (params = {}) => {
    const searchParams = new URLSearchParams()
    if (params.provider_id) searchParams.set('provider_id', params.provider_id)
    if (params.status && params.status !== 'all') searchParams.set('status', params.status)
    const qs = searchParams.toString()
    return api.get(`/api/admin/agreements${qs ? `?${qs}` : ''}`)
  },
  createAdminAgreement: (data) => api.post('/api/admin/agreements', data),
  updateAdminAgreement: (id, data) => api.put(`/api/admin/agreements/${id}`, data),
  updateAdminAgreementStatus: (id, status) => api.post(`/api/admin/agreements/${id}/status?status=${status}`),

  // ---------------------------------------------------------------------------
  // Admin Commission Ledger APIs
  // ---------------------------------------------------------------------------
  getAdminLedger: (params = {}) => {
    const searchParams = new URLSearchParams()
    if (params.provider_id) searchParams.set('provider_id', params.provider_id)
    if (params.affiliate_user_id) searchParams.set('affiliate_user_id', params.affiliate_user_id)
    if (params.status && params.status !== 'all') searchParams.set('status', params.status)
    const qs = searchParams.toString()
    return api.get(`/api/admin/ledger${qs ? `?${qs}` : ''}`)
  },
  updateAdminLedgerStatus: (id, status, notes = '') => {
    const qs = notes ? `&notes=${encodeURIComponent(notes)}` : ''
    return api.post(`/api/admin/ledger/${id}/status?status=${status}${qs}`)
  },
  getLedgerCsvUrl: (params = {}) => {
    const searchParams = new URLSearchParams()
    if (params.status && params.status !== 'all') searchParams.set('status', params.status)
    const qs = searchParams.toString()
    return `/api/admin/ledger/export/csv${qs ? `?${qs}` : ''}`
  },

  // ---------------------------------------------------------------------------
  // Admin Financial Dashboard APIs
  // ---------------------------------------------------------------------------
  getAdminFinanceSummary: () => api.get('/api/admin/finance/summary'),

  // ---------------------------------------------------------------------------
  // Admin Provider Invoices (sBLOOM Bills Provider)
  // ---------------------------------------------------------------------------
  getAdminProviderInvoices: (params = {}) => {
    const searchParams = new URLSearchParams()
    if (params.provider_id) searchParams.set('provider_id', params.provider_id)
    if (params.status && params.status !== 'all') searchParams.set('status', params.status)
    const qs = searchParams.toString()
    return api.get(`/api/admin/invoices/provider${qs ? `?${qs}` : ''}`)
  },
  createAdminProviderInvoice: (data) => api.post('/api/admin/invoices/provider', data),
  getAdminProviderInvoiceDetail: (id) => api.get(`/api/admin/invoices/provider/${id}`),
  recordProviderPayment: (id, data) => api.post(`/api/admin/invoices/provider/${id}/payments`, data),
  cancelProviderInvoice: (id, reason) => api.post(`/api/admin/invoices/provider/${id}/cancel`, { reason }),

  // ---------------------------------------------------------------------------
  // Admin Affiliate Invoices (Affiliates Bill sBLOOM)
  // ---------------------------------------------------------------------------
  getAdminAffiliateInvoices: (params = {}) => {
    const searchParams = new URLSearchParams()
    if (params.affiliate_user_id) searchParams.set('affiliate_user_id', params.affiliate_user_id)
    if (params.status && params.status !== 'all') searchParams.set('status', params.status)
    const qs = searchParams.toString()
    return api.get(`/api/admin/invoices/affiliate${qs ? `?${qs}` : ''}`)
  },
  getAdminAffiliateInvoiceDetail: (id) => api.get(`/api/admin/invoices/affiliate/${id}`),
  approveAdminAffiliateInvoice: (id, adminNotes = null) => api.post(`/api/admin/invoices/affiliate/${id}/approve`, { admin_notes: adminNotes }),
  rejectAdminAffiliateInvoice: (id, reason) => api.post(`/api/admin/invoices/affiliate/${id}/reject`, { reason }),
  recordAdminAffiliatePayout: (id, data) => api.post(`/api/admin/invoices/affiliate/${id}/payout`, data),

  // ---------------------------------------------------------------------------
  // Admin Provider Management APIs
  // ---------------------------------------------------------------------------
  getAdminProviders: (params = {}) => {
    const searchParams = new URLSearchParams()
    if (params.sector && params.sector !== 'all') searchParams.set('sector', params.sector)
    if (params.status) searchParams.set('status', params.status)
    if (params.search) searchParams.set('search', params.search)
    const qs = searchParams.toString()
    return api.get(`/api/admin/providers${qs ? `?${qs}` : ''}`)
  },
  createAdminProvider: (data) => api.post('/api/admin/providers', data),
  getAdminProviderDetail: (id) => api.get(`/api/admin/providers/${id}`),
  updateAdminProvider: (id, data) => api.put(`/api/admin/providers/${id}`, data),
  toggleAdminProviderActive: (id) => api.post(`/api/admin/providers/${id}/toggle-active`),

  // Provider Services Sub-Resource APIs (Admin)
  getAdminProviderServices: (providerId) => api.get(`/api/admin/providers/${providerId}/services`),
  createAdminProviderService: (providerId, data) => api.post(`/api/admin/providers/${providerId}/services`, data),
  updateAdminProviderService: (providerId, serviceId, data) => api.put(`/api/admin/providers/${providerId}/services/${serviceId}`, data),
  toggleAdminProviderServiceActive: (providerId, serviceId) => api.post(`/api/admin/providers/${providerId}/services/${serviceId}/toggle-active`),
  deleteAdminProviderService: (providerId, serviceId) => api.delete(`/api/admin/providers/${providerId}/services/${serviceId}`),

  // ---------------------------------------------------------------------------
  // Admin Affiliate Governance APIs
  // ---------------------------------------------------------------------------
  getAdminApprovals: (status = null) => {
    const query = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : ''
    return api.get(`/api/admin/approvals${query}`)
  },
  getAdminApprovalDetail: (userId) => api.get(`/api/admin/approvals/${userId}`),
  approveAffiliate: (userId) => api.post(`/api/admin/approvals/${userId}/approve`),
  rejectAffiliate: (userId, reason) => api.post(`/api/admin/approvals/${userId}/reject`, { reason }),
  requestAffiliateInfo: (userId, note) => api.post(`/api/admin/approvals/${userId}/request-info`, { note }),
  suspendAffiliate: (userId, reason) => api.post(`/api/admin/approvals/${userId}/suspend`, { reason }),
  reinstateAffiliate: (userId) => api.post(`/api/admin/approvals/${userId}/reinstate`),
  getAdminAuditLogs: (limit = 50) => api.get(`/api/admin/audit-logs?limit=${limit}`),
}
