import container from '@/configs/container.config';
import roleRequire from '@/configs/middleware.config.ts';
import { Role } from '@/constants/enum.ts';
import { TYPES } from '@/constants/types';
import { ArtworkController } from '@/controllers/artwork.controller';
import { validate } from '@/middlewares/validate.middleware.ts';
import { artworkSchema } from '@/schemas/artwork.schema.ts';
import { Router } from 'express';
import { permanentBan } from '@/configs/middleware.config.ts';
const router = Router();
const artworkController = container.get<ArtworkController>(
	TYPES.ArtworkController
);
router.get('/', artworkController.get);
router.get('/recommendations/following', roleRequire(), artworkController.getFollowingRecommendations);
router.get('/artist', roleRequire([Role.ARTIST]), artworkController.getForArtist);
router.get('/artist/:id', artworkController.getByArtistId);
router.get('/admin',roleRequire([Role.ADMIN]), artworkController.getForAdmin)
router.post('/admin/:id',roleRequire([Role.ADMIN]), artworkController.reviewArtwork)
// router.get('/artist', roleRequire([Role.ARTIST]), artworkController.getArtistArtwork);
router.post(
	'/',
	roleRequire([Role.ARTIST]),
	validate(artworkSchema._def.schema),
	permanentBan(),
	artworkController.add
);
router.get('/categories', artworkController.getCategory);
router.get('/:id', artworkController.getById);
router.put('/:id', roleRequire([Role.ARTIST]), artworkController.update);
router.delete('/:id', roleRequire([Role.ARTIST]), artworkController.delete);
router.post(
	'/:id/purchase',
	roleRequire([Role.USER, Role.ARTIST]),
	permanentBan(),
	artworkController.purchase
);
router.get('/:id/check-purchased', roleRequire([Role.USER, Role.ARTIST]), artworkController.checkPurchaseStatus);
// router.get('/download/:id',roleRequire([Role.USER, Role.ARTIST]), artworkController.downloadArtwork);

// Routes cho việc xử lý view
router.post('/:id/view', artworkController.incrementView); // Tăng lượt xem


export default router;
