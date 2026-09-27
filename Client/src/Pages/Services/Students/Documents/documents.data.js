export const uploadedDocuments = [
  {
    id: "DOC-001",
    name: "Student Signature",
    type: "Signature",
    fileName: "student-signature.png",
    fileType: "PNG",
    uploadedAt: "12 Sep 2026",
    status: "verified",
    size: "124 KB",
    url: "#",
  },
  {
    id: "DOC-002",
    name: "Undertaking Form",
    type: "Undertaking",
    fileName: "student-undertaking.pdf",
    fileType: "PDF",
    uploadedAt: "12 Sep 2026",
    status: "verified",
    size: "482 KB",
    url: "#",
  },
  {
    id: "DOC-003",
    name: "Resume",
    type: "Resume",
    fileName: "student-resume.pdf",
    fileType: "PDF",
    uploadedAt: "13 Sep 2026",
    status: "verified",
    size: "736 KB",
    url: "#",
  },
];

export const verificationSteps = [
  {
    id: 1,
    title: "Student verification",
    description: "Student information has been verified.",
    status: "completed",
  },
  {
    id: 2,
    title: "Academic verification",
    description: "Academic details have been verified.",
    status: "completed",
  },
  {
    id: 3,
    title: "Company verification",
    description: "Internship company details have been verified.",
    status: "completed",
  },
  {
    id: 4,
    title: "Department verification",
    description: "Department verification has been completed.",
    status: "completed",
  },
  {
    id: 5,
    title: "NOC generation",
    description: "NOC has been generated successfully.",
    status: "completed",
  },
];

export const nocDocument = {
  id: "NOC-2026-00124",
  name: "No Objection Certificate",
  fileName: "NOC-JGEC-2026-00124.pdf",
  generatedAt: "18 Sep 2026",
  status: "generated",
  verified: true,
  size: "628 KB",
  url: "#",
};
