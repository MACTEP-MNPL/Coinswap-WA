import express from 'express'
import cors from 'cors'
import { loggerMiddleware } from './loggerMiddleware.js'

const { Router, json, urlencoded } = express

export const basicMiddlewares = Router()
  .use(cors({
    origin: '*',
  }
  ))
  //.use((req, res, next) => {
  //  console.log('🔍 BEFORE JSON PARSING:')
  //  console.log('Content-Type:', req.headers['content-type'])
  //  console.log('Content-Length:', req.headers['content-length'])
  //  console.log('Method:', req.method)
  //  console.log('URL:', req.url)
  //  console.log('Raw Headers:', req.headers)
  //  next()
  //})
  .use(json({ limit: '10mb' }))
  //.use((req, res, next) => {
  //  console.log('🔍 AFTER JSON PARSING:')
  //  console.log('Body:', req.body)
  //  console.log('Body type:', typeof req.body)
  //  console.log('Body keys:', Object.keys(req.body || {}))
  //  next()
  //})
  .use(urlencoded({ extended: true }))
  .use(loggerMiddleware)