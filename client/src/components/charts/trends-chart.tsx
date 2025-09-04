import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";

interface TrendsChartProps {
  submissionsData: number[];
  resolvedData: number[];
  labels: string[];
}

export default function TrendsChart({ submissionsData, resolvedData, labels }: TrendsChartProps) {
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

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Submissions',
          data: submissionsData,
          borderColor: 'hsl(213, 100%, 45%)',
          backgroundColor: 'hsl(213, 100%, 45%, 0.1)',
          tension: 0.4,
          fill: true
        }, {
          label: 'Resolved',
          data: resolvedData,
          borderColor: 'hsl(142, 76%, 36%)',
          backgroundColor: 'hsl(142, 76%, 36%, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                family: 'Inter, system-ui, sans-serif'
              }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'hsl(214.3, 31.8%, 91.4%)'
            }
          },
          x: {
            grid: {
              color: 'hsl(214.3, 31.8%, 91.4%)'
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [submissionsData, resolvedData, labels]);

  return (
    <div className="h-64">
      <canvas ref={chartRef} data-testid="chart-trends"></canvas>
    </div>
  );
}
