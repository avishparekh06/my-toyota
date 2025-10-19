# Toyota Inventory Scraper

A Selenium-based automation script to scrape Toyota's official Search Inventory page and collect local vehicle listings for users based on their ZIP codes stored in MongoDB.

## 🎯 Features

- **Automated Data Collection**: Scrapes Toyota's inventory page for each user's ZIP code
- **MongoDB Integration**: Reads user ZIP codes and stores scraped car data
- **Headless Browser**: Uses Chrome in headless mode for efficient scraping
- **Error Handling**: Robust error handling and retry mechanisms
- **Respectful Scraping**: Built-in delays and rate limiting

## 📋 Requirements

- Python 3.7+
- Chrome browser installed
- MongoDB connection
- Required Python packages (see requirements.txt)

## 🚀 Installation

1. **Install Python dependencies:**
   ```bash
   cd toyota-scraper
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and configuration
   ```

3. **Verify Chrome installation:**
   - Chrome browser should be installed on your system
   - ChromeDriver will be automatically managed by webdriver-manager

## 📊 Data Structure

The scraper extracts and stores the following fields for each vehicle:

```json
{
  "model": "Camry LE",
  "trim": "LE", 
  "year": 2024,
  "price": 32000,
  "dealerName": "Toyota of Austin",
  "zipCode": "73301",
  "fuelType": "Hybrid",
  "drivetrain": "FWD",
  "mileage": 15000,
  "availabilityUrl": "https://www.toyota.com/inventory/...",
  "scrapedAt": "2024-01-15T10:30:00Z"
}
```

## 🎮 Usage

### Full Scraping (All Users)

Run the scraper for all users in your database:

```bash
python3 main.py
```

### Test Mode (Single ZIP Code)

Test the scraper with a specific ZIP code:

```bash
python3 main.py 90210
```

## ⚙️ Configuration

Edit `config.py` or set environment variables:

- `MONGO_URI`: MongoDB connection string
- `HEADLESS_MODE`: Run browser in headless mode (true/false)
- `PAGE_LOAD_TIMEOUT`: Timeout for page loading (seconds)
- `DELAY_BETWEEN_REQUESTS`: Delay between ZIP code requests (seconds)
- `MAX_RETRIES`: Maximum retry attempts for failed requests

## 📁 Project Structure

```
toyota-scraper/
├── main.py              # Main execution script
├── toyota_scraper.py    # Selenium scraper class
├── database.py          # MongoDB operations
├── config.py            # Configuration settings
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## 🔧 How It Works

1. **Connect to MongoDB**: Reads users from the `users` collection
2. **Extract ZIP Codes**: Gets unique ZIP codes from user location data
3. **Navigate to Toyota Site**: Opens Toyota's search inventory page
4. **Search by ZIP**: Enters ZIP code and submits search form
5. **Scrape Results**: Extracts vehicle data from search results
6. **Store Data**: Saves scraped data to `car_data` collection

## 🛡️ Error Handling

- **Timeout Protection**: Handles page load timeouts gracefully
- **Element Detection**: Multiple selectors for robust element finding
- **Data Validation**: Ensures data quality before database insertion
- **Retry Logic**: Automatic retries for transient failures
- **Graceful Degradation**: Continues processing even if some ZIP codes fail

## 📝 Logging

The scraper provides detailed console output including:
- Progress indicators for each ZIP code
- Success/failure status for each operation
- Summary statistics at completion
- Error messages for troubleshooting

## ⚠️ Important Notes

- **Rate Limiting**: Built-in delays to be respectful to Toyota's servers
- **Data Duplication**: The scraper checks for existing data before scraping
- **Browser Requirements**: Chrome must be installed for Selenium to work
- **Network Stability**: Requires stable internet connection for reliable scraping

## 🐛 Troubleshooting

### Common Issues:

1. **Chrome Driver Issues**: 
   - Ensure Chrome browser is installed
   - webdriver-manager will handle driver installation automatically

2. **MongoDB Connection Issues**:
   - Verify MONGO_URI in config.py
   - Ensure MongoDB server is accessible

3. **No Results Found**:
   - Check if Toyota's website structure has changed
   - Verify ZIP codes are valid US postal codes

4. **Timeout Errors**:
   - Increase PAGE_LOAD_TIMEOUT in config
   - Check network connectivity

## 🔄 Integration with RAG System

The scraped data can be integrated with your RAG recommendation system:

1. **Update Car Data**: Use scraped data to populate/update car inventory
2. **Location-Based Matching**: Match users with local inventory
3. **Real-Time Availability**: Show current availability status
4. **Enhanced Recommendations**: Include local dealer information

## 📈 Future Enhancements

- **Scheduled Scraping**: Run on a schedule to keep data fresh
- **Multiple Dealers**: Support for different Toyota dealer websites
- **Image Scraping**: Download vehicle images
- **Price Tracking**: Monitor price changes over time
- **Notification System**: Alert users of new matching vehicles
