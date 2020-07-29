import Confidence from "confidence"
import dotenv from "dotenv"
import AppConfig from "./config"

dotenv.config()
const criteria = {
  env: process.env.NODE_ENV
}

const manifest = {
  $meta: "Our main server manifest",
  server: {},
  connections: [AppConfig.get("/server")],
  registrations: [{
      plugin: "hapi-auth-jwt2"
    },
    {
      plugin: "inert"
    },
    {
      plugin: "vision"
    },
    {
      plugin: {
        register: "hapi-swagger",
        options: AppConfig.get("/api")
      }
    },
    {
      plugin: {
        register: 'good',
        options: AppConfig.get("/logging")
      }
    },
    {
      plugin: {
        register: "./plugins/mongo",
        options: AppConfig.get("/mongo")
      }
    },
    {
      plugin: {
        register: "./plugins/auth",
        options: AppConfig.get("/auth")
      }
    },
    {
      plugin: {
        register: "./plugins/hapi-rate-limit",
        options: AppConfig.get("/ratelimit")
      }
    },
    {
      plugin: {
        register: './socket'
      }
    },
    {
      plugin: "./users"
    },
    {
      plugin:"./posts"      
    },
    {
      plugin:"./chats"
    },
    {
      plugin:"./followers"
    },
    {
      plugin:"./friends"
    }
  ]
}

const store = new Confidence.Store(manifest)

export default {
  get: key => store.get(key, criteria),
  meta: key => store.meta(key, criteria)
}