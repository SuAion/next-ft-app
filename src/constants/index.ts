export enum RESPONSE_STATUS {
  SUCCESS = '000',
  NETWORK = 'net_work',
  OTHER_ERROR = 'other_error',
}

export const FILTER_ARR = [
  {
    name: 'Hot',
    key: 'hot',
  },
  {
    name: 'Newest',
    key: 'newest',
  },
];

export const ROUTER_ARR = {
  homePage: '/',
  center: '/p',
};


export const formatEnDateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export const formatEnDateTimeOptions: Intl.DateTimeFormatOptions = {
  ...formatEnDateOptions,
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false, // 24小时制，不显示AM/PM
};
