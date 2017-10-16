import * as React from 'react';

interface ColProps {
  centering?: boolean;
}
const Col: React.SFC<ColProps> = props => {
  const rowStyle: React.CSSProperties = {
    display: 'flex',
    flex: '1 0 0',
    flexDirection: 'column',
    alignItems: props.centering ? 'center' : 'inherit',
    textAlign: props.centering ? 'center' : 'inherit',
    maxWidth: '100%',
  };

  const _props = { ...props };
  delete _props.centering;

  return (
    <div {..._props} style={rowStyle}>
      {props.children}
    </div>
  );
};
Col.defaultProps = {
  centering: false,
};

export default Col;
