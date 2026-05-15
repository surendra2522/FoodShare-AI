import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_FILE = path.join(__dirname, '../data/db.json')

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, '../data'))) {
  fs.mkdirSync(path.join(__dirname, '../data'))
}

// Initial state
const initialState = {
  users: [],
  donations: [],
  notifications: []
}

// Load DB
const loadDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialState, null, 2))
    return initialState
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
}

// Save DB
const saveDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

export const db = {
  get: (collection) => loadDB()[collection],
  
  find: (collection, query) => {
    const data = loadDB()[collection]
    return data.find(item => Object.keys(query).every(key => item[key] === query[key]))
  },
  
  filter: (collection, query) => {
    const data = loadDB()[collection]
    return data.filter(item => Object.keys(query).every(key => item[key] === query[key]))
  },
  
  insert: (collection, item) => {
    const data = loadDB()
    const newItem = { ...item, _id: Date.now().toString() }
    data[collection].push(newItem)
    saveDB(data)
    return newItem
  },
  
  update: (collection, id, updates) => {
    const data = loadDB()
    const index = data[collection].findIndex(item => item._id === id)
    if (index !== -1) {
      data[collection][index] = { ...data[collection][index], ...updates }
      saveDB(data)
      return data[collection][index]
    }
    return null
  }
}
