export type Locale = "en" | "de" | "ru"

export type Messages = {
  meta: {
    title: string
  }
  language: {
    label: string
    en: string
    de: string
    ru: string
  }
  nav: {
    primary: string
    sections: string
    overview: string
    campaigns: string
    searchTerms: string
    decisions: string
    experiments: string
  }
  brand: {
    performance: string
  }
  feedback: {
    loading: string
    error: string
  }
  workspace: {
    label: string
    account: string
    sample: string
  }
  topbar: {
    environment: string
  }
  overview: {
    title: string
    subtitle: string
    vsPrior: string
  }
  kpi: {
    spend: string
    installs: string
    purchases: string
    revenue: string
    cpa: string
    roas: string
  }
  campaigns: {
    title: string
    summary: string
    searchPlaceholder: string
    searchLabel: string
    empty: string
    caption: string
    total: string
    columns: {
      campaign: string
      status: string
      spend: string
      installs: string
      purchases: string
      revenue: string
      cpa: string
      roas: string
    }
    status: {
      all: string
      Active: string
      Paused: string
      Learning: string
      Limited: string
    }
  }
  searchTerms: {
    title: string
    summary: string
    searchPlaceholder: string
    searchLabel: string
    empty: string
    caption: string
    columns: {
      term: string
      match: string
      campaign: string
      impressions: string
      installs: string
      purchases: string
      spend: string
      cpa: string
      signal: string
    }
    match: {
      Exact: string
      Broad: string
    }
    signal: {
      Scale: string
      Keep: string
      Negative: string
      Test: string
      "Add keyword": string
    }
  }
  decisions: {
    title: string
    summary: string
    empty: string
    day: string
    status: {
      Applied: string
      Pending: string
      Recommended: string
      Rejected: string
    }
  }
  experiments: {
    title: string
    step: string
    stage: {
      TEST: string
      MEASURE: string
      DECISION: string
      ACTION: string
    }
    summary: {
      TEST: string
      MEASURE: string
      DECISION: string
      ACTION: string
    }
    badge: {
      Running: string
      Stop: string
      Promote: string
      Live: string
      Queued: string
    }
  }
  footer: string
}
