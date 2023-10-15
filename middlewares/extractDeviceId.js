const extractDeviceId = (req, res, next) => {
  const deviceId = req.headers['x-device-id'];
  if (deviceId) {
    req.deviceId = deviceId;
  }
  next();
};

export default extractDeviceId;
