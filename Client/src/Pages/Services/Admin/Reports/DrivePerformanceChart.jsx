import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";

import { Card } from "../../../../Components";
import { chartOptions } from "./analytics.utils";

import {
  sectionAnimation,
  useAnimationVariants,
} from "../../../../Animations/animations";

const DrivePerformanceChart = ({ data }) => {
  const animation = useAnimationVariants(sectionAnimation);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Applications",
        data: data.applications,
        backgroundColor: "#2563eb",
        borderRadius: 6,
        maxBarThickness: 28,
      },
      {
        label: "Selected",
        data: data.selected,
        backgroundColor: "#059669",
        borderRadius: 6,
        maxBarThickness: 28,
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
          <h3 className="font-semibold text-ink">
            Internship Drive Performance
          </h3>
          <p className="mt-1 text-xs text-ink-muted">
            Applications received versus students selected
          </p>
        </div>

        <div className="relative h-70 w-full min-w-0">
          <Bar
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

export default DrivePerformanceChart;
