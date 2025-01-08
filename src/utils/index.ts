import { formatEnDateOptions, formatEnDateTimeOptions } from '@/constants';

// 加载签名脚本的方法
export function loadSignScript(): Promise<any> {
  return new Promise(async resolve => {
    // 检查是否已经加载了登录脚本
    if (window['login'] && window['login'].showLogin) {
      resolve(true);
    } else {
      // 创建并添加脚本标签以加载签名脚本
      const bodyScript = document.createElement('script');
      bodyScript.setAttribute('src', process.env.NEXT_PUBLIC_SIGN_SDK as string);
      bodyScript.defer = true;
      bodyScript.onload = function onLoad() {
        resolve(true);
      };
      bodyScript.onerror = function onLoad() {
        resolve(true);
      };
      document.body.appendChild(bodyScript);
    }
  });
}

// 加载支付脚本的方法
export const loadPaymentScript = () => {
  return new Promise<void>((resolve, reject) => {
    // 检查是否已经加载了支付脚本
    if (window['Payment']) {
      resolve();
    } else {
      // 创建并添加脚本标签以加载支付脚本
      const script = document.createElement('script');
      script.setAttribute('src', process.env.NEXT_PUBLIC_PAYMENT_SDK!);
      script.defer = true;
      script.onload = () => {
        resolve();
      };
      script.onerror = err => {
        reject(err);
      };
      document.body.appendChild(script);
    }
  });
};

// 检测浏览器操作系统信息的方法
export function myBrowserOS() {
  if (typeof window === undefined) {
    return { isMobile: false };
  }
  let u = window.navigator.userAgent;
  let uLower = window.navigator.userAgent.toLowerCase();
  return {
    // 移动终端浏览器版本信息
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
    mac: u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1, //是否iPad
    // isMobile: /Android|webOS|iPhone|iPod|BlackBerry/i.test(u),
    isMobile: /iPad|iPhone|iOS|UCWEB|Android|webOS|BlackBerry|hpwOS|SymbianOS|Windows Phone|Mobile/i.test(u),
    isSafari: !!uLower.match(/version\/([\d.]+).*safari/),
    isOpera: !!uLower.match(/opera.([\d.]+)/),
    isChrome: !!uLower.match(/chrome\/([\d.]+)/),
    isFirefox: !!uLower.match(/firefox\/([\d.]+)/),
    isEdge: !!uLower.match(/edge\/([\d.]+)/),
    isIE: !!uLower.match(/msie ([\d.]+)/) || !!uLower.match(/rv:([\d.]+)\) like gecko/),
  };
}

// 格式化数字的方法
export const formatDigital = (value: number) => {
  if (value <= 0) return value;
  else if (value > 0 && value <= 999) return value;
  else if (value > 999 && value < 10000) {
    return `${Math.floor(value / 1000)}${Math.floor((value % 1000) / 100) > 0 ? `.${Math.round((value % 1000) / 100)}` : ''
      }k`;
  } else if (value === 10000) return '10k';
  else if (value > 10000 && value < 100000) return `${Math.floor(value / 1000)}k+`;
  else return '99k+';
};

// 根据窗口宽度返回列数的方法
export function ChangeColumn() {
  try {
    if (window.innerWidth >= 1600) {
      return 6;
    } else if (window.innerWidth >= 1280 && window.innerWidth <= 1600) {
      return 5;
    } else if (window.innerWidth >= 960 && window.innerWidth <= 1280) {
      return 4;
    } else if (window.innerWidth < 960 && window.innerWidth > 750) {
      return 3;
    } else if (window.innerWidth <= 750) {
      return 2;
    } else {
      return 1;
    }
  } catch {
    return 6;
  }
}

// 将预览图片信息转换为标准格式的方法
export const translateFn = (previewImage: any) => {
  const { pictureRatioInfo, pictureTypeInfo, content, text, createContent, taskId } = previewImage;
  const { ratio } = pictureRatioInfo || {};
  const { title, userStrength } = pictureTypeInfo || {};
  return {
    ...previewImage,
    id: taskId,
    styleName: title,
    pictureSimilarity: userStrength,
    pictureRatio: ratio,
    channel: previewImage.channel || previewImage.aiToolType,
    prompt: content || text || createContent,
  };
};

// 将时间戳转换为日期字符串的方法
export const timeStampChange = (timestamp?: string | number | undefined) => {
  const options: any = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return new Date(timestamp as any).toLocaleString('en-US', options);
};

// 根据时间戳和UTC标志返回格式化的日期或日期时间字符串的方法
export function formatTimestamp2EnDate(timestamp: number, utc = true, withTime = false) {
  let options = withTime ? formatEnDateTimeOptions : formatEnDateOptions;
  if (utc) {
    options = { ...options };
    options.timeZone = 'UTC';
  }
  return new Date(timestamp).toLocaleString('en-US', options);
}

// 根据时间戳和语言对象返回时间描述的方法
export const formatTimeDesc = (timestamp: string | number, t: any) => {
  try {
    const delta = Date.now() - Number(timestamp);
    if (delta < 1 * 60 * 1000) {
      const seconds = Math.floor(delta / 1000);
      if (seconds > 1) {
        return t('aigc_challenge_seconds_ago', { seconds });
      } else {
        return t('aigc_challenge_second_ago');
      }
    } else if (delta < 1 * 60 * 60 * 1000) {
      const minutes = Math.floor(delta / 1000 / 60);
      if (minutes > 1) {
        return t('aigc_challenge_minutes_ago', { minutes });
      } else {
        return t('aigc_challenge_minute_ago');
      }
    } else if (delta < 1 * 24 * 60 * 60 * 1000) {
      const hours = Math.floor(delta / 1000 / 60 / 60);
      if (hours > 1) {
        return t('aigc_challenge_hours_ago', { hours });
      } else {
        return t('aigc_challenge_hour_ago');
      }
    } else if (delta < 2 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(delta / 1000 / 60 / 60 / 24);
      if (days > 1) {
        return t('aigc_challenge_days_ago', { days });
      } else {
        return t('aigc_challenge_day_ago');
      }
    } else {
      return timeStampChange(timestamp);
    }
  } catch (err) {
    console.error(err);
  }

  return '';
};

// 根据索引和文件后缀生成文件名的方法
export const generateFileName = (index?: number, fileSuffix = '.jpg') => {
  const d = new Date();
  let date =
    d.getFullYear() +
    '' +
    (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) +
    '' +
    (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) +
    '' +
    d.getHours() +
    '' +
    d.getMinutes() +
    '' +
    d.getSeconds();
  if (index && index > 0) {
    date += '_' + index;
  }
  return 'fotor-ai-' + date + fileSuffix;
};

// 获取Cookie的方法
export const getCookie = name => {
  var value = '; ' + document.cookie;
  var parts = value.split('; ' + name + '=');
  return parts.pop().split(';').shift();
};

// 设置Cookie的方法
export function setCookie(name, value, expires = 60 * 60 * 24 * 30 * 1000) {
  let hostName = window.document.location.hostname;
  if (!['localhost', '127.0.0.1'].includes(hostName)) {
    hostName = '.fotor.com';
  }
  const exp: any = new Date();
  exp.setTime(exp.getTime() + expires);
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/;domain=' + hostName;
}

// 处理替代文本的方法
export function handelAlt({ aigc_prompt, brief, cladue3_prompt }) {
  let title = '';
  if (aigc_prompt) {
    title = aigc_prompt
      .replace(/[^\w\s]/gi, '')
      .split(' ')
      .filter((item: any, idx: number) => idx < 15)
      .join(' ');
  } else if (brief) {
    title = brief;
  } else if (cladue3_prompt) {
    title = cladue3_prompt
      .split(',')
      .filter((item: string, idx: number) => idx < 15)
      .map((item: string) => item.trim())
      .join(' ');
  }
  return title;
}

// 检查是否为Firefox浏览器的方法
export const checkIsFirefox = () => {
  if (typeof window === 'undefined') return false;
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
};

// 打开新窗口的方法
export function openNewUrl(url) {
  window.open(url, '_blank');
}

// 构建Google FAQ SEO数据的方法
export const buildGoogleFaqSeo = (faqData: any): any => {
  const temp: any = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [],
  };
  if (faqData && faqData.qnaList) {
    for (let i = 0; i < faqData.qnaList.length; i++) {
      temp.mainEntity.push({
        '@type': 'Question',
        name: faqData.qnaList[i].question,
        acceptedAnswer: { '@type': 'Answer', text: faqData.qnaList[i].answer },
      });
    }
  } else {
    return null;
  }
  return temp;
};

// 根据作品ID生成作品URL的方法
export function HANDEL_WORK_URL(id) {
  return `${process.env.NEXT_PUBLIC_ENV !== 'development' ? 'https://u-static.fotor.com' : 'https://test-u-static.fotor.com'
    }/share/works/${id}.jpg`;
}

// 根据ID跳转到个人页面的方法
export function gotoPersonalPageWithId(id?: string) {
  if (typeof window !== 'undefined' && id) {
    window.open(`/p/${id}`, '_blank');
  }
}


// 时间格式化操作，（以东八区北京时间为准）
export function timeFormat(time, getHours = true, symbol = "-") {
  let date = new Date(time);
  let timezoneOffset = date.getTimezoneOffset();
  date = new Date(date.getTime() + (timezoneOffset + 480) * 60 * 1000);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hours;
  let minutes;
  let seconds;
  month = month > 9 ? month : "0" + month;
  day = day > 9 ? day : "0" + day;
  if (getHours) {
    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();
    hours = hours > 9 ? hours : "0" + hours;
    minutes = minutes > 9 ? minutes : "0" + minutes;
    seconds = seconds > 9 ? seconds : "0" + seconds;
    return {
      str: year + symbol + month + symbol + day
        + " " + hours + ":" + minutes + ":" + seconds,
      timeStamp: date.getTime()
    };
  } else {
    return {
      str: year + symbol + month + symbol + day,
      timeStamp: date.getTime()
    };
  }
}