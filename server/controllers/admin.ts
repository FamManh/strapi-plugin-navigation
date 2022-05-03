import { assertIsNumber, IAdminService, ICommonService, NavigationService, NavigationServiceName, ToBeFixed } from "../../types";
import { getPluginService, parseParams } from "../utils";
import { errorHandler } from "../utils";
import { IAdminController } from "../../types";
import { Id, StringMap } from "strapi-typed";
import { InvalidParamNavigationError } from "../../utils/InvalidParamNavigationError"

const adminControllers: IAdminController = {
  getService<T extends NavigationService = IAdminService>(name: NavigationServiceName = "admin") {
    return getPluginService<T>(name);
  },
  async get() {
    return await this.getService().get();
  },
  post(ctx) {
    const { auditLog } = ctx;
    const { body = {} } = ctx.request;
    return this.getService().post(body, auditLog);
  },
  put(ctx) {
    const { params, auditLog } = ctx;
    const { id } = parseParams<StringMap<string>, { id: Id }>(params);
    const { body = {} } = ctx.request;
    return this.getService().put(id, body, auditLog).catch(errorHandler(ctx));
  },
  async config() {
    return this.getService().config();
  },

  async updateConfig(ctx) {
    try {
      await this.getService().updateConfig(ctx.request.body);
    } catch (e: ToBeFixed) {
      errorHandler(ctx)(e);
    }
    return ctx.send({ status: 200 });
  },

  async restoreConfig(ctx) {
    try {
      await this.getService().restoreConfig();
    } catch (e: ToBeFixed) {
      errorHandler(ctx)(e);
    }
    return ctx.send({ status: 200 });
  },

  async settingsConfig() {
    return this.getService().config(true);
  },

  async settingsRestart(ctx) {
    try {
      await this.getService().restart();
      return ctx.send({ status: 200 });
    } catch (e: ToBeFixed) {
      errorHandler(ctx)(e);
    }
  },
  async getById(ctx) {
    const { params } = ctx;
    const { id } = parseParams<StringMap<string>, { id: Id }>(params);
    return this.getService().getById(id);
  },
  async getContentTypeItems(ctx) {
    const { params, query = {} } = ctx;
    const { model } = parseParams<StringMap<string>, { model: string }>(params);
    return this.getService<ICommonService>("common").getContentTypeItems(model, query);
  },

  fillFromOtherLocale(ctx) {
    const { params, auditLog } = ctx;
    const { source, target } = parseParams<
      StringMap<string>,
      { source: number; target: number }
    >(params);

    assertIsNumber(
      source,
      new InvalidParamNavigationError("Source's id is not a number")
    );
    assertIsNumber(
      target,
      new InvalidParamNavigationError("Target's id is not a number")
    );

    return this.getService().fillFromOtherLocale({ source, target, auditLog });
  }
};

export default adminControllers;