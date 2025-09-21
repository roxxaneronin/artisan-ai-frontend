import React, { useState } from 'react';

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [productName, setProductName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    if (!imageFile) {
      setError('Please select an image file.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('product_name', productName);
    formData.append('keywords', keywords);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from the server. Check your backend.');
      }

      const data = await response.json();
      setResult(data);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center p-4 sm:p-8 font-sans transition-colors duration-300">
      
      {/* Header and Title */}
      <header className="w-full text-center py-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Artisan AI 🎨</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Effortless content generation for your handmade products.
        </p>
      </header>
      
      <main className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-10">
        {/* Input Form Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-center mb-6">Create New Content</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="product-image" className="block text-sm font-medium mb-2">
                Upload Product Image
              </label>
              <input 
                id="product-image"
                type="file" 
                onChange={handleFileChange} 
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                required
              />
            </div>
            
            <div>
              <label htmlFor="product-name" className="block text-sm font-medium mb-2">
                Product Name
              </label>
              <input
                id="product-name"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Hand-carved Wooden Bowl"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50 dark:bg-gray-700"
              />
            </div>
            
            <div>
              <label htmlFor="keywords" className="block text-sm font-medium mb-2">
                Keywords (optional)
              </label>
              <textarea
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., eco-friendly, unique grain, made with love"
                rows="3"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50 dark:bg-gray-700"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3 px-4 bg-violet-600 text-white font-semibold rounded-md shadow-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Generating...' : 'Generate Content'}
            </button>
          </form>
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100 rounded-md text-sm">
              <p>Error: {error}</p>
            </div>
          )}
        </section>

        {/* Results Section */}
        {result && (
          <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-8">
            <h2 className="text-2xl font-semibold text-center mb-6">Generated Content</h2>
            
            <div className="flex flex-col md:flex-row items-start md:space-x-8 space-y-8 md:space-y-0">
              {/* Image Result */}
              <div className="w-full md:w-1/2">
                <h3 className="text-lg font-medium mb-3">Enhanced Image:</h3>
                <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                  <img src={result.enhanced_image_url} alt="Enhanced product" className="w-full h-full object-cover" />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Powered by Cloudinary. The image is automatically enhanced to look more professional.
                </p>
              </div>
              
              {/* Text Results */}
              <div className="w-full md:w-1/2 space-y-6">
                {/* Product Description */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">Product Description:</h3>
                    <button 
                      onClick={() => copyToClipboard(result.generated_text.description)}
                      className="text-sm text-violet-600 hover:text-violet-800 font-medium"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{result.generated_text.description}</p>
                </div>
                
                {/* Social Media Post */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">Social Media Post:</h3>
                    <button 
                      onClick={() => copyToClipboard(result.generated_text.social_post)}
                      className="text-sm text-violet-600 hover:text-violet-800 font-medium"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{result.generated_text.social_post}</p>
                </div>
                
                {/* Hashtags */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">Hashtags:</h3>
                    <button 
                      onClick={() => copyToClipboard(result.generated_text.hashtags.join(' '))}
                      className="text-sm text-violet-600 hover:text-violet-800 font-medium"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.generated_text.hashtags.join(' ')}</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      
      {/* Footer */}
      <footer className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Built for the Hackathon</p>
      </footer>
    </div>
  );
}

export default App;