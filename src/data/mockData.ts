import { Chat, HistoryItem, LawCategory, LawDocument } from '../types/models';

export const savedChats: Chat[] = [
  {
    id: '1',
    title: 'Contract Review Q&A',
    timestamp: '2 hours ago',
    messages: [
      {
        id: '1-1',
        type: 'user',
        content: 'What are the key clauses I should review in a vendor agreement?',
      },
      {
        id: '1-2',
        type: 'ai',
        content:
          'When reviewing a vendor agreement, focus on liability and indemnification, termination triggers, payment terms, intellectual property ownership, and confidentiality obligations.',
        citations: [
          { title: 'Commercial Contract Law 2024', fullCitation: 'UCC § 2-302 (Unconscionability)' },
          { title: 'Business Law Act 2023', fullCitation: 'Restatement (Second) of Contracts § 208' },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Non-Compete Clauses',
    timestamp: 'Yesterday',
    messages: [
      {
        id: '2-1',
        type: 'user',
        content: 'Are non-compete clauses enforceable in California?',
      },
      {
        id: '2-2',
        type: 'ai',
        content:
          'In California, non-compete clauses are generally void under Cal. Bus. & Prof. Code § 16600, with narrow exceptions such as sale-of-business situations.',
        citations: [
          { title: 'Labour Law 2025', fullCitation: 'Cal. Bus. & Prof. Code § 16600' },
          { title: 'Employment Rights Act 2024', fullCitation: 'Edwards v. Arthur Andersen LLP, 44 Cal.4th 937 (2008)' },
        ],
      },
    ],
  },
];

export const promptSuggestions = [
  'Summarize key points of a merger agreement',
  'Explain fiduciary duty in corporate law',
  'Find precedents on non-compete clauses',
  'Draft a confidentiality agreement outline',
];

export const historyItems: HistoryItem[] = [
  {
    id: '1',
    title: 'Contract Review Q&A',
    preview: 'Vendor agreement liability and termination clauses',
    date: 'Today',
    group: 'This Week',
  },
  {
    id: '2',
    title: 'Non-Compete Clauses',
    preview: 'California enforceability overview',
    date: 'Yesterday',
    group: 'This Week',
  },
  {
    id: '3',
    title: 'Trademark Registration',
    preview: 'Required filing steps for Cambodia',
    date: 'Mar 12',
    group: 'This Month',
  },
  {
    id: '4',
    title: 'Corporate Compliance',
    preview: 'Annual filing obligations checklist',
    date: 'Feb 10',
    group: 'Earlier',
  },
];

export const lawCategories: LawCategory[] = [
  { id: 'tax', icon: '💰', name: 'Tax Law', description: 'Taxation statutes and guidance', documentCount: 12 },
  {
    id: 'business-registration',
    icon: '🏢',
    name: 'Business Registration',
    description: 'Company formation and licenses',
    documentCount: 9,
  },
  { id: 'labour', icon: '👷', name: 'Labour Law', description: 'Employment and worker protections', documentCount: 10 },
  { id: 'finance', icon: '📈', name: 'Finance Law', description: 'Finance and securities regulations', documentCount: 7 },
  { id: 'banking', icon: '🏦', name: 'Banking Law', description: 'Banking operations and compliance', documentCount: 8 },
  { id: 'cdc', icon: '🌐', name: 'CDC', description: 'Council for Development of Cambodia', documentCount: 6 },
];

export const documentsByCategory: Record<string, LawDocument[]> = {
  tax: [
    {
      id: 'tax-1',
      title: 'Law on Taxation',
      subtitle: 'General tax framework and obligations',
      year: '2023',
      pages: 154,
      size: '2.4 MB',
      content:
        'Chapter 1: General Provisions\\n\\nArticle 1: Scope\\nThis law governs taxation obligations in the Kingdom.\\n\\nArticle 2: Taxpayer Duties\\nTaxpayers must maintain accurate records and timely filings.\\n\\nChapter 2: Corporate Income Tax\\nArticle 8: Tax Base and Deductions...',
    },
  ],
  'business-registration': [
    {
      id: 'biz-1',
      title: 'Enterprise Registration Guide',
      subtitle: 'Required steps and forms for registration',
      year: '2024',
      pages: 61,
      size: '1.1 MB',
      content:
        'Section 1: Legal Entity Types\\nSection 2: Name Reservation\\nSection 3: Licensing Requirements\\nSection 4: Post-registration compliance...',
    },
  ],
  labour: [
    {
      id: 'lab-1',
      title: 'Labour Code',
      subtitle: 'Employment rights and obligations',
      year: '2022',
      pages: 220,
      size: '3.0 MB',
      content:
        'Part I: Employment Contracts\\nPart II: Working Hours\\nPart III: Leave and Benefits\\nPart IV: Occupational Safety...',
    },
  ],
  finance: [
    {
      id: 'fin-1',
      title: 'Securities and Exchange Regulations',
      subtitle: 'Market integrity and disclosures',
      year: '2024',
      pages: 98,
      size: '1.8 MB',
      content: 'Title I: Market Conduct\\nTitle II: Issuer Disclosure\\nTitle III: Enforcement and Penalties...',
    },
  ],
  banking: [
    {
      id: 'bank-1',
      title: 'Banking Supervision Directive',
      subtitle: 'Prudential standards and risk controls',
      year: '2023',
      pages: 87,
      size: '1.5 MB',
      content:
        'Section A: Capital Adequacy\\nSection B: Liquidity Risk\\nSection C: Internal Controls\\nSection D: Reporting...',
    },
  ],
  cdc: [
    {
      id: 'cdc-1',
      title: 'Investment Project Procedures',
      subtitle: 'CDC approvals and incentives',
      year: '2024',
      pages: 72,
      size: '1.3 MB',
      content:
        'Article 1: Eligible Projects\\nArticle 2: Submission Requirements\\nArticle 3: Incentive Structure\\nArticle 4: Compliance Reviews...',
    },
  ],
};

export const citationDetails: Record<string, string> = {
  'UCC § 2-302 (Unconscionability)':
    'Uniform Commercial Code §2-302 allows courts to refuse enforcement of unconscionable contract terms when the terms are procedurally and substantively unfair.',
  'Restatement (Second) of Contracts § 208':
    'Section 208 permits a court to refuse an unconscionable contract or term, or limit application to avoid unconscionable results.',
  'Cal. Bus. & Prof. Code § 16600':
    'California Business and Professions Code §16600 renders restraints on lawful professions, trades, or business generally void.',
  'Edwards v. Arthur Andersen LLP, 44 Cal.4th 937 (2008)':
    'The California Supreme Court confirmed broad invalidity of non-compete clauses outside statutory exceptions.',
};
