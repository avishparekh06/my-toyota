# RAG-Based Toyota Recommendation System

## Overview

This system replaces the previous rule-based recommendation engine with a RAG (Retrieval-Augmented Generation) system that uses semantic similarity matching and AI-generated explanations.

## Architecture

### Components

1. **Embedding Service** (`src/services/embeddingService.ts`)
   - Generates embeddings for user profiles and car features using Gemini 2.5 Flash
   - Creates rich text representations of user preferences and car specifications
   - Handles context generation for lifestyle and use case matching

2. **Similarity Service** (`src/services/similarityService.ts`)
   - Calculates cosine similarity between user and car embeddings
   - Implements initial filtering (MSRP ±10%, body style preferences)
   - Provides comprehensive scoring with weighted factors

3. **LLM Explanation Service** (`src/services/llmExplanationService.ts`)
   - Generates natural language explanations using Gemini 2.5 Flash
   - Creates personalized reasons for each recommendation
   - Includes fallback explanations for reliability

4. **RAG Recommender** (`src/recommendation/ragRecommender.js`)
   - Main orchestrator that coordinates all services
   - Maintains embedding cache for performance
   - Provides backward-compatible API

## Configuration

### API Configuration
- **LLM Provider**: Google Gemini 2.5 Flash
- **API Key**: Configured in `src/services/ragConfig.ts`
- **Model**: `gemini-2.0-flash-exp`

### Filtering Strategy
- **MSRP Tolerance**: ±10% of user's budget center point
- **Body Style Match**: Must match user's preferred body styles
- **Minimum Similarity Score**: 0.3 (30% match required)

### Scoring Weights
- **User Preferences**: 40%
- **Car Features**: 30%
- **Budget Fit**: 20%
- **Location Proximity**: 10%

## Usage

### Basic Usage
```javascript
import { getRecommendations } from './src/recommendation/ragRecommender.js';

// Get recommendations for a user
const result = await getRecommendations('user_001', 5);
console.log(result.recommendations);
```

### Advanced Usage
```javascript
import { ragRecommender } from './src/recommendation/ragRecommender.js';

// Initialize the system
await ragRecommender.initialize();

// Get system status
const status = ragRecommender.getStatus();

// Get similarity breakdown for debugging
const breakdown = await ragRecommender.getSimilarityBreakdown('user_001', 'car_001');
```

## Features

### Semantic Matching
- Understands user intent beyond exact specification matches
- Matches lifestyle and use case preferences
- Considers context like family size, age, and financial situation

### AI-Generated Explanations
- Natural language explanations for each recommendation
- Personalized reasons based on user profile
- Professional, conversational tone

### Performance Optimizations
- Embedding caching to avoid repeated API calls
- Initial filtering to reduce computation
- Batch processing for multiple recommendations

## Data Flow

1. **User Selection**: User selects their profile
2. **Embedding Generation**: System generates embeddings for user profile and all cars
3. **Initial Filtering**: Cars are filtered by MSRP (±10%) and body style preferences
4. **Semantic Matching**: Cosine similarity is calculated between user and car embeddings
5. **Scoring**: Comprehensive score is calculated with weighted factors
6. **Explanation Generation**: LLM generates personalized explanations
7. **Results**: Ranked recommendations with explanations are returned

## Error Handling

- Fallback explanations when LLM fails
- Graceful degradation for missing data
- Comprehensive error logging
- User-friendly error messages

## Testing

Use the RAG Test component in the recommendation page to:
- Check system initialization status
- Verify embedding generation
- Monitor system health
- Debug configuration issues

## Future Enhancements

- Vector database integration for larger datasets
- Real-time embedding updates
- A/B testing for different explanation styles
- User feedback integration for recommendation improvement
- Multi-modal embeddings (images, reviews)
