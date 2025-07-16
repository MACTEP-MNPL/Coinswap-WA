import { Router } from "express";
import {rateController} from '../controllers/rateController.js'

export const rates = new Router()

rates.get('/usdt-rub', rateController.getUsdtRub)