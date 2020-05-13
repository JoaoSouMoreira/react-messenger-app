import React, { Fragment } from 'react';
import { VariableSizeList as List } from 'react-window';
import Message from './Message';
import styles from '../styles/MessageView.scss';

const MessageView = ({ messageContainerRef, groupedChatMessages, onSetMessageAsRead }) => {
  // triggered when message is displayed in viewport
  const handleMessageDisplay = (message) => {
    if (message.direction === 'in' && message.status !== 'read') {
      onSetMessageAsRead(message.id);
    }
  };

  return (
    <div className={styles.messages_container} ref={messageContainerRef}>
      {Object.keys(groupedChatMessages).map(messagesDate => (
        <Fragment>
          <div className={styles.bubble_container}>
            <div className={styles.date_bubble}>
              {messagesDate}
            </div>
          </div>
          {groupedChatMessages[messagesDate].map(chatMessage => (
            <Message key={chatMessage.id} message={chatMessage} onMessageDisplay={handleMessageDisplay} />
          ))}
        </Fragment>
      ))}
    </div>
  );
}

export default MessageView;
