import chatMessages from './chat.json';
import MainScreen from './components/MainScreen';

// Sort by date on initialize
const sortedChatMessages = chatMessages
  .sort((a, b) => a.timestamp - b.timestamp);

const App = () => (
  <MainScreen initialMessages={sortedChatMessages} />
);

export default App;
