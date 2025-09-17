import { ProjectSubmission, ProjectStatus, ProjectType, BudgetRange } from '../types';

export const mockProjects: ProjectSubmission[] = [
  {
    id: 'proj_1',
    companyName: 'EcoTech Solutions',
    contactEmail: 'sarah@ecotech.com',
    contactPhone: '+1-555-0123',
    projectType: 'Sustainability Dashboard' as ProjectType,
    description: 'We need a comprehensive dashboard to track our carbon footprint, energy consumption, and waste reduction initiatives across our 15 office locations. The dashboard should provide real-time data visualization and automated reporting capabilities.',
    timeline: '3-4 months',
    budgetRange: '₱300,000 - ₱500,000' as BudgetRange,
    files: [
      {
        id: 'file_1',
        name: 'requirements-doc.pdf',
        size: 2547892,
        type: 'application/pdf',
        content: 'base64encodedcontent...',
        uploadedAt: new Date('2024-01-15T10:30:00Z')
      }
    ],
    status: 'In Progress' as ProjectStatus,
    submittedAt: new Date('2024-01-10T14:22:00Z'),
    lastUpdated: new Date('2024-01-20T09:15:00Z'),
    adminNotes: 'Initial requirements gathered. Design phase started.',
    estimatedCompletion: new Date('2024-04-15T00:00:00Z')
  },
  {
    id: 'proj_2',
    companyName: 'Green Minds NGO',
    contactEmail: 'contact@greenminds.org',
    contactPhone: '+1-555-0456',
    projectType: 'Website Development' as ProjectType,
    description: 'Complete website redesign for our environmental education non-profit. We need a modern, accessible site that showcases our programs, allows for online donations, and includes a blog section for our educational content.',
    timeline: '6-8 weeks',
    budgetRange: '₱150,000 - ₱300,000' as BudgetRange,
    files: [
      {
        id: 'file_2',
        name: 'current-site-analysis.docx',
        size: 1234567,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        content: 'base64encodedcontent...',
        uploadedAt: new Date('2024-01-12T16:45:00Z')
      },
      {
        id: 'file_3',
        name: 'brand-guidelines.png',
        size: 892456,
        type: 'image/png',
        content: 'base64encodedcontent...',
        uploadedAt: new Date('2024-01-12T16:47:00Z')
      }
    ],
    status: 'Under Review' as ProjectStatus,
    submittedAt: new Date('2024-01-12T16:30:00Z'),
    lastUpdated: new Date('2024-01-18T11:20:00Z'),
    adminNotes: 'Reviewing technical requirements and design preferences.',
    estimatedCompletion: new Date('2024-03-15T00:00:00Z')
  },
  {
    id: 'proj_3',
    companyName: 'Sustainable Corp',
    contactEmail: 'it@sustainablecorp.com',
    contactPhone: '+1-555-0789',
    projectType: 'Data Integration' as ProjectType,
    description: 'Integration of multiple sustainability data sources (energy monitoring systems, waste tracking, transportation logs) into a unified reporting platform for ESG compliance.',
    timeline: '4-6 months',
    budgetRange: 'Over ₱500,000' as BudgetRange,
    files: [],
    status: 'Pending Client Feedback' as ProjectStatus,
    submittedAt: new Date('2024-01-08T11:15:00Z'),
    lastUpdated: new Date('2024-01-22T14:30:00Z'),
    adminNotes: 'Proposal sent. Waiting for client feedback on technical specifications.',
    estimatedCompletion: new Date('2024-06-30T00:00:00Z')
  },
  {
    id: 'proj_4',
    companyName: 'Local Farmers Cooperative',
    contactEmail: 'admin@farmcoop.org',
    projectType: 'Custom Solution' as ProjectType,
    description: 'Custom inventory management system for organic produce tracking from farm to market, including sustainability metrics and certification tracking.',
    timeline: '2-3 months',
    budgetRange: 'Under ₱50,000' as BudgetRange,
    files: [
      {
        id: 'file_4',
        name: 'current-process-flow.jpg',
        size: 654321,
        type: 'image/jpeg',
        content: 'base64encodedcontent...',
        uploadedAt: new Date('2024-01-05T13:20:00Z')
      }
    ],
    status: 'Completed' as ProjectStatus,
    submittedAt: new Date('2024-01-05T13:00:00Z'),
    lastUpdated: new Date('2024-01-25T16:45:00Z'),
    adminNotes: 'Project completed successfully. Client training completed.',
    estimatedCompletion: new Date('2024-01-25T00:00:00Z')
  },
  {
    id: 'proj_5',
    companyName: 'Urban Planning Initiative',
    contactEmail: 'projects@urbanplanning.gov',
    contactPhone: '+1-555-0321',
    projectType: 'Website Development' as ProjectType,
    description: 'Public-facing portal for community members to submit sustainability ideas, track city environmental initiatives, and access educational resources about urban sustainability practices.',
    timeline: '8-10 weeks',
    budgetRange: '₱50,000 - ₱150,000' as BudgetRange,
    files: [],
    status: 'Submitted' as ProjectStatus,
    submittedAt: new Date('2024-01-25T09:30:00Z'),
    lastUpdated: new Date('2024-01-25T09:30:00Z'),
    adminNotes: 'Initial submission received. Scheduling discovery call.',
  },
  {
    id: 'proj_6',
    companyName: 'International Sustainable Technology Solutions & Environmental Consulting Corporation Ltd.',
    contactEmail: 'info@internationalsustainabletechnologysolutions.com',
    contactPhone: '+63-917-123-4567',
    projectType: 'Data Integration' as ProjectType,
    description: 'Complex enterprise-level sustainability data integration project requiring comprehensive dashboard development with real-time monitoring capabilities.',
    timeline: '4-6 months',
    budgetRange: '₱500,000+' as BudgetRange,
    files: [],
    status: 'Pending Client Feedback' as ProjectStatus,
    submittedAt: new Date('2024-01-28T14:30:00Z'),
    lastUpdated: new Date('2024-02-05T11:20:00Z'),
    adminNotes: 'Awaiting client feedback on proposed technical architecture and timeline adjustments.',
    estimatedCompletion: new Date('2024-07-30T00:00:00Z')
  }
];

export const projectTypes: ProjectType[] = [
  'Website Development',
  'Data Integration',
  'Sustainability Dashboard',
  'Custom Solution'
];

export const budgetRanges: BudgetRange[] = [
  'Under ₱50,000',
  '₱50,000 - ₱150,000',
  '₱150,000 - ₱300,000',
  '₱300,000 - ₱500,000',
  'Over ₱500,000'
];

export const projectStatuses: ProjectStatus[] = [
  'Submitted',
  'Under Review',
  'In Progress',
  'Pending Client Feedback',
  'Completed'
];