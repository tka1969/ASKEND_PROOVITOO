export const getVersion = (() => {
  let version: number = 1;
  //return () => `${version++}`;
  return () => version++;
})();
