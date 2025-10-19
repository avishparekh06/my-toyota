const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Car = require('../models/Car');

// Helper function to check database connection
const checkDatabaseConnection = (res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      error: 'Database connection unavailable',
      message: 'The database is currently not connected. Please try again later.'
    });
  }
  return null;
};

// GET /api/cars - Retrieve all cars with optional filtering
router.get('/', async (req, res) => {
  try {
    // Check database connection
    const dbError = checkDatabaseConnection(res);
    if (dbError) return;
    const { 
      make, 
      model, 
      year, 
      bodyStyle, 
      minPrice, 
      maxPrice,
      fuelType,
      drivetrain,
      status,
      location,
      limit = 50,
      page = 1
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (make) filter.make = new RegExp(make, 'i');
    if (model) filter.model = new RegExp(model, 'i');
    if (year) filter.year = parseInt(year);
    if (bodyStyle) filter.bodyStyle = new RegExp(bodyStyle, 'i');
    if (fuelType) filter.fuelType = new RegExp(fuelType, 'i');
    if (drivetrain) filter.drivetrain = new RegExp(drivetrain, 'i');
    if (status) filter.status = status;
    if (location) filter['location.city'] = new RegExp(location, 'i');
    
    // Price filtering
    if (minPrice || maxPrice) {
      filter.msrp = {};
      if (minPrice) filter.msrp.$gte = parseInt(minPrice);
      if (maxPrice) filter.msrp.$lte = parseInt(maxPrice);
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const cars = await Car.find(filter)
      .sort({ msrp: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Car.countDocuments(filter);

    res.json({
      success: true,
      data: cars,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch cars',
      message: error.message 
    });
  }
});

// GET /api/cars/:id - Retrieve a specific car by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ 
        success: false, 
        error: 'Car not found' 
      });
    }

    res.json({
      success: true,
      data: car
    });
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch car',
      message: error.message 
    });
  }
});

// POST /api/cars - Create a new car
router.post('/', async (req, res) => {
  try {
    const carData = req.body;
    
    // Validate required fields
    const requiredFields = ['vin', 'make', 'model', 'year', 'msrp'];
    const missingFields = requiredFields.filter(field => !carData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missingFields
      });
    }

    const car = new Car(carData);
    await car.save();

    res.status(201).json({
      success: true,
      data: car,
      message: 'Car created successfully'
    });
  } catch (error) {
    console.error('Error creating car:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({ 
      success: false, 
      error: 'Failed to create car',
      message: error.message 
    });
  }
});

// PUT /api/cars/:id - Update a car
router.put('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!car) {
      return res.status(404).json({ 
        success: false, 
        error: 'Car not found' 
      });
    }

    res.json({
      success: true,
      data: car,
      message: 'Car updated successfully'
    });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update car',
      message: error.message 
    });
  }
});

// DELETE /api/cars/:id - Delete a car
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ 
        success: false, 
        error: 'Car not found' 
      });
    }

    res.json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete car',
      message: error.message 
    });
  }
});

// GET /api/cars/search/:query - Search cars by make, model, or features
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const searchRegex = new RegExp(query, 'i');

    const cars = await Car.find({
      $or: [
        { make: searchRegex },
        { model: searchRegex },
        { trim: searchRegex },
        { features: searchRegex },
        { stockNumber: searchRegex }
      ]
    }).limit(20);

    res.json({
      success: true,
      data: cars,
      query
    });
  } catch (error) {
    console.error('Error searching cars:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search cars',
      message: error.message 
    });
  }
});

// GET /api/cars/embeddings - Get all car embeddings for RAG system
router.get('/embeddings', async (req, res) => {
  try {
    const cars = await Car.find({ 
      'embedding.vector': { $exists: true, $ne: [] },
      status: 'In Stock'
    }).select('_id embedding msrp location');

    const embeddings = cars.map(car => car.getEmbedding()).filter(embedding => embedding !== null);

    res.json({
      success: true,
      data: embeddings,
      count: embeddings.length
    });
  } catch (error) {
    console.error('Error fetching car embeddings:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch car embeddings',
      message: error.message 
    });
  }
});

// POST /api/cars/:id/generate-embedding - Generate embedding for a specific car
router.post('/:id/generate-embedding', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ 
        success: false, 
        error: 'Car not found' 
      });
    }

    // This would typically call the embedding service
    // For now, we'll mark it as needing regeneration
    car.embedding = {
      vector: [],
      featureText: '',
      generatedAt: new Date(),
      model: 'gemini-1.5-flash'
    };
    
    await car.save();

    res.json({
      success: true,
      message: 'Embedding generation queued',
      carId: car._id
    });
  } catch (error) {
    console.error('Error generating embedding:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate embedding',
      message: error.message 
    });
  }
});

// POST /api/cars/regenerate-embeddings - Regenerate embeddings for all cars
router.post('/regenerate-embeddings', async (req, res) => {
  try {
    const cars = await Car.find({ status: 'In Stock' });
    let processed = 0;
    let needsRegeneration = 0;

    for (const car of cars) {
      if (car.needsEmbeddingRegeneration()) {
        car.embedding = {
          vector: [],
          featureText: '',
          generatedAt: new Date(),
          model: 'gemini-1.5-flash'
        };
        await car.save();
        needsRegeneration++;
      }
      processed++;
    }

    res.json({
      success: true,
      message: 'Embedding regeneration queued',
      processed,
      needsRegeneration,
      total: cars.length
    });
  } catch (error) {
    console.error('Error regenerating embeddings:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to regenerate embeddings',
      message: error.message 
    });
  }
});

// GET /api/cars/embedding-status - Get embedding status for all cars
router.get('/embedding-status', async (req, res) => {
  try {
    const totalCars = await Car.countDocuments({ status: 'In Stock' });
    const carsWithEmbeddings = await Car.countDocuments({ 
      'embedding.vector': { $exists: true, $ne: [] },
      status: 'In Stock'
    });
    const carsNeedingRegeneration = await Car.countDocuments({
      status: 'In Stock',
      $or: [
        { 'embedding.vector': { $exists: false } },
        { 'embedding.vector': { $size: 0 } },
        { 'embedding.generatedAt': { $exists: false } },
        { 'embedding.generatedAt': { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }
      ]
    });

    res.json({
      success: true,
      data: {
        totalCars,
        carsWithEmbeddings,
        carsNeedingRegeneration,
        embeddingCoverage: totalCars > 0 ? Math.round((carsWithEmbeddings / totalCars) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Error getting embedding status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get embedding status',
      message: error.message 
    });
  }
});

module.exports = router;
