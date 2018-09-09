import Account from './account';
import Curve from './crypto/curves';
import Provider from './requests/provider';
import Rpc from './rpc';

const tezjs = {
  account: Account,
  curve: Curve,
  provider: Provider,
  rpc: Rpc
};

export default tezjs;
