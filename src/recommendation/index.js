// Entry point for testing the recommendation engine
import { 
  getRecommendations, 
  getAllUserRecommendations, 
  getRecommendationsByName,
  getCustomRecommendations,
  getRecommendationSummary,
  compareUserRecommendations
} from './recommender.js';
import { mockUsers } from './mockUsers.js';
import { mockCars } from './mockCars.js';

/**
 * Display recommendations in a formatted way
 * @param {Object} recommendations - Recommendation results
 */
const displayRecommendations = (recommendations) => {
  console.log('\n🚗 TOYOTA CAR RECOMMENDATIONS');
  console.log('=' .repeat(50));
  console.log(`👤 User: ${recommendations.user.name} (${recommendations.user.location.city}, ${recommendations.user.location.state})`);
  console.log(`💰 Budget: $${recommendations.user.budget.min.toLocaleString()} - $${recommendations.user.budget.max.toLocaleString()}`);
  console.log(`🎯 Preferred: $${recommendations.user.budget.preferred.toLocaleString()}`);
  console.log('\n📊 RECOMMENDATIONS:');
  console.log('-'.repeat(50));
  
  recommendations.recommendations.forEach((rec, index) => {
    console.log(`\n${index + 1}. ${rec.car.year} ${rec.car.make} ${rec.car.model} ${rec.car.trim}`);
    console.log(`   💵 Price: $${rec.car.dealerPrice.toLocaleString()} (MSRP: $${rec.car.msrp.toLocaleString()})`);
    console.log(`   🏷️  Category: ${rec.car.category}`);
    console.log(`   🚙 Body: ${rec.car.bodyStyle} | ⛽ Fuel: ${rec.car.fuelType} | 🛞 Drive: ${rec.car.drivetrain}`);
    console.log(`   ⛽ MPG: ${rec.car.mpgCity} city / ${rec.car.mpgHighway} highway`);
    console.log(`   📍 Location: ${rec.car.location.city}, ${rec.car.location.state}`);
    console.log(`   ⭐ Score: ${rec.score}/100`);
    console.log(`   💡 Reasons:`);
    rec.reasons.forEach(reason => {
      console.log(`      • ${reason}`);
    });
  });
  
  console.log('\n📈 STATISTICS:');
  console.log('-'.repeat(30));
  console.log(`Total cars analyzed: ${recommendations.totalCarsAnalyzed}`);
  console.log(`Cars filtered out: ${recommendations.carsFiltered}`);
  console.log(`Recommendations returned: ${recommendations.recommendationsReturned}`);
  console.log(`Average score: ${recommendations.statistics.averageScore}`);
  console.log(`Score distribution:`);
  console.log(`  Excellent (80+): ${recommendations.statistics.scoreDistribution.excellent}`);
  console.log(`  Good (60-79): ${recommendations.statistics.scoreDistribution.good}`);
  console.log(`  Fair (40-59): ${recommendations.statistics.scoreDistribution.fair}`);
  console.log(`  Poor (<40): ${recommendations.statistics.scoreDistribution.poor}`);
};

/**
 * Display user comparison
 * @param {Object} comparison - Comparison results
 */
const displayComparison = (comparison) => {
  console.log('\n🔄 USER COMPARISON');
  console.log('=' .repeat(50));
  console.log(`👤 User 1: ${comparison.user1.name} (${comparison.user1.location})`);
  console.log(`👤 User 2: ${comparison.user2.name} (${comparison.user2.location})`);
  console.log(`\n📊 COMPARISON RESULTS:`);
  console.log(`Common recommendations: ${comparison.commonRecommendations}`);
  console.log(`Unique to ${comparison.user1.name}: ${comparison.uniqueToUser1}`);
  console.log(`Unique to ${comparison.user2.name}: ${comparison.uniqueToUser2}`);
  
  if (comparison.commonCars.length > 0) {
    console.log('\n🤝 COMMON RECOMMENDATIONS:');
    comparison.commonCars.forEach(car => {
      console.log(`• ${car.car.year} ${car.car.make} ${car.car.model}`);
      console.log(`  ${comparison.user1.name}: ${car.user1Score}/100`);
      console.log(`  ${comparison.user2.name}: ${car.user2Score}/100`);
    });
  }
};

/**
 * Run all test scenarios
 */
const runTests = () => {
  console.log('🧪 RUNNING RECOMMENDATION ENGINE TESTS');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Get recommendations for specific users
    console.log('\n🔍 TEST 1: Individual User Recommendations');
    console.log('=' .repeat(40));
    
    const testUsers = ['user_001', 'user_002', 'user_003', 'user_004', 'user_005'];
    testUsers.forEach(userId => {
      const recommendations = getRecommendations(userId, 3);
      displayRecommendations(recommendations);
    });
    
    // Test 2: Get recommendations by name
    console.log('\n🔍 TEST 2: Recommendations by Name');
    console.log('=' .repeat(40));
    
    const nameRecommendations = getRecommendationsByName('Ava Martinez', 3);
    displayRecommendations(nameRecommendations);
    
    // Test 3: Custom criteria recommendations
    console.log('\n🔍 TEST 3: Custom Criteria Recommendations');
    console.log('=' .repeat(40));
    
    const customCriteria = {
      location: 'Austin, TX',
      budget: { min: 30000, max: 50000, preferred: 40000 },
      preferences: {
        bodyStyle: ['SUV'],
        fuelType: ['Hybrid'],
        features: ['Safety', 'Technology']
      },
      drivingHabits: {
        dailyMiles: 40,
        highwayPercentage: 50,
        cargoNeeds: 'Medium'
      },
      lifestyle: {
        family: true,
        outdoorActivities: true
      }
    };
    
    const customRecommendations = getCustomRecommendations(customCriteria, 3);
    displayRecommendations(customRecommendations);
    
    // Test 4: User comparison
    console.log('\n🔍 TEST 4: User Comparison');
    console.log('=' .repeat(40));
    
    const comparison = compareUserRecommendations('user_001', 'user_004');
    displayComparison(comparison);
    
    // Test 5: Summary statistics
    console.log('\n🔍 TEST 5: Summary Statistics');
    console.log('=' .repeat(40));
    
    const summary = getRecommendationSummary('user_002');
    console.log(`\n📊 SUMMARY FOR ${summary.user.name}:`);
    console.log(`Top recommendation: ${summary.topCar.car.year} ${summary.topCar.car.make} ${summary.topCar.car.model}`);
    console.log(`Top score: ${summary.topCar.score}/100`);
    console.log(`Average score across all cars: ${summary.averageScore}`);
    console.log(`Total options analyzed: ${summary.totalOptions}`);
    
    // Test 6: All users overview
    console.log('\n🔍 TEST 6: All Users Overview');
    console.log('=' .repeat(40));
    
    const allRecommendations = getAllUserRecommendations(1);
    console.log('\n👥 ALL USERS - TOP RECOMMENDATIONS:');
    allRecommendations.forEach(rec => {
      const topCar = rec.recommendations[0];
      console.log(`${rec.user.name}: ${topCar.car.year} ${topCar.car.make} ${topCar.car.model} (${topCar.score}/100)`);
    });
    
    console.log('\n✅ ALL TESTS COMPLETED SUCCESSFULLY!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

/**
 * Quick test function for specific user
 * @param {number} userId - User ID to test
 */
const quickTest = (userId = 'user_001') => {
  try {
    const recommendations = getRecommendations(userId, 5);
    displayRecommendations(recommendations);
  } catch (error) {
    console.error('❌ Quick test failed:', error.message);
  }
};

/**
 * Show available users
 */
const showUsers = () => {
  console.log('\n👥 AVAILABLE USERS:');
  console.log('=' .repeat(30));
  mockUsers.forEach(user => {
    console.log(`${user.id}. ${user.name} (${user.location}) - Budget: $${user.budget.min.toLocaleString()}-$${user.budget.max.toLocaleString()}`);
  });
};

/**
 * Show available cars
 */
const showCars = () => {
  console.log('\n🚗 AVAILABLE CARS:');
  console.log('=' .repeat(30));
  mockCars.forEach(car => {
    console.log(`${car.id}. ${car.year} ${car.make} ${car.model} ${car.trim} - $${car.dealerPrice.toLocaleString()}`);
  });
};

// Export functions for external use
export {
  runTests,
  quickTest,
  showUsers,
  showCars,
  displayRecommendations,
  displayComparison
};

// If running directly, execute tests
if (typeof window === 'undefined') {
  // Running in Node.js environment
  runTests();
}
