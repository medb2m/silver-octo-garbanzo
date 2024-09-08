import Region from '../models/region.model.js';

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
