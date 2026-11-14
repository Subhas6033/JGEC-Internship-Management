import React from "react";
import { Building2, CheckCircle2, Clock3, Ban } from "lucide-react";
import { Card } from "../../../../Components/index";

const CompanyStats = ({ companies }) => {
  const stats = [
    {
      title: "Total Organisation",
      value: companies.length,
      icon: Building2,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Active Organisation",
      value: companies.filter((company) => company.status === "Active").length,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Pending Approval",
      value: companies.filter((company) => company.status === "Pending").length,
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Inactive Organisation",
      value: companies.filter((company) => company.status === "Inactive")
        .length,
      icon: Ban,
      color: "bg-gray-100 text-gray-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.title}>
            <Card.Content className="p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">{stat.title}</p>

                  <h3 className="mt-2 text-2xl font-bold text-gray-900">
                    {stat.value}
                  </h3>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </Card.Content>
          </Card>
        );
      })}
    </div>
  );
};

export default CompanyStats;
