import fs from 'fs';
import path from 'path';
import Report from '../models/report.model.js';
import User from '../models/user.model.js'
import { createNotification } from './notification.controller.js';
import axios from 'axios';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
}; */

// Work With a slight problem in images
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

    const report = new Report(reportData);
    await report.save();

    // Get the user who posted the report
    const worker = await User.findById(workerId).populate('city')

    // Create a PDF copy of the report and save it
    const pdfPath = path.join(__dirname, `../reports/report_${report._id}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);
    // Add report content to the PDF
    doc.text(`Rapport par: ${worker.fullName}`);
    doc.text(`City: ${worker.city.name}`);
    doc.text(`Contenu: ${content}`);
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
 */
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

    const report = new Report(reportData);
    await report.save();

    // Get the user who posted the report
    const worker = await User.findById(workerId).populate('city');

    // Create a PDF copy of the report and save it
    const pdfPath = path.join(__dirname, `../reports/report_${report._id}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Add report content to the PDF
    doc.text(`Report by: ${worker.fullName}`);
    doc.text(`City: ${worker.city.name}`);
    doc.text(`Content: ${content}`);
    doc.text(`Machaghel: ${machaghel}`);
    doc.text(`Machakel Alyawm: ${machakel_alyawm}`);
    doc.text(`Houloul: ${houloul}`);
    doc.text(`Concurence: ${concurence}`);
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

        // Add a new page before adding each image
        doc.addPage();
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

    // Get the user who posted the report
    const worker = await User.findById(workerId).populate('city');

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
