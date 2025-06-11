export interface Dataset {
  id: string;
  name: string;
  data: any[];
  type: 'time_series' | 'categorical' | 'distribution' | 'generic' | 'uploaded' | 'generated';
  createdAt: string;
  updatedAt?: string;
  dataPoints?: number;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'scatter' | 'histogram';
  title: string;
  xAxis?: string;
  yAxis?: string;
  colors?: string[];
}

export type ViewType = 'dashboard' | 'charts' | 'data';