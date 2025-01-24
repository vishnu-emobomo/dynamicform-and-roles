const axios = require('axios');

const triggerEmail = async () => {
  try {
    const response = await axios.get('https://plflex58kb.execute-api.ap-south-1.amazonaws.com/api/send.mail');
    console.log(response.data);
  } catch (error) {
    console.error('Error triggering email:', error);
  }
};
triggerEmail();
