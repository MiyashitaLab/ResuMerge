import * as React from 'react';

interface RowProps {
  className?: string;
  centering?: boolean;
}
const Row: React.SFC<RowProps> = props => {
  const rowStyle: React.CSSProperties = {
    display: 'flex',
    flex: '0 1 auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: props.centering ? 'center' : 'inherit',
    textAlign: props.centering ? 'center' : 'inherit',
  };

  const _props = { ...props };
  delete _props.centering;

  return (
    <div {..._props} style={rowStyle}>
      {props.children}
    </div>
  );
};
Row.defaultProps = {
  centering: false,
};

export default Row;
