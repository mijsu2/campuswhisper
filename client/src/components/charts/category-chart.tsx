import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";
import { CATEGORIES } from "@/lib/constants";

interface CategoryChartProps {
  data: Record<string, number>;
}

export default function CategoryChart({ data }: CategoryChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const labels = CATEGORIES.map(cat => cat.name);
    const chartData = CATEGORIES.map(cat => data[cat.id] || 0);
    const colors = [
      "hsl(213, 100%, 45%)",
      "hsl(142, 76%, 36%)", 
      "hsl(262, 83%, 58%)",
      "hsl(25, 95%, 53%)",
      "hsl(0, 84%, 60%)"
    ];

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: chartData,
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                family: 'Inter, system-ui, sans-serif'
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b) => a + (b as number), 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="h-64">
      <canvas ref={chartRef} data-testid="chart-categories"></canvas>
    </div>
  );
}
