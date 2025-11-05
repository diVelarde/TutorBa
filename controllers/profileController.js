import { fetchProfile, editProfile } from "../services/profileService.js";

export const getProfile = async (req, res) => {
  const profile = await fetchProfile(req.params.id);
  res.json(profile);
};

export const updateProfile = async (req, res) => {
  const updated = await editProfile(req.params.id, req.body);
  res.json(updated);
};