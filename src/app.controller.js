import connectDB from "./DB/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import postRouter from "./modules/post/post.controller.js";
import adminRouter from "./modules/admin/admin.controller.js";
import commentRouter from "./modules/comment/comment.controller.js";
import chatRouter from "./modules/chat/chat.controller.js";
import globalErrorHandler from "./utils/error handling/global.error.handler.js";
import notFoundHandler from "./utils/error handling/not.found.handler.js";
import { schema } from "./app.schema.js";
import { createHandler } from "graphql-http/lib/use/express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 5 * 1000 * 60,
  limit: 2,
  // limit: async function(req, res){
  // if (user.role == " admin") return 20
  // return 2
  // // },
  // message: "Exceed the limit!",
  // statusCode: 400,
  handler: (req, res, next) => {
    return next(new Error(options.message, { cause: options.statusCode }));
  },
  legacyHeaders: false,
  standardHeaders: "draft-7",
  // keyGenerator: (req, res) => {
  //   return req.ip;
  // },
  // requestPropertyName: "combany",
  // skip: (req, res) => {
  //   return ["::1", "192.168.0.52"].includes("::1");
  // },
  // skipSuccessfulRequests: true,
  // skipFailedRequests
});

const bootstrap = async (app, express) => {
  // connectDB
  await connectDB();
  app.use(limiter);
  app.use(cors());
  app.use(
    "/graphql",
    createHandler({
      schema,
      context: (req) => {
        const { authorization } = req.headers;
        return { authorization };
      },
      formatError: (err) => {
        return {
          success: false,
          message: err.originalError?.message,
          statusCode: err.originalError?.cause || 500,
        };
      },
    }),
  );
  app.use(helmet());
  // parser
  app.use(express.json());

  // files
  // app.use("/uploads", express.static("uploads"))

  ///////////////////////////
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/post", postRouter);
  app.use("/comment", commentRouter);
  app.use("/admin", adminRouter);
  app.use("/chat", chatRouter);
  // not found
  app.use(notFoundHandler);
  // global error handler
  app.use(globalErrorHandler);
};

export default bootstrap;
