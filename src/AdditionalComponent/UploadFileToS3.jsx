import axios from 'axios';

export const uploadFileToBackend = async (file) => {
  if (!file) {
    throw new Error("No file provided for upload");
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('http://localhost:3001/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('File uploaded successfully');
    return response.data.fileUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
