import { Hono } from "hono";
import { categoryController } from "./category.controller";
zValidator
import { categorySchema } from "./category.schema";
import { zValidator } from "../../libraries/zod-validatior.library";

const categoryRouter = new Hono();

categoryRouter.get("/", categoryController.all);
categoryRouter.get("/:id", categoryController.show);
categoryRouter.post("/", zValidator('json', categorySchema), categoryController.store);
categoryRouter.put("/:id", zValidator('json', categorySchema), categoryController.update);
categoryRouter.delete("/:id", categoryController.delete);

export { categoryRouter };