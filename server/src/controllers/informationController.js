const Information = require('../models/informationModel');

exports.getInformations = async (req, res) => {
  try {
    const kelurahanId = req.user ? req.user.kelurahanId : null;
    const informations = await Information.findAll(kelurahanId);

    res.status(200).json({
      success: true,
      data: informations,
    });
  } catch (error) {
    console.error('Error fetching informations:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data informasi',
    });
  }
};

exports.createInformation = async (req, res) => {
  try {
    const { title, type, eventDate, description, imageUrl } = req.body;
    
    // Auth middleware should add req.user
    const authorId = req.user.id;
    const kelurahanId = req.user.kelurahanId;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Judul dan isi keterangan wajib diisi',
      });
    }

    const newInfo = await Information.create({
      kelurahanId,
      authorId,
      title,
      type: type || 'Pengumuman',
      eventDate: eventDate || null,
      description,
      imageUrl: imageUrl || null
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil membuat informasi',
      data: newInfo,
    });
  } catch (error) {
    console.error('Error creating information:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat informasi',
    });
  }
};
