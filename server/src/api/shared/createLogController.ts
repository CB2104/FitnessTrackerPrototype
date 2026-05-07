import { factories } from "@strapi/strapi";

type ContentType = "api::food-log.food-log" | "api::activity-log.activity-log";

export const createLogController = (uid: ContentType) =>
  factories.createCoreController(uid, ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;

      if (!user) return ctx.unauthorized("Login required");

      const body = ctx.request.body.data;
      body.users_permissions_user = user.id;

      const entry = await strapi.entityService.create(uid, {
        data: body,
        populate: { users_permissions_user: true },
      });
      return entry;
    },

    async find(ctx) {
      const user = ctx.state.user;

      return strapi.entityService.findMany(uid, {
        filters: { users_permissions_user: user.id },
        populate: { users_permissions_user: true },
      });
    },

    async findOne(ctx) {
      const user = ctx.state.user;
      const { id } = ctx.params;

      const result = await strapi.entityService.findMany(uid, {
        filters: { id, users_permissions_user: user.id },
        populate: { users_permissions_user: true },
      });

      if (!result.length) return ctx.notFound("Not found or not yours");
      return result[0];
    },
  }));
