export const convertTimeStamp = (stamp: number | string): string => {
   //designed to handle converting both Unix time stamps (number) and ISO dates (strings)
   const isISODate = typeof stamp === 'string';
   const date = isISODate ? new Date(stamp) : new Date((stamp as number) * 1000);
   return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};