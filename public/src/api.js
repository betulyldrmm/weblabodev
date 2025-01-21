import axios from 'axios';

// API anahtarınızı buraya ekleyin
const API_KEY = 'dfa0a2c92eae44e0ba7d9b29cbdd7a76';  // Gerçek API anahtarınızı burada kullanın
const BASE_URL = 'https://newsapi.org/v2/top-headlines';

// Haberleri çeken fonksiyon
const getNews = async (category = 'general') => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apiKey: API_KEY,  // API anahtarınızı kullanın
        country: 'us',  // Türkiye haberlerini alıyoruz
        category: category,  // Kategoriyi belirleyebilirsiniz (opsiyonel)
      },
    });

    // API'den gelen veriyi konsola yazdır
    console.log("API Yanıtı:", response.data); // API yanıtını kontrol etmek için

    if (response.data.articles.length === 0) {
      console.log("No news available"); // Eğer haber yoksa
    }

    return response.data.articles;  // API'den gelen haberlerin listesi
  } catch (error) {
    console.error('Haber çekme hatası:', error);
    return [];  // Eğer bir hata varsa, boş bir liste döner
  }
};

export default getNews;
