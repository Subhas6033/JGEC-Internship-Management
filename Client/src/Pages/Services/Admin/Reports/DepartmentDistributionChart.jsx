import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";

import { Card } from "../../../../Components/index";
import { chartOptions } from "./analytics.utils";

import {
  sectionAnimation,
  useAnimationVariants,
} from "../../../../Animations/animations";

const DepartmentDistributionChart = ({ data }) => {
  const animation = useAnimationVariants(sectionAnimation);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Students",
        data: data.values,
        backgroundColor: [
          "#2563eb",
          "#059669",
          "#8b5cf6",
          "#f59e0b",
          "#0891b2",
          "#ec4899",
        ],
        borderRadius: 7,
        borderSkipped: false,
        maxBarThickness: 42,
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
          <h3 className="font-semibold text-ink">Department-wise Students</h3>
          <p className="mt-1 text-xs text-ink-muted">
            Student distribution across departments
          </p>
        </div>

        <div className="relative h-70 w-full min-w-0">
          <Bar
            data={chartData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>
      </Card>
    </motion.div>
  );
};

export default DepartmentDistributionChart;
