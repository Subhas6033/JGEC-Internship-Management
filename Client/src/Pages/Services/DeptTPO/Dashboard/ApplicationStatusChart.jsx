import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Card } from "../../../../Components";

ChartJS.register(ArcElement, Tooltip, Legend);

const ApplicationStatusChart = ({ applications }) => {
  const values = [
    applications?.pending ?? 0,
    applications?.accepted ?? 0,
    applications?.rejected ?? 0,
    applications?.returned ?? 0,
  ];

  const data = {
    labels: ["Pending", "Accepted", "Rejected", "Returned"],
    datasets: [
      {
        data: values,
        backgroundColor: ["#b7791f", "#087a4f", "#b94a3d", "#3b6f8f"],
        hoverBackgroundColor: ["#9f6718", "#006b42", "#9f3f34", "#315f7a"],
        borderColor: "#fefcf7",
        borderWidth: 4,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    interaction: {
      intersect: false,
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
        callbacks: {
          label: (context) => {
            const value = context.raw ?? 0;
            return ` ${context.label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <Card className="border-border bg-cream-soft shadow-card">
      <Card.Header>
        <div>
          <p className="eyebrow">Applications</p>

          <h2 className="mt-1 text-lg font-semibold text-ink">
            Application status
          </h2>

          <p className="mt-1 text-xs text-ink-muted">
            Current departmental application distribution.
          </p>
        </div>
      </Card.Header>

      <Card.Content>
        <div className="h-72">
          <Doughnut data={data} options={options} />
        </div>
      </Card.Content>
    </Card>
  );
};

export default ApplicationStatusChart;
