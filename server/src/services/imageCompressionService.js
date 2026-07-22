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
  prepareImageMetadata,
}
