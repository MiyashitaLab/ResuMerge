import * as React from 'react';

const Centering: React.SFC = props => {
  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    flexWrap: 'wrap',
  };

  const _props = { ...props } as any;

  return (
    <div {..._props} style={{ ...style, ..._props.style ? _props.style : {} }}>
      {props.children}
    </div>
  );
};

export default Centering;
