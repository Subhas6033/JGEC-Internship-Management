import { motion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";

import { Card } from "../../../../Components/index";
import { doughnutOptions } from "./analytics.utils";

import {
  sectionAnimation,
  useAnimationVariants,
} from "../../../../Animations/animations";

const ApplicationStatusChart = ({ data }) => {
  const animation = useAnimationVariants(sectionAnimation);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: ["#059669", "#f59e0b", "#ef4444", "#94a3b8"],
        borderWidth: 0,
        hoverOffset: 6,
        spacing: 3,
      },
    ],
  };

  const total = data.values.reduce((sum, value) => sum + value, 0);

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
          <h3 className="font-semibold text-ink">Application Status</h3>
          <p className="mt-1 text-xs text-ink-muted">
            Overall application distribution
          </p>
        </div>

        <div className="relative mx-auto h-70 max-w-85">
          <Doughnut data={chartData} options={doughnutOptions} />

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
            <span className="text-2xl font-bold text-ink">
              {total.toLocaleString()}
            </span>
            <span className="text-xs text-ink-muted">Applications</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ApplicationStatusChart;
