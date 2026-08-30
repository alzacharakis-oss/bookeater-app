import { Router } from 'express';
import * as userBookController from '../controllers/userBookController';
import { requireAuth } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserBook:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         status:
 *           type: string
 *           enum: [wishlist, read]
 *         rating:
 *           type: integer
 *           nullable: true
 *           example: 4
 *         book:
 *           $ref: '#/components/schemas/Book'
 */

/**
 * @swagger
 * /api/user-books:
 *   get:
 *     summary: Get the logged-in user's book list (wishlist + read)
 *     tags: [UserBooks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of the user's books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserBook'
 *       401:
 *         description: No token provided
 */

router.get('/', requireAuth, userBookController.getUserBooks);

/**
 * @swagger
 * /api/user-books:
 *   post:
 *     summary: Add a book to the logged-in user's wishlist
 *     tags: [UserBooks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookId]
 *             properties:
 *               bookId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Book added to wishlist
 *       409:
 *         description: Book already in the user's list
 */

router.post('/', requireAuth, userBookController.addToWishlist);

/**
 * @swagger
 * /api/user-books/{id}:
 *   patch:
 *     summary: Update status or rating of a user's book entry
 *     tags: [UserBooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [wishlist, read]
 *               rating:
 *                 type: integer
 *                 nullable: true
 *                 example: 5
 *     responses:
 *       200:
 *         description: Entry updated
 *       400:
 *         description: Invalid rating, or book not marked as read
 *       403:
 *         description: You do not own this entry
 *       404:
 *         description: Entry not found
 */

router.patch('/:id', requireAuth, userBookController.updateUserBook);

/**
 * @swagger
 * /api/user-books/{id}:
 *   delete:
 *     summary: Remove a book from the logged-in user's list
 *     tags: [UserBooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Entry removed
 *       403:
 *         description: You do not own this entry
 *       404:
 *         description: Entry not found
 */

router.delete('/:id', requireAuth, userBookController.removeUserBook);

export default router;