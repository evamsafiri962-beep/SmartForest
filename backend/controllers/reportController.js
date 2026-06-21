const Report = require('../models/Report');
const Alert = require('../models/Alert');

exports.getReports = async (req, res, next) => {
  try {
    const reports = await Report.find().populate('generatedBy', 'name');
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

exports.generateIncidentReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    const alerts = await Alert.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });
    const reportData = {
      totalIncidents: alerts.length,
      resolved: alerts.filter(a => a.status === 'resolved').length,
      bySeverity: {
        low: alerts.filter(a => a.severity === 'low').length,
        medium: alerts.filter(a => a.severity === 'medium').length,
        high: alerts.filter(a => a.severity === 'high').length,
        critical: alerts.filter(a => a.severity === 'critical').length
      }
    };
    const report = await Report.create({
      title: `Incident Report ${startDate} to ${endDate}`,
      type: 'incident',
      data: reportData,
      generatedBy: req.user.id
    });
    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

exports.deleteReport = async (req, res, next) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted' });
  } catch (error) {
    next(error);
  }
};
