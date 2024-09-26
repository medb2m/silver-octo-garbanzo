import Region from '../models/region.model.js';
import User from '../models/user.model.js';
import Report from '../models/report.model.js';

// Create a new region
export const createRegion = async (req, res) => {
  try {
    const region = new Region(req.body);
    await region.save();
    res.status(201).send(region);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all regions
export const getAllRegions = async (req, res) => {
  try {
    const regions = await Region.find().populate('delegations');
    res.status(200).send(regions);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a specific region
export const getRegion = async (req, res) => {
  try {
    const region = await Region.findById(req.params.id).populate('delegations');
    if (!region) return res.status(404).send();
    res.status(200).send(region);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a region
export const updateRegion = async (req, res) => {
  try {
    const region = await Region.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!region) return res.status(404).send();
    res.status(200).send(region);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a region
export const deleteRegion = async (req, res) => {
  try {
    const region = await Region.findByIdAndDelete(req.params.id);
    if (!region) return res.status(404).send();
    res.status(200).send(region);
  } catch (error) {
    res.status(500).send(error);
  }
};


// Increment moderators in a region
export const addModerator = async (req, res) => {
  const { regionId, moderatorId } = req.params;
  console.log('hello regionId and modId ' + regionId + moderatorId )

  // Find moderator
  const mod = User.findById(moderatorId)
  if (!mod) {
    return res.status(404).json({ message: 'moderator not found' });
  } 
  // Make sure the user is a 'Moderator'
  if (mod.role !== 'Moderator') {
    return res.status(400).json({ message: "User is not a moderator" });
}

  mod.region = regionId
  await mod.save()

  return res.status(200).json({ message: 'Moderator added successfully', region });
};

// Remove moderator from a region
export const removeModerator = async (req, res) => {
  const { regionId, moderatorId } = req.params;
  
  // Find the region by ID
  const region = await Region.findById(regionId);
  if (!region) {
    return res.status(404).json({ message: 'Region not found' });
  }

  // Remove the moderator from the moderators array
  const index = region.moderators.indexOf(moderatorId);
  if (index > -1) {
    region.moderators.splice(index, 1); // Remove the moderator
  }

  // Save the updated region document
  await region.save();

  return res.status(204).json({ message: 'Moderator removed successfully', region });
};

export const getRegionDetails = async (req, res) => {
  try {
    const { regionId } = req.params;

    // Fetch the region data
    const region = await Region.findById(regionId)
      .populate('moderators', 'name') // Populate moderator names
      .populate('delegations', 'name'); // Populate delegation names

    if (!region) {
      return res.status(404).json({ message: 'Region not found' });
    }

    // Fetch reports related to this region
    const reports = await Report.find({ region: regionId });

    const reportCount = reports.length;
    const treatedReports = reports.filter(report => report.traiter === true).length;
    const untreatedReports = reportCount - treatedReports;
    const importantReports = reports.filter(report => report.important === true).length;
    
    // Count unique workers associated with the reports
    const workerCount = new Set(reports.map(report => report.worker.toString())).size;

    // Send the response with all the data
    res.status(200).json({
      region: {
        name: region.name,
        reportCount,
        workerCount,
        treatedReports,
        untreatedReports,
        importantReports
      }
    });
  } catch (error) {
    console.error('Error fetching region details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRegionStats = async (req, res) => {
  try {
    const regions = await Region.find({}, 'name stats.totalReports'); // Fetch regions with name and totalReports

    res.status(200).json(regions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching region statistics', error: err });
  }
};