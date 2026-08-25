const fs = require('fs/promises')
const path = require('path')
const { randomUUID } = require('crypto')
const sharp = require('sharp')

const allowedMimeTypes = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
}
const maxImageSizeBytes = 20 * 1024 * 1024

function createUploadError(message) {
  const error = new Error(message)
  error.statusCode = 400
  return error
}

async function storeImage(image) {
  if (!image) return prepareImageMetadata(null)

  if (!allowedMimeTypes[image.mimeType]) {
    throw createUploadError('Format foto harus JPG, JPEG, atau PNG.')
  }

  if (typeof image.data !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(image.data)) {
    throw createUploadError('Data foto tidak valid.')
  }

  const fileBuffer = Buffer.from(image.data, 'base64')
  if (!fileBuffer.length || fileBuffer.length > maxImageSizeBytes) {
    throw createUploadError('Ukuran foto maksimal 20 MB.')
  }

  let processedBuffer = fileBuffer;
  try {
    if (image.mimeType === 'image/jpeg') {
      processedBuffer = await sharp(fileBuffer)
        .jpeg({ quality: 80, mozjpeg: true })
        .toBuffer();
    } else if (image.mimeType === 'image/png') {
      processedBuffer = await sharp(fileBuffer)
        .png({ quality: 80, compressionLevel: 8 })
        .toBuffer();
    }
  } catch (error) {
    console.error('Gagal melakukan kompresi gambar:', error);
  }

  const fileName = `${randomUUID()}${allowedMimeTypes[image.mimeType]}`
  const uploadDirectory = path.join(__dirname, '..', '..', 'uploads', 'aspirations')
  await fs.mkdir(uploadDirectory, { recursive: true })
  await fs.writeFile(path.join(uploadDirectory, fileName), processedBuffer)

  return prepareImageMetadata({
    path: `/uploads/aspirations/${fileName}`,
    originalName: String(image.originalName || fileName).slice(0, 255),
    mimeType: image.mimeType,
    sizeBytes: processedBuffer.length,
    compressedPath: `/uploads/aspirations/${fileName}`,
    compressedSizeBytes: processedBuffer.length,
  })
}

function prepareImageMetadata(image) {
  if (!image) {
    return {
      compressionStatus: 'not_needed',
    }
  }

  return {
    imagePath: image.path || null,
    imageOriginalName: image.originalName || null,
    imageMimeType: image.mimeType || null,
    imageSizeBytes: image.sizeBytes || null,
    compressedImagePath: image.compressedPath || null,
    compressedImageSizeBytes: image.compressedSizeBytes || null,
    compressionStatus: image.compressedPath ? 'compressed' : 'pending',
  }
}

module.exports = {
  allowedMimeTypes,
  maxImageSizeBytes,
  prepareImageMetadata,
  storeImage,
}
