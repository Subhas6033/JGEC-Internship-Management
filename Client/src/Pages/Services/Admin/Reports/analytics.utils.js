import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
);

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        padding: 20,
        color: "#64748b",
        font: {
          family: "inherit",
          size: 11,
        },
      },
    },
    tooltip: {
      backgroundColor: "#172033",
      titleColor: "#ffffff",
      bodyColor: "#e2e8f0",
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#64748b",
        font: {
          size: 11,
        },
      },
      border: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "#eef0f3",
      },
      ticks: {
        color: "#64748b",
        precision: 0,
        font: {
          size: 11,
        },
      },
      border: {
        display: false,
        dash: [4, 4],
      },
    },
  },
};

export const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "68%",
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        padding: 18,
        color: "#64748b",
        font: {
          family: "inherit",
          size: 11,
        },
      },
    },
    tooltip: {
      backgroundColor: "#172033",
      titleColor: "#ffffff",
      bodyColor: "#e2e8f0",
      padding: 12,
      cornerRadius: 8,
    },
  },
};

export const exportCSV = (filename, rows) => {
  if (!rows?.length) return;

  const headers = Object.keys(rows[0]);

  const escapeCSV = (value) => {
    const stringValue = String(value ?? "");
    return `"${stringValue.replace(/"/g, '""')}"`;
  };

  const csvContent = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCSV(row[header])).join(","),
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};
