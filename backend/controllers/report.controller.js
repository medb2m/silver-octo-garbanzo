import fs from 'fs';
import path from 'path';
import Report from '../models/report.model.js';
import Region from '../models/region.model.js'
import User from '../models/user.model.js'
import { createNotification } from './notification.controller.js';
import axios from 'axios';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const ensureReportDirectory = async (reporter) => {
  const regionName = reporter.city.delegation.region.name
  const delegationName = reporter.city.delegation.name
  const cityName = reporter.city.name

  // Build directory path: nameofRegion/nameofDelegation/nameofCity/
  const reportDir = path.join(__dirname, `../reports/${regionName}/${delegationName}/${cityName}`);

  // Ensure directory exists, create if not
  fs.mkdirSync(reportDir, { recursive: true });

  return reportDir;
}


export const createReport = async (req, res) => {
  try {
    const { content, machaghel, machakel_alyawm, houloul, concurence, propositions, concurrenceDetails } = req.body;
    const workerId = req.user._id;

    const reportData = {
      worker: workerId,
      content, machaghel, machakel_alyawm, houloul, concurence, propositions, concurrenceDetails,
      images: req.files ? req.files.map(file => `${req.protocol}://${req.get("host")}/img/${file.filename}`) : []
    };

    const worker = await User.findById(workerId).populate({
      path: 'city',
      populate: {
        path: 'delegation',
        populate: { path: 'region' }
      }
    });

    reportData.city = worker.city._id;
    reportData.delegation = worker.city.delegation
    reportData.region = worker.city.delegation.region

    // Create a report entry in the database
    const report = new Report(reportData);
    await report.save();

    await Region.findByIdAndUpdate(reportData.region, {
      $inc: { 'stats.totalReports': 1 },  // Increment the totalReports count
      $push: {
        'stats.reportDetails': {  // Add the report details
          reportId: report._id,
          userId: worker.id,
          delegationId: reportData.delegation,
          cityId: reportData.city
        }
      }
    });

    // Create the directory structure for storing the report
    const reportDir = await ensureReportDirectory(worker);

    // Define the PDF path with a specific naming convention
    const pdfPath = path.join(reportDir, `report_${report.worker}.pdf`);
    const doc = new PDFDocument(); const arabicFontPath = path.join(__dirname, '../fonts/Amiri-Regular.ttf');
    doc.registerFont('ArabicFont', arabicFontPath);

    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Add report content to the PDF, using the Arabic font for Arabic text
    doc.font('Helvetica').text(`Rapport par: ${worker.fullName}`);
    doc.font('ArabicFont').text(`City: ${worker.city.name}`, { align: 'right' }); // Ensure RTL support here
    doc.font('ArabicFont').text(`City: ${worker.city.name}`); 
    doc.font('Helvetica').text(`Contenu: ${content}`);
    doc.text(`Activitées: ${machaghel}`);
    doc.text(`Probleme d'aujourd'hui: ${machakel_alyawm}`);
    doc.text(`Solutions: ${houloul}`);
    doc.text(`Concurence exite: ${concurence}`);
    doc.text(`Propositions: ${propositions}`);
    doc.text(`Concurrence Details: ${concurrenceDetails}`);
    doc.moveDown();

    // Add images if they exist
    if (report.images && report.images.length > 0) {
      for (const imageUrl of report.images) {
        // Download the image
        const imageFileName = path.basename(imageUrl);
        const imagePath = path.join(__dirname, `../public/images/${imageFileName}`);
        const response = await axios({
          url: imageUrl,
          responseType: 'stream'
        });

        // Save the image locally
        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        // Add the image to the PDF
        doc.image(imagePath, { width: 500 });
        doc.moveDown();
        
        // Remove the temporary image file after it is added to the PDF
        fs.unlinkSync(imagePath);
      }
    }

    doc.end();

    // Send Notifications   // (message, userId, reportId, city)
    createNotification(`A New report was posted by ${worker.fullName} working in ${worker.city.name}`, worker.id, report._id, worker.city.name);

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* export const createReport = async (req, res) => {
  try {
    const { content, machaghel, machakel_alyawm, houloul, concurence, propositions, concurrenceDetails } = req.body;
    const workerId = req.user._id;

    const reportData = {
      worker: workerId,
      content,
      machaghel, machakel_alyawm, houloul, concurence, propositions, concurrenceDetails,
      images: req.files ? req.files.map(file => `${req.protocol}://${req.get("host")}/img/${file.filename}`) : []
    };

    const worker = await User.findById(workerId).populate({
      path: 'city',
      populate: {
        path: 'delegation',
        populate: { path: 'region' }
      }
    });

    const region = worker.city.delegation.region._id;

    reportData.region = region
    const report = new Report(reportData);
    await report.save();

    // Create a PDF copy of the report and save it
    const pdfPath = path.join(__dirname, `../reports/report_${report._id}.pdf`);
    const doc = new PDFDocument();

    // Load and register a font that supports Arabic (e.g., 'Amiri')
    const arabicFontPath = path.join(__dirname, '../fonts/Amiri-Regular.ttf');
    doc.registerFont('ArabicFont', arabicFontPath);

    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Add report content to the PDF, using the Arabic font for Arabic text
    doc.font('Helvetica').text(`Rapport par: ${worker.fullName}`);
    doc.font('ArabicFont').text(`City: ${worker.city.name}`, { align: 'right' }); // Ensure RTL support here
    doc.font('ArabicFont').text(`City: ${worker.city.name}`); 
    doc.font('Helvetica').text(`Contenu: ${content}`);
    doc.text(`Activitées: ${machaghel}`);
    doc.text(`Probleme d'aujourd'hui: ${machakel_alyawm}`);
    doc.text(`Solutions: ${houloul}`);
    doc.text(`Concurence exite: ${concurence}`);
    doc.text(`Propositions: ${propositions}`);
    doc.text(`Concurrence Details: ${concurrenceDetails}`);
    doc.moveDown();

    // Add images if they exist
    if (report.images && report.images.length > 0) {
      for (const imageUrl of report.images) {
        // Download the image
        const imageFileName = path.basename(imageUrl);
        const imagePath = path.join(__dirname, `../public/images/${imageFileName}`);
        const response = await axios({
          url: imageUrl,
          responseType: 'stream'
        });

        // Save the image locally
        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        // Add the image to the PDF
        doc.image(imagePath, { width: 500 });
        doc.moveDown();
        
        // Remove the temporary image file after it is added to the PDF
        fs.unlinkSync(imagePath);
      }
    }

    doc.end();

    // Send Notifications   // (message, userId, reportId, city)
    createNotification(`A New report was posted by ${worker.fullName} working in ${worker.city.name}`, worker.id, report._id, worker.city.name);

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; */

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
    }).populate('city delegation region')
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
  try {
    const { reportId } = req.params
    const report = await Report.findById(reportId)
    report.traiter = true
    await report.save()
    res.json(report)
  } catch(err) {
    console.log('Unexpected error:', err);
      next(err);  // Handle unexpected errors
  }
}



export const getReportsByCity = async (req, res) => {
  try {
    const cityId = req.params.cityId;

    // Find all repoters that belong to the given cityId
    const workersInCity = await User.find({ city: cityId }).select('_id');

    // Extract worker IDs from the result
    const workerIds = workersInCity.map(worker => worker._id);

    // Find reports where the worker is in the workerIds list and populate worker and city details
    const reports = await Report.find({ worker: { $in: workerIds } })
      .populate({
        path: 'worker',
        populate: {
          path: 'city'
        }
      });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getReportsByRegion = async (req, res) => {
  try {
    // Fetch data without using `_id`
    const reports = await Report.aggregate([
      { $group: { _id: "$region", reportCount: { $sum: 1 } } },
      {
        $lookup: {
          from: 'regions',
          localField: '_id',
          foreignField: '_id',
          as: 'region'
        }
      },
      {
        $unwind: '$region'
      },
      {
        $project: {
          _id: 0,
          region: '$region.name',
          reportCount: 1
        }
      }
    ]);

    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports by region:', error);
    res.status(500).send('Server error');
  }
};
