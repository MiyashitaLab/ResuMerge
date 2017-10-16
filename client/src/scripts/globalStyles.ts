import 'react-select/dist/react-select.css';
import 'react-day-picker/lib/style.css';
import { StyleSheet } from 'aphrodite/no-important';

const extended = (StyleSheet as any).extend([
  {
    selectorHandler: (s: any, _: any, g: any) => (_.includes(':global') ? g(s) : null),
  },
]);

const styles = (extended.StyleSheet as typeof StyleSheet).create({
  ':global': {
    '*': {
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    },
    body: {
      margin: 0,
      padding: 0,
      backgroundColor: '#78909C',
      color: '#FAFAFA',
      lineHeight: 1.5,
      fontFamily: 'system-ui, sans-serif',
    },
    button: {
      border: 'none',
      color: 'inherit',
      cursor: 'pointer',
      outline: 'none',
    },
    h1: {
      fontSize: '2.0rem',
    },
    h2: {
      fontSize: '1.75rem',
    },
    h3: {
      fontSize: '1.5rem',
    },
    '* + *': {
      marginTop: '1.25em',
    },
    '.Select * + *, .DayPickerInput * + *': {
      marginTop: 'initial',
    },
  },
});

export default extended.css(styles[':global']);
