import React, { Fragment, useState, useRef } from 'react';
import { VariableSizeList as List } from 'react-window';
import moment from 'moment';
import groupBy from 'lodash.groupBy';
import Toolbar from './Toolbar';
import Message from './Message';
import styles from '../styles/MessageView.scss';

const MessageView = ({ messageContainerRef, initialMessages }) => {
  // set ref on each message so we can track unread messages
  const initialMessagesWithRef = initialMessages.map(message => ({ ...message, ref: useRef() }));
  const [chatMessages, setChatMessages] = useState(initialMessagesWithRef);

  // group messages by date
  const groupedChatMessages = groupBy(chatMessages, (chatMessage) => {
    return moment.unix(chatMessage.timestamp).startOf('day').format('MMMM DD, YYYY');
  });

  // get total unread messages to display at the top
  const unreadTotal = chatMessages.reduce((acc, current) => {
    if (current.direction === 'in' && current.status !== 'read') {
      return acc + 1;
    }
    return acc;
  }, 0);

  const handleGoToLastUnread = () => {
    const lastUnread = chatMessages.find(chatMessage => chatMessage.direction === 'in' && chatMessage.status !== 'read');
    if (messageContainerRef.current) {
      if (lastUnread && lastUnread.ref.current) {
        messageContainerRef.current.scrollTo(0, lastUnread.ref.current.offsetTop - 130);
      } else {
        messageContainerRef.current.scrollTo(0, messageContainerRef.current.offsetTop);
      }
    }
  };

  // triggered when message is displayed in viewport
  const handleMessageDisplay = (message) => {
    if (message.direction === 'in' && message.status !== 'read') {
      const updatedChatMessages = chatMessages.map((chatMessage) => {
        if (chatMessage.id === message.id) {
          return { ...chatMessage, status: 'read' };
        }
        return chatMessage;
      });
      setChatMessages(updatedChatMessages);
    }
  };

  // get height of each message group for virtualized rendering
  const getItemSize = (index) => {
    const messageGroup = groupedChatMessages[Object.keys(groupedChatMessages)[index]];
    const height = messageGroup.reduce((acc, message) => {
      return message.ref.current ? acc + message.ref.current.offsetHeight : acc + 65;
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
      <Toolbar unreadTotal={unreadTotal} onGoToLastUnread={handleGoToLastUnread} />
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

export default MessageView;
