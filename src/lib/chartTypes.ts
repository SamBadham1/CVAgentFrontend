/** Chart.js config shape from generate_collection_chart — must match Backend/src/charts/types.ts */
export type ChartJsType = "bar" | "pie" | "doughnut" | "line";

export type ChartJsConfig = {
  type: ChartJsType;
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }>;
  };
  options?: {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    plugins?: {
      title?: { display?: boolean; text?: string; color?: string };
      legend?: {
        display?: boolean;
        position?: "top" | "bottom" | "left" | "right";
        labels?: { color?: string };
      };
    };
    scales?: Record<
      string,
      {
        beginAtZero?: boolean;
        ticks?: { precision?: number; color?: string };
        grid?: { color?: string };
      }
    >;
  };
};
