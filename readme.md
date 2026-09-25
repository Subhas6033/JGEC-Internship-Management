```
internship-noc-system/
│
├── backend/
│ ├── src/
│ │ ├── config/
│ │ │ ├── db.js
│ │ │ ├── env.js
│ │ │ └── mail.js
│ │ │
│ │ ├── controllers/
│ │ │ ├── auth.controller.js
│ │ │ ├── student.controller.js
│ │ │ ├── application.controller.js
│ │ │ ├── tpo.controller.js
│ │ │ ├── admin.controller.js
│ │ │ ├── pdf.controller.js
│ │ │ └── email.controller.js
│ │ │
│ │ ├── models/
│ │ │ ├── User.js
│ │ │ ├── Student.js
│ │ │ ├── InternshipApplication.js
│ │ │ └── Approval.js
│ │ │
│ │ ├── routes/
│ │ │ ├── auth.routes.js
│ │ │ ├── student.routes.js
│ │ │ ├── application.routes.js
│ │ │ ├── tpo.routes.js
│ │ │ ├── admin.routes.js
│ │ │ └── pdf.routes.js
│ │ │
│ │ ├── services/
│ │ │ ├── application.service.js
│ │ │ ├── approval.service.js
│ │ │ ├── pdf.service.js
│ │ │ └── email.service.js
│ │ │
│ │ ├── middleware/
│ │ │ ├── auth.middleware.js
│ │ │ ├── role.middleware.js
│ │ │ ├── error.middleware.js
│ │ │ └── upload.middleware.js
│ │ │
│ │ ├── utils/
│ │ │ ├── generateApplicationId.js
│ │ │ ├── generatePDF.js
│ │ │ └── sendEmail.js
│ │ │
│ │ ├── templates/
│ │ │ ├── emails/
│ │ │ │ ├── application-submitted.html
│ │ │ │ ├── tpo-approved.html
│ │ │ │ ├── admin-approved.html
│ │ │ │ └── application-rejected.html
│ │ │ │
│ │ │ └── noc/
│ │ │ └── noc-template.html
│ │ │
│ │ ├── uploads/
│ │ │ └── .gitkeep
│ │ │
│ │ ├── app.js
│ │ └── server.js
│ │
│ ├── .env
│ ├── .env.example
│ ├── package.json
│ └── .gitignore
│
├── frontend/
│ └── ...
│
├── README.md
└── package.json
```