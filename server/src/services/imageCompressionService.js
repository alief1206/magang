const fs = require('fs/promises')
const path = require('path')
const { randomUUID } = require('crypto')
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.warn('Warna/Sharp module warning:', error.message);
}

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

// Magic Bytes (File Signature) Inspection untuk meyakinkan file benar-benar gambar murni
function isValidImageMagicBytes(buffer, mimeType) {
  if (!buffer || buffer.length < 8) return false

  if (mimeType === 'image/jpeg') {
    // Header JPEG: FF D8 FF
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
  }

  if (mimeType === 'image/png') {
    // Header PNG: 89 50 4E 47 0D 0A 1A 0A
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    )
  }

  return false
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

  // Verifikasi Magic Bytes (Mencegah peretas menyamarkan skrip .php/.exe sebagai gambar)
  if (!isValidImageMagicBytes(fileBuffer, image.mimeType)) {
    throw createUploadError('Isi file tidak sesuai dengan format gambar murni (Magic Bytes Mismatch). Upload ditolak.')
  }

  let processedBuffer = fileBuffer;
  try {
    if (sharp && image.mimeType === 'image/jpeg') {
      processedBuffer = await sharp(fileBuffer)
        .jpeg({ quality: 80, mozjpeg: true })
        .toBuffer();
    } else if (sharp && image.mimeType === 'image/png') {
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

  // Sanitasi nama asli file dari karakter berbahaya
  const sanitizedOriginalName = String(image.originalName || fileName)
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 255)

  return prepareImageMetadata({
    path: `/uploads/aspirations/${fileName}`,
    originalName: sanitizedOriginalName,
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

async function deleteImage(imagePath) {
  if (!imagePath || typeof imagePath !== 'string') return;
  try {
    const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');
    const safePath = path.resolve(uploadsDir, '..', imagePath.replace(/^[\/\\]+/, ''));
    
    // Proteksi Path Traversal: Memastikan file yang dihapus tetap berada di dalam folder uploads
    if (!safePath.startsWith(uploadsDir)) {
      console.warn('Keamanan: Upaya Path Traversal terdeteksi dan diblokir pada deleteImage:', imagePath);
      return;
    }
    
    await fs.unlink(safePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Failed to delete image file:', error);
    }
  }
}

module.exports = {
  allowedMimeTypes,
  maxImageSizeBytes,
  isValidImageMagicBytes,
  prepareImageMetadata,
  storeImage,
  deleteImage,
}
