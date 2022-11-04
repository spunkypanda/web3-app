export function getWalletAddress(address: string | null | undefined) {
  if (!address) return '';
  return `${address.slice(0, 8)}....${address.slice(34, 42)}`;
};
