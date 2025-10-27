import { fetchProfile, editProfile } from "../services/profileService.js";

export const getProfile = async (req, res) => 
    res.json(await fetchProfile(req.params.id));

export const updateProfile = async (req, res) => 
    res.json(await editProfile(req.params.id, req.body));