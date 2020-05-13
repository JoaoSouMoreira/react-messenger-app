import React from 'react';
import moment from 'moment';
import IntersectionVisible from 'react-intersection-visible';
import Done from '@material-ui/icons/Done';
import DoneAll from '@material-ui/icons/DoneAll';
import { blue, grey } from '@material-ui/core/colors';
import classNames from 'classnames';
import styles from '../styles/Message.scss';

const getMessageStatus = (status) => {
  switch(status) {
    case 'received':
      return <DoneAll style={{ color: grey[500] }} />;
    case 'read':
      return <DoneAll style={{ color: blue[500] }} />;
    default:
      return <Done style={{ color: grey[500] }} />;
  }
}

const Message = ({ message, onMessageDisplay }) => (
  <IntersectionVisible
    onShow={() => onMessageDisplay(message)}
  >
    <div
      className={classNames(styles.box, message.direction === 'in' ? styles.push_left : styles.push_right)}
      ref={message.ref}
    >
      <div className={classNames(styles.container)}>
        <div>{message.text}</div>
        <div className={styles.time_and_status}>
          <div className={styles.time}>{moment.unix(message.timestamp).format('H:mm')}</div>
          {message.direction === 'out' && <div>{getMessageStatus(message.status)}</div>}
        </div>
      </div>
    </div>
  </IntersectionVisible>

);

export default Message;
