export interface TeamMember {
  name: string;
  title: string;
  education: string[];
  experience: string;
  expertise: string;
  imageSeed: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  number: string;
  description: string[];
  iconName: 'FileSearch' | 'CheckCircle' | 'Factory' | 'TrendingUp';
}

export interface ClientCategory {
  category: string;
  clients: string[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface TimelineStep {
  id: number;
  title: string;
  description: string;
}