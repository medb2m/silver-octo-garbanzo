import Report from '../models/report.model.js';
import User from '../models/user.model.js'
import { createNotification } from './notification.controller.js';

export const createReport = async (req, res) => {
  try {
    const { content, machaghel, machakel_alyawm, houloul, concurence, propositions, concurrenceDetails } = req.body;
    const workerId = req.user._id;

    const reportData = {
      worker: workerId,
      content,
      machaghel, machakel_alyawm, houloul, concurence, propositions, concurrenceDetails,
      images: req.files ? req.files.map(file => `${req.protocol}://${req.get("host")}/img/${file.filename}`) : []
    };

    const report = new Report(reportData);
    await report.save();

    // Get the user posted the report
    const worker = await User.findById(workerId).populate('city')

    // Send Notifications   // (message, userId, reportId, city)
    createNotification(`A New report was posted by ${worker.fullName} working in ${worker.city.name}`, worker.id, report._id, worker.city.name)
    

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getReportsByWorker = async (req, res) => {
  try {
    const workerId = req.params.id;
    const reports = await Report.find({ worker: workerId }).populate({
      path : 'worker',
      populate: {
        path: 'city'
      }
    })
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllReports = async (req, res) => {
    const reports = await Report.find().populate({
      path : 'worker',
      populate: {
        path: 'city'
      }
    })
    res.status(200).json(reports)
}

export const getReportById = async (req, res) => {
  const {reportId} = req.params
  const report = await Report.findById(reportId).populate({
    path : 'worker',
    populate: {
      path: 'city'
    }
  })
  if(!report){
    res.status(404).json({message : "report not found"})
  }
  res.status(200).json(report)   
}


export const traiteReport = async (req, res) => {
  const { reportId } = req.params
  const report = await Report.findById(reportId)
  report.traiter = true
  await report.save()
  res.json(report)
}