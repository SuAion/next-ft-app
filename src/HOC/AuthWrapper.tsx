import { globalStore } from '@/store/globalStore';

type propsState = {
  authority?: string;
  children: React.ReactNode[] | string | React.ReactElement;
};
const AuthPermissions = (props: propsState) => {
  const { authority = '', children } = props;
  const { permissions } = globalStore();
  const auth = authority ? permissions.includes(authority) : authority;
  return <>{(auth || authority == '') && children}</>;
};
export default AuthPermissions;
