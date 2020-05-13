import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import styles from '../styles/MessageInput.scss';

const MessageInput = ({ onSubmit }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    if (event.key === 'Enter' && !!newMessage.trim()) {
      event.preventDefault();
      onSubmit(newMessage);
      setNewMessage('');
    }
  }

  return (
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
  );
}

export default MessageInput;
