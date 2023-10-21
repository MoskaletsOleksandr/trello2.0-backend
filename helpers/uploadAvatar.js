import { v2 as cloudinary } from 'cloudinary';

const uploadAvatar = async (req, res) => {
  const { id } = req.user;
  const fileBuffer = req.file.buffer;
  const fileName = `${id}_${Date.now()}`;

  const options = {
    public_id: `trello2.0/avatars/${fileName}`,
    use_filename: true,
    unique_filename: true,
    overwrite: true,
    transformation: [{ width: 68, height: 68, crop: 'fill' }],
    quality: 'auto:best',
  };
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(options, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        })
        .end(fileBuffer);
    });
    return result.secure_url;
  } catch (error) {
    res.status(400).json({ message: 'Image loading error' });
  }
};

export default uploadAvatar;
