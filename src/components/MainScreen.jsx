import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import groupBy from 'lodash.groupBy';
import Toolbar from './Toolbar';
import MessageView from './MessageView';
import VirtualizedMessageView from './VirtualizedMessageView';
import MessageInput from './MessageInput';
import styles from '../styles/MainScreen.scss';

const MainScreen = ({ initialMessages }) => {
  const messageContainerRef = useRef();

  // set ref on each message so we can track unread messages
  const initialMessagesWithRef = initialMessages.map(message => ({ ...message, ref: useRef() }));
  const [chatMessages, setChatMessages] = useState(initialMessagesWithRef);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

  // scroll to bottom when sending a message
  useEffect(() => {
    if (messageContainerRef.current && shouldScrollToBottom) {
      messageContainerRef.current.scrollTo(0, messageContainerRef.current.scrollHeight + 300);
      const updatedChatMessages = chatMessages.map((chatMessage) => {
        if (chatMessage.direction === 'in' && chatMessage.status !== 'read') {
          return { ...chatMessage, status: 'read' };
        }
        return chatMessage;
      });
      setChatMessages(updatedChatMessages);
      setShouldScrollToBottom(false);
    }
  }, [messageContainerRef, shouldScrollToBottom]);

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

  const handleSetMessageAsRead = (id) => {
    const updatedChatMessages = chatMessages.map((chatMessage) => {
      if (chatMessage.id === id) {
        return { ...chatMessage, status: 'read' };
      }
      return chatMessage;
    });
    setChatMessages(updatedChatMessages);
  }

  const handleSubmit = (text) => {
    setChatMessages([...chatMessages, {
      id: chatMessages[chatMessages.length - 1].id,
      direction: 'out',
      status: 'sent',
      timestamp: `${moment().unix()}`,
      text,
      ref: React.createRef(),
    }]);
    setShouldScrollToBottom(true);
  };

  return (
    <div className={styles.container}>
      <Toolbar unreadTotal={unreadTotal} onGoToLastUnread={handleGoToLastUnread} />
      <MessageView
        messageContainerRef={messageContainerRef}
        groupedChatMessages={groupedChatMessages}
        onSetMessageAsRead={handleSetMessageAsRead}
      />
      <MessageInput onSubmit={handleSubmit} />
    </div>
  );
};

export default MainScreen;
