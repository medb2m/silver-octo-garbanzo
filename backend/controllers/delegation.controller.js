import Delegation from '../models/delegation.model.js';
import Region from '../models/region.model.js';

// Create a new delegation
export const createDelegation = async (req, res) => {
  try {
    const delegation = new Delegation(req.body);
    await delegation.save();

    // Add the delegation to the associated region
    const region = await Region.findById(req.body.region);
    region.delegations.push(delegation._id);
    await region.save();

    res.status(201).send(delegation);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all delegations
export const getAllDelegations = async (req, res) => {
  try {
    const delegations = await Delegation.find().populate('cities').populate('region');
    res.status(200).send(delegations);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get all delegations by region
export const getAllDelegationsByRegion = async (req, res) => {
  try {
    const { regionId } = req.params
    const delegations = await Delegation.find({ region : regionId}).populate('cities').populate('region');
    res.status(200).send(delegations);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a specific delegation
export const getDelegation = async (req, res) => {
  try {
    const delegation = await Delegation.findById(req.params.id).populate('cities').populate('region');
    if (!delegation) return res.status(404).send();
    res.status(200).send(delegation);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a delegation
export const updateDelegation = async (req, res) => {
  try {
    const delegation = await Delegation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!delegation) return res.status(404).send();
    res.status(200).send(delegation);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a delegation
export const deleteDelegation = async (req, res) => {
  try {
    const delegation = await Delegation.findByIdAndDelete(req.params.id);
    if (!delegation) return res.status(404).send();

    // Remove the delegation from the associated region
    const region = await Region.findById(delegation.region);
    region.delegations.pull(delegation._id);
    await region.save();

    res.status(200).send(delegation);
  } catch (error) {
    res.status(500).send(error);
  }
};