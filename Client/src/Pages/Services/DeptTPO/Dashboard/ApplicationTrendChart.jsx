import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card } from "../../../../Components";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

const ApplicationTrendChart = ({ trend = [] }) => {
  const labels = trend.map((item) => `${item.month}/${item.year}`);

  const data = {
    labels,
    datasets: [
      {
        label: "Applications",
        data: trend.map((item) => item.applications ?? 0),
        borderColor: "#4eae85",
        backgroundColor: "rgba(78, 174, 133, 0.10)",
        pointBackgroundColor: "#4eae85",
        pointBorderColor: "#fefcf7",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        tension: 0.35,
        fill: true,
      },
      {
        label: "Accepted",
        data: trend.map((item) => item.accepted ?? 0),
        borderColor: "#006b42",
        backgroundColor: "rgba(0, 107, 66, 0.05)",
        pointBackgroundColor: "#006b42",
        pointBorderColor: "#fefcf7",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        tension: 0.35,
        fill: false,
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
        position: "bottom",
        labels: {
          color: "#5f5b50",
          padding: 18,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            family: "Inter, ui-sans-serif, system-ui, sans-serif",
            size: 12,
            weight: "500",
          },
        },
      },

      tooltip: {
        backgroundColor: "#1c1a14",
        titleColor: "#fefcf7",
        bodyColor: "#fefcf7",
        borderColor: "#e5dfce",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
      },
    },

    scales: {
      x: {
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
            Applications and approvals over time.
          </p>
        </div>
      </Card.Header>

      <Card.Content>
        <div className="h-72">
          {trend.length > 0 ? (
            <Line data={data} options={options} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium text-ink">
                  No application activity yet
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  Application trends will appear here once students submit
                  applications.
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
