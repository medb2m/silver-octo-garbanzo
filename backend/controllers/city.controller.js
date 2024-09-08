import City from '../models/city.model.js';
import Delegation from '../models/delegation.model.js';
import User from '../models/user.model.js'

// get workers by city
export const getWorkers = async (req, res) => {
  const { cityId } = req.params

  const city = await City.findById(cityId);
  if (!city ) {
    return res.status(404).json({message : 'City not found'})
  }

  const workers = await User.find({city : cityId})
  if (!workers) {
    return res.status(404).json({message : 'Workers not found'})
  }

  res.status(200).json(workers)
}

// increment workers 
export const addWorker = async (req, res) => {
  const { cityId, workerId } = req.params;

  // Find the city by ID
  const city = await City.findById(cityId);
  if (!city) {
    return res.status(404).json({ message: 'City not found' });
  }

  // Check if the worker is already in the workers array
  if (city.workers.includes(workerId)) {
    return res.status(400).json({ message: 'Worker is already added to this city' });
  }

  // Add the worker to the workers array
  city.workers.push(workerId);

  // Save the updated city document
  await city.save();

  return res.status(200).json({ message: 'Worker added successfully', city });

}

export const removeWorker = async (req, res) => {
  const { cityId, workerId} = req.params
  
  const city = await City.findById(cityId)
  if (!city) {
    return res.status(404).json({ message : 'City not found'})
  }
  city.workers.pop(workerId)
  await city.save()
  return res.status(204).json({ message: 'Worker removed successfully', city })
}

// Create a new city
export const createCity = async (req, res) => {
  try {
    const city = new City(req.body);
    await city.save();

    // Add the city to the associated delegation
    const delegation = await Delegation.findById(req.body.delegation);
    delegation.cities.push(city._id);
    await delegation.save();

    res.status(201).send(city);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all cities
export const getAllCities = async (req, res) => {
  try {
    const cities = await City.find().populate('workers').populate('delegation');
    res.status(200).send(cities);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get all cities by delegation
export const getCitiesByDelegations = async (req, res) => {
  try {
    const { delegId } = req.params
    const cities = await City.find({delegation : delegId}).populate('workers').populate('delegation');
    res.status(200).send(cities);
  } catch (error) {
    res.status(500).send(error);
  }
};


// Get a specific city
export const getCity = async (req, res) => {
  try {
    const city = await City.findById(req.params.id).populate('workers').populate('delegation');
    if (!city) return res.status(404).send();
    res.status(200).send(city);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a city
export const updateCity = async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!city) return res.status(404).send();
    res.status(200).send(city);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a city
export const deleteCity = async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) return res.status(404).send();

    // Remove the city from the associated delegation
    const delegation = await Delegation.findById(city.delegation);
    delegation.cities.pull(city._id);
    await delegation.save();

    res.status(200).send(city);
  } catch (error) {
    res.status(500).send(error);
  }
};