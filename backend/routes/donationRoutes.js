import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { 
  submitDonation, 
  getMyDonations, 
  getAvailableDonations, 
  acceptDonation,
  getMyMissions,
  getDonationById,
  updateDonationStatus 
} from '../controllers/donationController.js'

const router = express.Router()

router.route('/').post(protect, submitDonation)
router.route('/my').get(protect, getMyDonations)
router.route('/my-missions').get(protect, getMyMissions)
router.route('/available').get(protect, getAvailableDonations)
router.route('/:id/accept').patch(protect, acceptDonation)
router.route('/:id/status').patch(protect, updateDonationStatus)
router.route('/:id').get(protect, getDonationById)

export default router
