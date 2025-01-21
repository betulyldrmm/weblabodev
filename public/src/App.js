import React, { useState, useEffect } from 'react';
import './App.css';
import getNews from './api.js';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  const [news, setNews] = useState([]);
  const [smallNews, setSmallNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);  // Favori haberler için durum

  const categories = ['General', 'Business', 'Technology', 'Entertainment', 'Sports', 'Health', 'Science'];

  useEffect(() => {
    fetchNews();
    fetchSmallNews();
  }, []);

  const fetchNews = async (category = 'general') => {
    setLoading(true);
    setError(null);
    try {
      const fetchedNews = await getNews(category);
      if (fetchedNews && fetchedNews.length > 0) {
        setNews(fetchedNews);
      } else {
        setError('Haberler bulunamadı');
      }
    } catch (error) {
      console.error('API Hata Detayı:', error);
      setError('Haberler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchSmallNews = async () => {
    try {
      const fetchedSmallNews = await getNews('business');
      if (fetchedSmallNews && fetchedSmallNews.length > 0) {
        setSmallNews(fetchedSmallNews);
      }
    } catch (error) {
      console.error('Küçük haberler yüklenirken hata:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredNews = news.filter(item =>
    searchTerm ? (
      item.title?.toLowerCase().includes(searchTerm) ||
      item.description?.toLowerCase().includes(searchTerm)
    ) : true
  );

  const filteredSmallNews = smallNews.filter(item =>
    searchTerm ? (
      item.title?.toLowerCase().includes(searchTerm) ||
      item.description?.toLowerCase().includes(searchTerm)
    ) : true
  );

  // Favoriye ekleme/çıkarma fonksiyonu
  const toggleFavorite = (item) => {
    setFavorites(prevFavorites =>
      prevFavorites.includes(item)
        ? prevFavorites.filter(fav => fav !== item) // Favoriden çıkar
        : [...prevFavorites, item] // Favoriye ekle
    );
  };

  return (
    <Router>
      <div className={darkMode ? 'dark-mode' : ''}>
        <div className="header-container">
          <div className="header-content">
            <h1 className="site-title">WN</h1>

            {/* Kategoriler ve Arama Çubuğu */}
            <div className="b">
              <div className="categories">
                {categories.map((category, index) => (
                  <li key={index} onClick={() => fetchNews(category.toLowerCase())}>
                    {category}
                  </li>
                ))}
              </div>

              {/* Arama Çubuğu */}
              <input
                type="text"
                className="search-bar"
                placeholder="Haberlerde ara..."
                value={searchTerm}
                onChange={handleSearch}
              />

              {/* Tema Değiştirme Butonu */}
              <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? '🌙' : '☀'}
              </button>
            </div>

            {/* Giriş Butonları */}
            <button className="login-btn" onClick={() => window.location.href = '/uye.html'}>
              Üyelik
            </button>
            <button className="giris-btn" onClick={() => window.location.href = '/giris.html'}>
              Giriş
            </button>
          </div>
        </div>

        <hr className="divider" />

        <div className="content-container">
          <div className="main-content">
            {loading && <p>Yükleniyor...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && filteredNews.map((item, index) => (
              <div key={index} className="card">
                <img 
                  src={item.urlToImage || 'https://via.placeholder.com/400x200'} 
                  alt={item.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x200';
                  }}
                />
                <div className="card-body">
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-text">{item.description || 'Açıklama yok.'}</p>
                  <p className="publish-date">
                    {new Date(item.publishedAt).toLocaleDateString('tr-TR')}
                  </p>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    Haberin Devamı..
                  </a>

                

                </div>
              </div>
            ))}
          </div>

          <div className="sidebar">
            {filteredSmallNews.slice(0, 20).map((item, index) => (
              <div key={index} className="small-news-card">
                <img 
                  src={item.urlToImage || 'https://via.placeholder.com/80'} 
                  alt={item.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/80';
                  }}
                />
                <div className="small-news-card-body">
                  <h5 className="small-news-card-title">{item.title}</h5>
                  <p className="small-news-card-text">
                    {item.description || 'Açıklama yok.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
