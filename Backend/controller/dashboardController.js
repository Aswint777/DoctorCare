const User = require("../model/userModel");

const getDashboardStats = async (req, res) => {
  try {
    // 1. Get KPI Totals
    const totalDoctors = await User.countDocuments({ role: "doctor" }); 
    const totalPatients = await User.countDocuments({ role: "patient" }); 
    const totalUsers = await User.countDocuments();

    // 2. Get Data for Pie Chart (Specialties)
    const specialtiesAggregation = await User.aggregate([
      { $match: { role: "doctor", qualification: { $exists: true, $ne: "" } } },
      { $group: { _id: "$qualification", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);

    // 3. Get Data for Bar Chart (Last 6 Months Growth)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyGrowthAggregation = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            role: "$role"
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Format the growth data for Recharts
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      formattedMonthlyData.push({
        name: monthNames[d.getMonth()],
        monthNumber: d.getMonth() + 1,
        patients: 0,
        doctors: 0
      });
    }

    monthlyGrowthAggregation.forEach((item) => {
      const monthIndex = formattedMonthlyData.findIndex(m => m.monthNumber === item._id.month);
      if (monthIndex !== -1) {
        if (item._id.role === "doctor") {
          formattedMonthlyData[monthIndex].doctors = item.count;
        } else {
          formattedMonthlyData[monthIndex].patients += item.count; 
        }
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalDoctors,
        totalPatients,
        totalUsers
      },
      specialtyData: specialtiesAggregation.length > 0 ? specialtiesAggregation : [{ name: "No Data", value: 1 }],
      monthlyGrowthData: formattedMonthlyData
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard statistics" });
  }
};

module.exports = {
  getDashboardStats
};