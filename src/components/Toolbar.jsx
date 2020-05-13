import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import Person from '@material-ui/icons/Person';
import styles from '../styles/Toolbar.scss';

const Toolbar = ({ unreadTotal, onGoToLastUnread }) => (
  <Fragment>
    <div className={styles.topbar}>user101 {unreadTotal > 0 ? `(${unreadTotal} new messages)` : ''}</div>
    <div className={styles.toolbar}>
      <div className={styles.inline}>
        <IconButton>
          <ChevronLeft fontSize="large" />
        </IconButton>
        <Avatar className={styles.avatar}>
          <Person />
        </Avatar>
        <div className={styles.recipient}>
          <div>user113</div>
          <div>User is typing...</div>
        </div>
        {unreadTotal > 0 && (
          <Button className={styles.last_unread} onClick={onGoToLastUnread}>
            Last Unread
          </Button>
        )}
      </div>
    </div>
  </Fragment>
);

export default Toolbar;
