import localforage from 'localforage'

localforage.config({
  name: 'asov_pfm',
  storeName: 'asov_pfm_data',
  description: 'Data storage for PFM',
})

export default localforage
