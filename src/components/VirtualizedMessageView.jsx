import React, { Fragment } from 'react';
import { VariableSizeList as List } from 'react-window';
import Message from './Message';
import styles from '../styles/MessageView.scss';

const VirtualizedMessageView = ({ messageContainerRef, groupedChatMessages, onSetMessageAsRead }) => {
  // triggered when message is displayed in viewport
  const handleMessageDisplay = (message) => {
    if (message.direction === 'in' && message.status !== 'read') {
      onSetMessageAsRead(message.id);
    }
  };

  // get height of each message group for virtualized rendering
  const getItemSize = (index) => {
    const messageGroup = groupedChatMessages[Object.keys(groupedChatMessages)[index]];
    const height = messageGroup.reduce((acc, message) => {
      return message.ref && message.ref.current ? acc + message.ref.current.offsetHeight : acc + 65;
    }, 58);

    return height;
  }

  const MessageGroup = ({ index, style }) => {
    const messageDate = Object.keys(groupedChatMessages)[index];
    return (
      <div style={style}>
        <div className={styles.bubble_container}>
          <div className={styles.date_bubble}>
            {messageDate}
          </div>
        </div>
        {groupedChatMessages[messageDate].map(chatMessage => (
          <Message key={chatMessage.id} message={chatMessage} onMessageDisplay={handleMessageDisplay} />
        ))}
      </div>
    );
  }

  return (
    <Fragment>
      <div className={styles.messages_container} ref={messageContainerRef}>
        <List
          height={messageContainerRef.current ? messageContainerRef.current.offsetHeight : 600}
          itemCount={Object.keys(groupedChatMessages).length}
          itemSize={getItemSize}
          width={800}
        >
          {MessageGroup}
        </List>
      </div>
    </Fragment>
  );
}

export default VirtualizedMessageView;
