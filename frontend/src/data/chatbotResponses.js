export const chatbotResponses = {
  hello: "Hello! Welcome to FoodShare AI 👋 How can I help you reduce food waste today?",
  hi: "Hi there! I'm your AI assistant. Ready to help you with redistribution?",
  donate: "To donate food, please go to the 'Donate' section in the navigation bar. You can fill in the surplus details and our AI will predict the quantity and find the best NGO match for you.",
  ngo: "Nearby NGOs are visible on your dashboard map. Once you post a donation, our real-time matching system will notify the 3 closest verified NGOs.",
  freshness: "Food freshness is our priority. Preparation time and storage conditions are analyzed by our AI CNN model to ensure all redistributed food is safe and high quality.",
  track: "You can track the real-time redistribution status of your donations directly from the 'Missions' or 'History' section on your dashboard.",
  ai: "Our AI system uses deep learning to predict surplus food quantities and optimize matching between donors and NGOs to minimize travel time.",
  location: "Please pin your exact pickup location on the map during the donation process. This helps our logistics system calculate the fastest route for NGOs.",
  thank: "You're very welcome! ❤️ Together, we've saved thousands of meals. Every donation makes a difference.",
  thanks: "Happy to help! Let me know if there's anything else you need to know about FoodShare AI.",
  help: "I can help you with: \n1. Donating Food\n2. Finding NGOs\n3. Freshness Verification\n4. AI Predictions\nWhat would you like to know more about?",
  impact: "So far, our community has saved over 12,000 meals! You can see live stats in the 'Impact' section of the platform.",
  contact: "You can reach our support team at support@foodshare.ai or call our 24/7 helpline at +91 1800-FOOD-AI.",
};

export const getSimulatedAIResponse = (keyword) => {
  if (keyword.includes('demand')) return "AI Insight: High demand for surplus food detected in your area right now.";
  if (keyword.includes('score')) return "AI Analysis: Your last donation had a 95% freshness score. Excellent quality!";
  if (keyword.includes('match')) return "AI Optimization: Best NGO match found within 3.2 km for your location.";
  return null;
};
