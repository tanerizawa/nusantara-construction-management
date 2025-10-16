import { FileText, Image, File } from 'lucide-react';

/**
 * File utility functions
 * Handles: size formatting, icon mapping, type detection
 */

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (fileType) => {
  const iconMap = {
    pdf: FileText,
    doc: FileText,
    docx: FileText,
    xls: FileText,
    xlsx: FileText,
    dwg: Image,
    png: Image,
    jpg: Image,
    jpeg: Image,
    gif: Image
  };
  return iconMap[fileType] || File;
};
