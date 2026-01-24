import request from '@/utils/request';

// exporter-types-string
export const exporterTypes = () => {
  return request( {
    url: "/prometheus/exporter/types",
    method: 'GET',
  })
}

// exporter-types
export const exporterTypesItems = () => {
  return request( {
    url: "/prometheus/type/list",
    method: 'GET',
  })
}
