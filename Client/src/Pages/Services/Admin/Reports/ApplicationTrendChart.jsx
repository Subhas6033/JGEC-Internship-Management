import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";

import { Card } from "../../../../Components/index";
import { chartOptions } from "./analytics.utils";

import {
  sectionAnimation,
  useAnimationVariants,
} from "../../../../Animations/animations";

const ApplicationTrendChart = ({ data }) => {
  const animation = useAnimationVariants(sectionAnimation);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Applications",
        data: data.applications,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.10)",
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "#2563eb",
      },
      {
        label: "Approved",
        data: data.approved,
        borderColor: "#059669",
        backgroundColor: "rgba(5, 150, 105, 0.08)",
        fill: false,
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "#059669",
      },
    ],
  };

  return (
    <motion.div
      variants={animation}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="min-w-0"
    >
      <Card className="h-full min-w-0 border border-border bg-white p-4 shadow-card sm:p-5">
        <div className="mb-5">
          <h3 className="font-semibold text-ink">Application Trends</h3>
          <p className="mt-1 text-xs text-ink-muted">
            Applications submitted and approved over time
          </p>
        </div>

        <div className="relative h-70 w-full min-w-0">
          <Line
            data={chartData}
            options={{
              ...chartOptions,
              interaction: {
                mode: "index",
                intersect: false,
              },
            }}
          />
        </div>
      </Card>
    </motion.div>
  );
};

export default ApplicationTrendChart;
