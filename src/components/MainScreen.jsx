import React, { useState, useRef } from 'react';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import MessageView from './MessageView';
import styles from '../styles/MainScreen.scss';

const MainScreen = ({ initialMessages }) => {
  const [newMessage, setNewMessage] = useState('');
  const messageContainerRef = useRef();

  // scroll to bottom when sending a message
  // useEffect(() => {
  //   if (messageContainerRef.current && newMessage === '') {
  //     messageContainerRef.current.scrollTo(0, messageContainerRef.current.scrollHeight + 300);
  //     const updatedChatMessages = chatMessages.map((chatMessage) => {
  //       if (chatMessage.direction === 'in' && chatMessage.status !== 'read') {
  //         return { ...chatMessage, status: 'read' };
  //       }
  //       return chatMessage;
  //     });
  //     setChatMessages(updatedChatMessages);
  //   }
  // }, [newMessage, initialMessages]);

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      setChatMessages([...chatMessages, {
        id: chatMessages[chatMessages.length - 1].id,
        direction: 'out',
        status: 'sent',
        timestamp: `${moment().unix()}`,
        text: newMessage,
      }]);
      setNewMessage('');
    }
  };

  return (
    <div className={styles.container}>
      <MessageView messageContainerRef={messageContainerRef} initialMessages={initialMessages} />
      <div>
        <TextField
          placeholder="Send a message..."
          multiline
          rows="4"
          rowsMax="4"
          variant="outlined"
          className={styles.input}
          value={newMessage}
          onChange={handleNewMessageChange}
          onKeyPress={handleSubmit}
        />
      </div>
    </div>
  );
};

export default MainScreen;
