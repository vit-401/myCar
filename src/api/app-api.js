import axios from 'axios'

const REACT_APP_OPENAI_API_KEY = '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'

const openaiApi = axios.create({
  baseURL: 'https://api.openai.com/v1/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${REACT_APP_OPENAI_API_KEY}` // Replace with your OpenAI API key
  }
});

const instance = axios.create({
  baseURL: 'https://cars-u75x.onrender.com/',
  withCredentials: false
})

export const appAPI = {
   async sendGPTPrompt(prompt) {
     const data = {
       model: "gpt-4-1106-preview",
       messages: [{"role": "user", "content": prompt}],
       temperature: 0.7
     };

     return openaiApi.post('chat/completions', data)
       .then(response => {
         console.log('Response:', response.data);
         return response.data;
       })
       .catch(error => {
         console.error('Error:', error);
         throw error;
       });
  },
  createCar(params){
    return instance.get(`cars`, {params: params})
  },
}




