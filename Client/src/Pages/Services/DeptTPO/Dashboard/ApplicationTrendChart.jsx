import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { Card } from "../../../../Components";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ApplicationTrendChart = ({ trend = [] }) => {
  // Aggregate monthly records into yearly totals
  const yearlyData = Object.values(
    trend.reduce((acc, item) => {
      const year = String(item.year);

      if (!acc[year]) {
        acc[year] = {
          year,
          applications: 0,
          accepted: 0,
        };
      }

      acc[year].applications += Number(item.applications ?? 0);
      acc[year].accepted += Number(item.accepted ?? 0);

      return acc;
    }, {}),
  ).sort((a, b) => Number(a.year) - Number(b.year));

  const data = {
    labels: yearlyData.map((item) => item.year),

    datasets: [
      {
        label: "Submitted",
        data: yearlyData.map((item) => item.applications),
        backgroundColor: "#5278C7",
        hoverBackgroundColor: "#3D63B1",
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 38,
        categoryPercentage: 0.65,
        barPercentage: 0.85,
      },
      {
        label: "Accepted",
        data: yearlyData.map((item) => item.accepted),
        backgroundColor: "#E5A344",
        hoverBackgroundColor: "#CA892D",
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 38,
        categoryPercentage: 0.65,
        barPercentage: 0.85,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      intersect: false,
      mode: "index",
    },

    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#5f5b50",
          padding: 18,
          usePointStyle: true,
          pointStyle: "rectRounded",
          boxWidth: 10,
          font: {
            family: "Inter, ui-sans-serif, system-ui, sans-serif",
            size: 12,
            weight: "600",
          },
        },
      },

      tooltip: {
        enabled: true,
        backgroundColor: "#1c1a14",
        titleColor: "#fefcf7",
        bodyColor: "#fefcf7",
        borderColor: "#e5dfce",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          title: (context) => `Year ${context[0].label}`,
          label: (context) =>
            `${context.dataset.label}: ${context.parsed.y} applications`,
        },
      },
    },

    scales: {
      x: {
        title: {
          display: true,
          text: "Year",
          color: "#5f5b50",
          font: {
            size: 11,
            weight: "600",
          },
          padding: {
            top: 10,
          },
        },
        border: {
          color: "#e5dfce",
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#5f5b50",
          font: {
            size: 11,
          },
        },
      },

      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Applications",
          color: "#5f5b50",
          font: {
            size: 11,
            weight: "600",
          },
          padding: {
            bottom: 10,
          },
        },
        border: {
          display: false,
        },
        grid: {
          color: "#e5dfce",
          drawTicks: false,
        },
        ticks: {
          color: "#5f5b50",
          precision: 0,
          padding: 8,
          font: {
            size: 11,
          },
          stepSize: 1,
        },
      },
    },
  };

  return (
    <Card className="border-border bg-cream-soft shadow-card">
      <Card.Header>
        <div>
          <p className="eyebrow">Activity</p>

          <h2 className="mt-1 text-lg font-semibold text-ink">
            Application trend
          </h2>

          <p className="mt-1 text-xs text-ink-muted">
            Year-wise applications submitted and accepted.
          </p>
        </div>
      </Card.Header>

      <Card.Content>
        <div className="h-72">
          {yearlyData.length > 0 ? (
            <Bar data={data} options={options} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium text-ink">
                  No application activity yet
                </p>

                <p className="mt-1 text-xs text-ink-muted">
                  Year-wise application trends will appear here once students
                  submit applications.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default ApplicationTrendChart;
