export const prefix = 'tdesign-starter';
export const TOKEN_NAME = 'tdesign-starter';

// 处理参数
export const buildBracketQueryString = (params) => {
  const pairs = [];
  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      // 处理 orders[0][column]=xxx 格式
      value.forEach((item, i) => {
        if (item && typeof item === 'object') {
          for (let [subKey, subVal] of Object.entries(item)) {
            if (subVal != null) {
              if (subKey === 'descending') {
                subKey = 'asc';
                subVal = !Boolean(subVal);
              }
              if (subKey === 'sortBy') {
                subKey = 'column';
                // 在小写+大写之间插入下划线 + 全部转小写
                subVal = subVal.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
              }
              const fullKey = `${key}[${i}].${subKey}`;
              pairs.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(String(subVal))}`);
            }
          }
        }
      });
    } else {
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }
  return pairs.length ? '?' + pairs.join('&') : '';
}

// 全局常量
export const grafanaDomain = import.meta.env.VITE_GRAFANA_DOMAIN ?? '';
export const prometheusDomain = import.meta.env.VITE_PROMETHEUS_DOMAIN ?? '';
export const datasource = import.meta.env.VITE_DATASOURCE ?? '';
export const appName = import.meta.env.VITE_APP_NAME ?? '';
export const appCnName = import.meta.env.VITE_APP_CN_NAME ?? '';
export const banQuan = import.meta.env.VITE_BAN_QUAN ?? '';
export const beiAn = import.meta.env.VITE_BEI_AN ?? '';
