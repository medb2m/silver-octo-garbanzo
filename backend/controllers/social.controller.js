import Social from '../models/social.model.js'
import { createSocialNotification } from './notification.controller.js';

export const createSocial = async (req, res) => {
  try {
    const { title, link } = req.body;
    const socialData = {
      title,
      link
    };

    const social = new Social(socialData);
    await social.save();


    // Send Notifications
    createSocialNotification(`A New Social link was posted`, social._id)
    

    res.status(201).json(social);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllSocial = async (req, res) => {
    const socials = await Social.find()
    res.status(200).json(socials)
}

export const getSocialById = async (req, res) => {
  const {socialId} = req.params
  const social = await Social.findById(socialId)
  if(!social){
    res.status(404).json({message : "social not found"})
  }
  res.status(200).json(social)   
}

// Delete 
export const deleteSocial = async (req, res) => {
    try {
      const social = await Social.findByIdAndDelete(req.params.socialId);
      if (!social) return res.status(404).send();
      res.status(200).send(social);
    } catch (error) {
      res.status(500).send(error);
    }
};


export const traiteSocial = async (req, res) => {
  const { socialId } = req.params
  const social = await Social.findById(socialId)
  social.traiter = true
  await social.save()
  res.json(social)
}

export const updateSocial = async (req, res) => {
  try {
    const social = await Social.findByIdAndUpdate(req.params.socialId, req.body, { new: true });
    if (!social) return res.status(404).send();
    res.status(200).send(social);
  } catch (error) {
    res.status(400).send(error);
  }
};