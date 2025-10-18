// Mock user dataset for MongoDB compatibility
import usersData from './users.json';

// Export the users data
export const mockUsers = usersData;

// Helper function to get user by ID
export const getUserById = (userId) => {
  return mockUsers.find(user => user._id === userId || user.id === userId);
};

// Helper function to get all users
export const getAllUsers = () => {
  return mockUsers;
};

// Helper function to get user by name
export const getUserByName = (name) => {
  return mockUsers.find(user => 
    user.name.toLowerCase().includes(name.toLowerCase())
  );
};

// Helper function to get users by location
export const getUsersByLocation = (city, state) => {
  return mockUsers.filter(user => 
    user.location.city.toLowerCase() === city.toLowerCase() && 
    user.location.state.toLowerCase() === state.toLowerCase()
  );
};

// Helper function to get users by age range
export const getUsersByAgeRange = (minAge, maxAge) => {
  return mockUsers.filter(user => user.age >= minAge && user.age <= maxAge);
};

// Helper function to get users by budget range
export const getUsersByBudgetRange = (minBudget, maxBudget) => {
  return mockUsers.filter(user => 
    user.budget.min >= minBudget && user.budget.max <= maxBudget
  );
};

// Helper function to get users by family size
export const getUsersByFamilySize = (familySize) => {
  return mockUsers.filter(user => user.familySize === familySize);
};
