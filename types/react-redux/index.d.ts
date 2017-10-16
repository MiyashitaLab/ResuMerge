import { Dispatch } from 'redux';
declare module 'react-redux' {
  interface Connect {
    <State, OwnProps>(
      mapStateToProps: (state: State, owpProps?: OwnProps) => any,
      mapDispatchToProps: (dispatch: Dispatch<any>) => any
    ): ClassDecorator;
  }
}
