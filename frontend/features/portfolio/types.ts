export interface PortfolioProjectItem {
  id: number;
  title: string;
  slug: string;
  problem_statement: string;
  tools_used: string[];
  solution_summary: string;
  impact_metrics: string;
  dataset_name: string;
  file_url?: string;
  featured: boolean;
  mission_slug?: string;
  company_name?: string;
  created_at: string;
}

export interface LearnerPortfolioData {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  headline: string;
  bio: string;
  city: string;
  country: string;
  github_url: string;
  linkedin_url: string;
  stats: {
    projects_count: number;
    certificates_count: number;
    badges_count: number;
  };
  projects: PortfolioProjectItem[];
  created_at: string;
}

