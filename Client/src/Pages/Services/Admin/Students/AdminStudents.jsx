import { motion } from "framer-motion";

import StudentsHeader from "./StudentsHeader";
import StudentStats from "./StudentStats";
import StudentFilters from "./StudentFilters";
import StudentsTable from "./StudentsTable";
import { fadeUp, viewport } from "../../../../Animations/animations";

const AdminStudents = () => {
  return (
    <motion.div initial="hidden" animate="visible" className="w-full">
      <StudentsHeader />

      <StudentStats />

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="mt-6"
      >
        <StudentFilters />
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="mt-4"
      >
        <StudentsTable />
      </motion.section>
    </motion.div>
  );
};

export default AdminStudents;
