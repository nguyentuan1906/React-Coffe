const router = require("express").Router();
const cloudinary = require("cloudinary");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const authAdmin = require("../middleware/authAdmin");
const auth = require("../middleware/auth");
router.post("/upload", auth, authAdmin, (req, res) => {
  try {
    console.log(req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ msg: "Image does not exist" });
    }
    const file = req.files.file;
    if (file.size > 1024 * 1024) {
      remove(file.tempFilePath);
      return res.status(400).json({ msg: "Image size too larger!" });
    }
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      remove(file.tempFilePath);
      return res.status(400).json({ msg: "Image format is incorrect!" });
    }
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: "React-coffee-picture" },
      async (err, result) => {
        if (err) throw err;
        remove(file.tempFilePath);
        res.json({ public_id: result.public_id, url: result.secure_url });
      }
    );
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

router.post("/destroy", auth, authAdmin, (req, res) => {
  try {
    const { public_id } = req.body;
    // const file_id = cloudinary.v2.source(public_id);
    // if (!file_id)
    //   return res.status(400).json({ msg: "Img does not select" });
    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;
      res.json({ msg: "Delete image successfully" });
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});
const remove = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
module.exports = router;