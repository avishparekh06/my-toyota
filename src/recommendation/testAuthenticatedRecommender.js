// Test script for the authenticated recommendation system
import { getAuthenticatedRecommendations } from './authenticatedRecommender.js';

// Mock user data that matches the actual user structure from the app
const mockAuthenticatedUser = {
  _id: "test_user_123",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  age: 35,
  location: {
    city: "Austin",
    state: "TX",
    country: "USA"
  },
  personal: {
    familyInfo: 4,
    avgCommuteDistance: 10,
    locationClimate: "Temperate",
    featurePreferences: ["Sunroof", "Heated Seats"],
    buildPreferences: ["SUV"],
    modelPreferences: ["Model Y"],
    fuelType: "EV",
    color: "White",
    year: 2025,
    buyingFor: "Self"
  },
  finance: {
    householdIncome: 120000,
    creditScore: 750,
    financeOrLease: "Finance",
    employmentStatus: "Employed",
    financingPriorities: ["Low Interest", "Low Down Payment"]
  },
  preferences: {
    purchaseType: "Finance",
    monthlyBudget: 800,
    preferredTermMonths: 60,
    downPayment: 10000,
    vehicleType: "SUV",
    modelInterest: ["Model Y"],
    features: ["Sunroof", "Heated Seats"]
  }
};

// Test the recommendation system
console.log('🧪 Testing Authenticated Recommendation System');
console.log('=' .repeat(50));

try {
  const recommendations = getAuthenticatedRecommendations(mockAuthenticatedUser, 3);
  
  console.log('\n✅ SUCCESS: Recommendations generated successfully!');
  console.log(`👤 User: ${recommendations.user.name}`);
  console.log(`📍 Location: ${recommendations.user.location.city}, ${recommendations.user.location.state}`);
  console.log(`💰 Budget: $${recommendations.user.budget.min.toLocaleString()} - $${recommendations.user.budget.max.toLocaleString()}`);
  console.log(`🎯 Preferred: $${recommendations.user.budget.preferred.toLocaleString()}`);
  
  console.log('\n📊 TOP RECOMMENDATIONS:');
  console.log('-'.repeat(50));
  
  recommendations.recommendations.forEach((rec, index) => {
    console.log(`\n${index + 1}. ${rec.car.year} ${rec.car.make} ${rec.car.model} ${rec.car.trim}`);
    console.log(`   💵 Price: $${rec.car.dealerPrice.toLocaleString()}`);
    console.log(`   🚙 Body: ${rec.car.bodyStyle} | ⛽ Fuel: ${rec.car.fuelType}`);
    console.log(`   ⭐ Score: ${rec.score}/100`);
    console.log(`   💡 Reasons:`);
    rec.reasons.forEach(reason => {
      console.log(`      • ${reason}`);
    });
  });
  
  console.log('\n📈 STATISTICS:');
  console.log(`Total cars analyzed: ${recommendations.totalCarsAnalyzed}`);
  console.log(`Cars filtered out: ${recommendations.carsFiltered}`);
  console.log(`Recommendations returned: ${recommendations.recommendationsReturned}`);
  
} catch (error) {
  console.error('❌ ERROR:', error.message);
  console.error('Stack trace:', error.stack);
}

console.log('\n🏁 Test completed!');
