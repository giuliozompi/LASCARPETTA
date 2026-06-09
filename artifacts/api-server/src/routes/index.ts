import { Router, type IRouter } from "express";
import healthRouter from "./health";
import menuRouter from "./menu";
import galleryRouter from "./gallery";
import eventsRouter from "./events";
import reservationsRouter from "./reservations";
import cateringRouter from "./catering";
import reviewsRouter from "./reviews";
import adminRouter from "./admin";
import translateRouter from "./translate";

const router: IRouter = Router();

router.use(healthRouter);
router.use(menuRouter);
router.use(galleryRouter);
router.use(eventsRouter);
router.use(reservationsRouter);
router.use(cateringRouter);
router.use(reviewsRouter);
router.use(adminRouter);
router.use(translateRouter);

export default router;
